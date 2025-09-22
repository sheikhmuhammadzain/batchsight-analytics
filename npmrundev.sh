#!/bin/bash
# Auto setup React (Vite) Dev Server as systemd service with auto free port detection

APP_NAME="react-frontend"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"   # auto detect script folder
USER_NAME=$(whoami)
DEFAULT_PORT=8083

# Function to find free port
find_free_port() {
  local port=$1
  while ss -ltn | awk '{print $4}' | grep -q ":$port\$"; do
    port=$((port+1))
  done
  echo $port
}

PORT=$(find_free_port $DEFAULT_PORT)

echo "📂 Project path detected: $SCRIPT_DIR"
echo "👤 Running as user: $USER_NAME"
echo "🌐 Using port: $PORT"

# ✅ Step 1: Create systemd service
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=React Vite Dev Server
After=network.target

[Service]
Type=simple
User=$USER_NAME
WorkingDirectory=$SCRIPT_DIR
ExecStart=/usr/bin/npm run dev -- --host 0.0.0.0 --port $PORT
Restart=always
RestartSec=5
Environment=HOST=0.0.0.0
Environment=PORT=$PORT

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Systemd service created at $SERVICE_FILE"

# ✅ Step 2: Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable $APP_NAME
sudo systemctl restart $APP_NAME

# ✅ Step 3: Firewall allow
sudo ufw allow $PORT
sudo ufw reload

echo "🎉 Setup completed!"
echo "👉 Your React app will always be live at: http://$(curl -s ifconfig.me):$PORT/"

