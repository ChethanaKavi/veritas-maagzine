#!/bin/bash
# ============================================================
# Veritas Magazine — Server Deploy & Fix Script
# Run this on your DigitalOcean server to fix 502 errors
# Usage: bash deploy.sh
# ============================================================

set -e

BACKEND_DIR="/var/www/veritas/backend"
FRONTEND_DIR="/var/www/veritas/frontend"
LOG_DIR="/var/log/veritas"

echo "=== [1/7] Creating log directory ==="
mkdir -p "$LOG_DIR"

echo "=== [2/7] Moving into backend directory ==="
cd "$BACKEND_DIR"

echo "=== [3/7] Checking .env file ==="
if [ ! -f ".env" ]; then
  echo "ERROR: .env file missing at $BACKEND_DIR/.env"
  echo "Create it with: DATABASE_URL=postgresql://user:pass@localhost:5432/veritas"
  exit 1
fi

echo "=== [4/7] Installing dependencies ==="
npm install --production=false

echo "=== [5/7] Generating Prisma client ==="
npx prisma generate

echo "=== [6/7] Building TypeScript ==="
npm run build

echo "=== [7/7] Starting/Restarting with PM2 ==="
# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
  echo "PM2 not found — installing..."
  npm install -g pm2
fi

# Stop existing instance if running
pm2 stop veritas-backend 2>/dev/null || true
pm2 delete veritas-backend 2>/dev/null || true

# Start fresh with ecosystem config
pm2 start ecosystem.config.js

# Save PM2 process list so it survives server reboots
pm2 save

# Enable PM2 to auto-start on system reboot
pm2 startup systemd -u root --hp /root || pm2 startup

echo ""
echo "====================================="
echo "✅ Backend deployed successfully!"
echo "====================================="
echo ""
echo "Check status:  pm2 status"
echo "View logs:     pm2 logs veritas-backend"
echo "Health check:  curl http://localhost:4000/health"
echo ""
