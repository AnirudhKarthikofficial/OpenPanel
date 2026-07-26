#!/bin/bash

# Set colors for a better-looking menu
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to install the panel
install_panel() {
    echo -e "\n${CYAN}[+] Installing dependencies... Please wait...${NC}"
    
    # Update system package index
    sudo apt update -y
    
    # Install curl and git
    sudo apt install curl git -y
    
    # Setup and install Node.js 20.x
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs 
    
    # Install PM2 globally
    sudo npm install -g pm2

    # Install Docker if not present (Required for the panel containers)
    if ! command -v docker &> /dev/null && ! command -v podman &> /dev/null; then
        echo -e "\n${CYAN}[+] Installing Docker...${NC}"
        curl -fsSL https://get.docker.com | sh
        sudo systemctl enable --now docker || true
    fi

    echo -e "\n${CYAN}[+] Downloading and setting up the Jtg Panel...${NC}"
    
    # Check if we are already in the Jtg directory
    if [ -f "package.json" ] && grep -q "react-example" "package.json" 2>/dev/null; then
        echo -e "${YELLOW}[!] It looks like you are already inside the Jtg panel directory. Running setup here...${NC}"
        WORK_DIR="."
    elif [ -d "Jtg" ]; then
        echo -e "${YELLOW}[!] The 'Jtg' folder already exists. Running setup inside it...${NC}"
        WORK_DIR="Jtg"
    else
        # Clone from GitHub
        git clone https://github.com/JishnuTheGamer/Jtg
        WORK_DIR="Jtg"
    fi
    
    # Navigate into the directory
    cd "$WORK_DIR" || { echo -e "${RED}[!] Failed to enter the directory!${NC}"; return; }
    
    # Ensure .env exists
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
        else
            echo "PORT=6767" > .env
            echo "JWT_SECRET=$(head -c 32 /dev/urandom | base64)" >> .env
        fi
    fi
    
    # Ensure ecosystem.config.cjs exists for PM2
    if [ ! -f "ecosystem.config.cjs" ]; then
cat << 'EOF' > ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "jtg-panel",
      script: "./dist/server.cjs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 6767
      }
    }
  ]
};
EOF
    fi

    # Install node modules
    npm i 
    
    # Create user and build
    npm run createuser
    npm run build
    
    # Start with PM2
    pm2 start ecosystem.config.cjs
    pm2 save
    
    echo -e "\n${GREEN}==========================================${NC}"
    echo -e "${GREEN} [✓] Panel successfully installed and started!${NC}"
    echo -e "${GREEN} MADE BY - JISHNU  | panel info  [Online] ${NC}"
    echo -e "${GREEN}==========================================${NC}"
    
    # Return to the main directory
    if [ "$WORK_DIR" = "Jtg" ]; then
        cd ..
    fi
}

# Function to update the panel
update_panel() {
    echo -e "\n${CYAN}[+] Updating the panel...${NC}"
    
    if [ -f "package.json" ] && grep -q "react-example" "package.json" 2>/dev/null; then
        WORK_DIR="."
    elif [ -d "Jtg" ]; then
        WORK_DIR="Jtg"
    else
        echo -e "${RED}[!] 'Jtg' directory not found! Please install the panel first (Option 1).${NC}"
        return
    fi
    
    cd "$WORK_DIR" || { echo -e "${RED}[!] Failed to enter the directory!${NC}"; return; }
        
    # Fetch new updates from GitHub
    git stash
    git pull
    
    # Update packages and rebuild
    npm i 
    npm run build 
    
    # Restart PM2 processes
    pm2 restart all
    
    echo -e "\n${GREEN}[✓] Panel successfully updated and restarted!${NC}"
    
    # Return to the main directory
    if [ "$WORK_DIR" = "Jtg" ]; then
        cd ..
    fi
}

# Main menu loop
while true; do
    echo -e "\n${YELLOW}========================================${NC}"
    echo -e "${GREEN}       JTG PANEL MANAGER MENU           ${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${CYAN}1.${NC} Install Panel (Auto Setup)"
    echo -e "${CYAN}2.${NC} Update Panel"
    echo -e "${RED}3.${NC} Exit"
    echo -e "${YELLOW}========================================${NC}"
    
    read -p "Choose an option (1/2/3): " choice

    case $choice in
        1)
            install_panel
            ;;
        2)
            update_panel
            ;;
        3)
            echo -e "${YELLOW}Exiting script... Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}[!] Invalid option! Please enter 1, 2, or 3.${NC}"
            ;;
    esac
done
