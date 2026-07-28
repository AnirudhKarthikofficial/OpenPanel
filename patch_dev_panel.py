import sys

with open('install.sh', 'r') as f:
    content = f.read()

old_block = """setup_dev_panel() {
    print_banner
    echo -e "${BOLD}--- [5] Setup Developer Panel & Podman Mode (Port 3000) ---${NC}\\n"
    
    log_info "Initializing Developer Panel separately via dev.jtg..."
    
    chmod +x dev.jtg 2>/dev/null || true
    if [ -f "dev.jtg" ]; then
        log_info "Executing dev.jtg installer..."
        bash dev.jtg
    else
        log_error "dev.jtg script not found!"
    fi

    log_success "=================================================="
    log_success " Developer Panel initialized on Port 3000!"
    log_success " Configured in dev.jtg with Podman/Docker support."
    log_success " Separate PM2 process: jtg-dev-panel"
    log_success "=================================================="
}"""

new_block = """setup_dev_panel() {
    print_banner
    echo -e "${BOLD}--- [5] Setup Developer Panel & Podman Mode (Port 3000) ---${NC}\\n"
    
    log_info "Initializing Developer Panel separately via dev.jtg..."
    
    if [ -f "package.json" ] && grep -q "react-example" "package.json" 2>/dev/null; then
        WORK_DIR="."
    elif [ -d "Jtg" ]; then
        WORK_DIR="Jtg"
    else
        log_error "'Jtg' directory not found! Please install the panel first (Option 1)."
        return
    fi
    
    cd "$WORK_DIR" || { log_error "Failed to enter the directory!"; return; }

    log_info "Creating dev.jtg initialization script..."
cat << 'EOF' > dev.jtg
#!/bin/bash
# JTG Developer Panel & Podman Environment Initializer
# Standalone Developer Panel Installation on Port 3000

set -e

GREEN='\\033[0;32m'
BLUE='\\033[0;34m'
YELLOW='\\033[1;33m'
NC='\\033[0m'
BOLD='\\033[1m'

echo -e "${BLUE}${BOLD}========================================================${NC}"
echo -e "${BLUE}${BOLD}      JTG DEVELOPER PANEL & PODMAN SETUP (dev.jtg)      ${NC}"
echo -e "${BLUE}${BOLD}               Running on Port: 3000                    ${NC}"
echo -e "${BLUE}${BOLD}========================================================${NC}"

if command -v podman &> /dev/null; then
    echo -e "${GREEN}[JTG DEV] Podman runtime detected.${NC}"
else
    echo -e "${YELLOW}[JTG DEV] Podman not found. Checking Docker...${NC}"
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}[JTG DEV] Docker engine available.${NC}"
    else
        echo -e "${YELLOW}[JTG DEV] Installing Podman engine...${NC}"
        if command -v apt-get &> /dev/null; then
            sudo apt-get update -y && sudo apt-get install -y podman || true
        elif command -v yum &> /dev/null; then
            sudo yum install -y podman || true
        fi
    fi
fi

export PODMAN_USERNS=keep-id
export PODMAN_ROOTLESS=1

echo -e "${BLUE}[JTG DEV] Creating PM2 ecosystem config for Developer Panel...${NC}"
cat << 'INNER_EOF' > ecosystem.dev.cjs
module.exports = {
  apps: [
    {
      name: "jtg-dev-panel",
      script: "npm",
      args: "run dev",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        VITE_ENABLE_DEVELOPER_PANEL: "true"
      }
    }
  ]
};
INNER_EOF

if command -v pm2 &> /dev/null || npx pm2 -v &> /dev/null; then
    echo -e "${BLUE}[JTG DEV] Starting Developer Panel on Port 3000 via PM2...${NC}"
    npm i --quiet || true
    npx pm2 start ecosystem.dev.cjs 2>/dev/null || npx pm2 restart jtg-dev-panel 2>/dev/null || true
    npx pm2 save || true
fi

echo -e "${GREEN}${BOLD}========================================================${NC}"
echo -e "${GREEN}${BOLD} [SUCCESS] Developer Panel successfully initialized!${NC}"
echo -e "${GREEN}${BOLD} Separate PM2 process: jtg-dev-panel${NC}"
echo -e "${GREEN}${BOLD} Access URL: http://<YOUR-SERVER-IP>:3000/developer${NC}"
echo -e "${GREEN}${BOLD} Podman & Docker support activated.${NC}"
echo -e "${GREEN}${BOLD}========================================================${NC}"
