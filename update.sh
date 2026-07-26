#!/bin/bash
git pull
npm install
npm run build
pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs || npm run start || npm run dev
