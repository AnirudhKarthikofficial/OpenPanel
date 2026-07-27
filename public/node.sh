#!/bin/bash

# Node Installer Script for JTG Panel
# This script sets up a remote node for the panel

echo "======================================"
echo "    JTG Panel Node Setup Script       "
echo "======================================"

# Check for root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root"
  exit
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "[+] Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "[+] Docker is already installed."
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "[+] Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    echo "[+] Node.js is already installed."
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "[+] Installing PM2..."
    npm install -g pm2
fi

# Setup Agent Directory
mkdir -p /opt/jtg-panel-node
cd /opt/jtg-panel-node

# Create package.json
cat << 'PKGEOF' > package.json
{
  "name": "jtg-panel-node",
  "version": "1.0.0",
  "description": "Node agent for JTG Panel",
  "main": "agent.js",
  "dependencies": {
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6",
    "cors": "^2.8.5"
  }
}
PKGEOF

# Create agent.js
cat << 'AGENTEOF' > agent.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Auth Middleware
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer ' + process.env.NODE_KEY) {
    return res.status(401).send('Unauthorized');
  }
  next();
});

// Proxy to local Docker daemon
const socketPath = process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock';
app.use('/', createProxyMiddleware({
  target: { socketPath },
  changeOrigin: true
}));

const PORT = 6768;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node Agent listening on port ${PORT}`);
});
AGENTEOF

echo "[+] Installing agent dependencies..."
npm install

# Generate a random 32-character key
NODE_KEY=$(head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 32)
echo "NODE_KEY=$NODE_KEY" > .env

echo "[+] Starting Node Agent..."
pm2 start agent.js --name jtg-node
pm2 save
pm2 startup | tail -n 1 > pm2-startup.sh
chmod +x pm2-startup.sh
./pm2-startup.sh

IP_ADDR=$(curl -s ifconfig.me || echo "YOUR_VPS_IP")

echo "======================================"
echo "    Node Setup Complete!              "
echo "======================================"
echo "Use the following details in your Panel to connect this node:"
echo ""
echo "  IP Address : $IP_ADDR"
echo "  Port       : 6768"
echo "  Node Key   : $NODE_KEY"
echo ""
echo "======================================"
