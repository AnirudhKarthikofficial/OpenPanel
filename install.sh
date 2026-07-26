#!/usr/bin/env bash

# =========================================================
# JTG Panel - Automated Installation & Management Script
# Repository: https://github.com/JishnuTheGamer/Jtg
# =========================================================

set -e

# Colors for UI
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# Default Installation Directory
INSTALL_DIR="/opt/jtg-panel"
REPO_URL="https://github.com/JishnuTheGamer/Jtg.git"

print_banner() {
    clear
    echo -e "${CYAN}${BOLD}"
    echo "  ========================================================"
    echo "   _____ _____ _____   _____                  _           "
    echo "  |_   _|_   _/ ____| |  __ \                | |          "
    echo "    | |   | | | |  __ | |__) |__ _ n  ___| |          "
    echo "    | |   | | | | |_ ||  ___/ _ \ ' \/ _ \ |          "
    echo "   _| |_  | | | |__| || |  |  __/ | | |  __/ |          "
    echo "  |_____| |_|  \____||_|   \___|_| |_|\___|_|          "
    echo "                                                          "
    echo "            JTG PANEL MANAGEMENT & INSTALLER              "
    echo "            Main Panel Default Port: 6767                 "
    echo "  ========================================================"
    echo -e "${RESET}"
}

log_info() {
    echo -e "${BLUE}[INFO]${RESET} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${RESET} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${RESET} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${RESET} $1"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_warning "This script is recommended to be run as root or with sudo for system dependency installation."
    fi
}

install_dependencies() {
    log_info "Updating system package lists..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update -y
        sudo apt-get install -y curl wget git build-essential ca-certificates gnupg lsb-release
    elif command -v yum &> /dev/null; then
        sudo yum update -y
        sudo yum install -y curl wget git make gcc-c++ ca-certificates
    else
        log_warning "Package manager not explicitly handled. Assuming core utilities exist."
    fi

    # Check / Install Node.js (v20 LTS recommended)
    if ! command -v node &> /dev/null || [ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 18 ]; then
        log_info "Installing Node.js v20 (LTS)..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs || sudo yum install -y nodejs
    else
        log_success "Node.js $(node -v) is already installed."
    fi

    # Check / Install PM2 globally
    if ! command -v pm2 &> /dev/null; then
        log_info "Installing PM2 globally..."
        sudo npm install -g pm2
    else
        log_success "PM2 is already installed."
    fi

    # Check / Install Docker
    if ! command -v docker &> /dev/null; then
        log_info "Installing Docker..."
        curl -fsSL https://get.docker.com | sh || log_warning "Docker auto-install skipped or failed. You can install Docker manually if needed."
        if command -v systemctl &> /dev/null; then
            sudo systemctl enable --now docker || true
        fi
    else
        log_success "Docker is already installed."
    fi
}

install_panel() {
    print_banner
    echo -e "${BOLD}--- [1] Full Panel Installation ---${RESET}\n"

    check_root
    install_dependencies

    # Determine work directory
    CURRENT_DIR=$(pwd)
    if [ -f "$CURRENT_DIR/package.json" ] && grep -q "react-example" "$CURRENT_DIR/package.json" 2>/dev/null; then
        WORK_DIR="$CURRENT_DIR"
        log_info "Running installation directly in current directory: $WORK_DIR"
    else
        echo -e "\nWhere would you like to install JTG Panel? (Default: $INSTALL_DIR)"
        read -p "Target Path [$INSTALL_DIR]: " USER_PATH
        WORK_DIR="${USER_PATH:-$INSTALL_DIR}"

        if [ ! -d "$WORK_DIR" ]; then
            log_info "Cloning repository from $REPO_URL to $WORK_DIR ..."
            git clone "$REPO_URL" "$WORK_DIR"
        else
            log_info "Directory $WORK_DIR exists. Pulling latest code..."
            cd "$WORK_DIR"
            git pull || true
        fi
        cd "$WORK_DIR"
    fi

    log_info "Installing NPM dependencies..."
    npm install

    if [ ! -f ".env" ]; then
        log_info "Creating .env configuration file..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
        else
            echo "PORT=6767" > .env
            echo "JWT_SECRET=$(head -c 32 /dev/urandom | base64)" >> .env
        fi
    fi

    log_info "Building production bundles..."
    npm run build

    log_info "Creating Admin User..."
    npm run createuser || log_warning "Admin user creation step skipped or requires user input."

    log_info "Starting JTG Panel on port 6767 via PM2..."
    if [ -f "ecosystem.config.cjs" ]; then
        pm2 start ecosystem.config.cjs
    else
        pm2 start dist/server.cjs --name "jtg-panel" --env production
    fi
    pm2 save || true

    log_success "========================================================"
    log_success " JTG Panel successfully installed & started on PORT 6767!"
    log_success " Access URL: http://<YOUR-SERVER-IP>:6767"
    log_success "========================================================"
}

update_panel() {
    print_banner
    echo -e "${BOLD}--- [2] Update JTG Panel ---${RESET}\n"

    log_info "Pulling latest code updates..."
    git pull

    log_info "Updating dependencies..."
    npm install

    log_info "Building updated production bundle..."
    npm run build

    log_info "Restarting PM2 process..."
    if pm2 list | grep -q "jtg-panel"; then
        pm2 restart jtg-panel
    elif [ -f "ecosystem.config.cjs" ]; then
        pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs
    else
        npm run start &
    fi

    log_success "JTG Panel updated successfully!"
}

create_admin_user() {
    print_banner
    echo -e "${BOLD}--- [3] Create Admin User ---${RESET}\n"

    log_info "Running admin creation script..."
    npm run createuser

    log_success "Admin user operation complete."
}

restart_panel() {
    print_banner
    echo -e "${BOLD}--- [4] Restart JTG Panel ---${RESET}\n"

    log_info "Restarting panel process..."
    if command -v pm2 &> /dev/null; then
        pm2 restart all || pm2 start ecosystem.config.cjs
    else
        log_warning "PM2 not found. Attempting npm run start..."
        npm run start
    fi

    log_success "Panel restarted successfully!"
}

show_menu() {
    while true; do
        print_banner
        echo -e "  ${BOLD}1)${RESET} Install Panel (Auto Setup - Port 6767)"
        echo -e "  ${BOLD}2)${RESET} Update Panel"
        echo -e "  ${BOLD}3)${RESET} Create Admin User"
        echo -e "  ${BOLD}4)${RESET} Restart Panel"
        echo -e "  ${BOLD}5)${RESET} Exit"
        echo -e "\n========================================================"
        read -p " Choose an option (1-5): " CHOICE

        case "$CHOICE" in
            1)
                install_panel
                read -p "Press Enter to return to main menu..."
                ;;
            2)
                update_panel
                read -p "Press Enter to return to main menu..."
                ;;
            3)
                create_admin_user
                read -p "Press Enter to return to main menu..."
                ;;
            4)
                restart_panel
                read -p "Press Enter to return to main menu..."
                ;;
            5)
                echo -e "\nExiting installer. Goodbye!\n"
                exit 0
                ;;
            *)
                log_error "Invalid option! Please select 1, 2, 3, 4, or 5."
                sleep 1.5
                ;;
        esac
    done
}

# Run Menu
show_menu
