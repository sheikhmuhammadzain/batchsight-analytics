#!/bin/bash
# 🚀 Auto Deploy React Production Build with Nginx

# === Config ===
APP_NAME="react-frontend"
PUBLIC_IP="103.18.20.205"

# Detect script directory
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$APP_DIR/dist"

# Prompt for port
read -p "Enter PUBLIC_PORT (e.g., 8095, 8060, 55000): " PUBLIC_PORT

# === Step 1: Validate dist/ folder ===
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ ERROR: dist/ folder not found at $DIST_DIR"
    echo "Run 'npm run build' first!"
    exit 1
fi

# === Step 2: Check if port is free ===
if sudo lsof -iTCP:$PUBLIC_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ ERROR: Port $PUBLIC_PORT is already in use! Choose another port."
    exit 1
else
    echo "✅ Port $PUBLIC_PORT is free, continuing..."
fi

# === Step 3: Install dependencies ===
echo "==> Installing Nginx + UFW if not installed..."
sudo apt update
sudo apt install -y nginx ufw

# === Step 4: Create Nginx config ===
NGINX_FILE="/etc/nginx/sites-enabled/${APP_NAME}_${PUBLIC_PORT}"

echo "==> Creating Nginx config at $NGINX_FILE..."
sudo bash -c "cat > $NGINX_FILE" <<EOF
server {
    listen $PUBLIC_PORT;
    server_name $PUBLIC_IP;

    root $DIST_DIR;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }
}
EOF

# === Step 5: Test + Reload Nginx ===
echo "==> Testing and restarting Nginx..."
sudo nginx -t && sudo systemctl reload nginx

# === Step 6: Open Firewall Port ===
echo "==> Setting up UFW..."
sudo ufw allow $PUBLIC_PORT
sudo ufw reload

# === Done ===
echo "✅ Setup completed!"
echo "👉 Your React app should be accessible at: http://$PUBLIC_IP:$PUBLIC_PORT/"

