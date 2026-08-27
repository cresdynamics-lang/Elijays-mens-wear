#!/bin/bash
# One-time DigitalOcean bootstrap for ELIJAY'S Men's Wear.
# Run as root (or with sudo) on a fresh Ubuntu 22.04+ droplet.
#
# What it does:
#   1. Installs Node 20, PostgreSQL, nginx, PM2
#   2. Clones the repo to /var/www/Elijays-Mens-Wear
#   3. Writes backend/.env and frontend/.env.production
#   4. Creates the database, runs migrations, seeds admin
#   5. Builds the frontend
#   6. Configures nginx (reverse proxy /api -> :8000, serves dist) + optional SSL
#   7. Starts the API under PM2
#
# Required env (set before running):
#   DO_DOMAIN          e.g. elijays.co.ke   (used for nginx server_name + FRONTEND_URL)
#   CLOUDINARY_URL     full cloudinary URL  (required in production)
#   ADMIN_EMAIL        optional, default admin@elijays.co.ke
#   ADMIN_PASSWORD     optional, default elijays2026
#   DB_PASSWORD        postgres password (default: random if empty)
#   JWT_SECRET         optional (auto-generated if empty)
#   INTERNAL_KEY       optional (auto-generated if empty)
#   EMAIL_FOR_SSL      optional, enables Let's Encrypt certbot
#
# Optional M-Pesa (leave blank if not used):
#   MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET / MPESA_SHORTCODE / MPESA_PASSKEY
#
# Example:
#   DO_DOMAIN=elijays.co.ke CLOUDINARY_URL=cloudinary://key:sec@acct \
#   EMAIL_FOR_SSL=admin@elijays.co.ke bash scripts/server-setup.sh

set -euo pipefail

REPO_URL="https://github.com/cresdynamics-lang/Elijays-Mens-Wear.git"
APP_DIR="${APP_DIR:-/var/www/Elijays-Mens-Wear}"
DO_DOMAIN="${DO_DOMAIN:-}"
CLOUDINARY_URL="${CLOUDINARY_URL:-}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@elijays.co.ke}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-elijays2026}"
DB_NAME="${DB_NAME:-eljays_db}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c18)}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 24 | tr -d '/+=' | head -c32)}"
INTERNAL_KEY="${INTERNAL_KEY:-$(openssl rand -base64 24 | tr -d '/+=' | head -c32)}"
EMAIL_FOR_SSL="${EMAIL_FOR_SSL:-}"
MPESA_CONSUMER_KEY="${MPESA_CONSUMER_KEY:-}"
MPESA_CONSUMER_SECRET="${MPESA_CONSUMER_SECRET:-}"
MPESA_SHORTCODE="${MPESA_SHORTCODE:-}"
MPESA_PASSKEY="${MPESA_PASSKEY:-}"
WHATSAPP_NOTIFY_PHONE="${WHATSAPP_NOTIFY_PHONE:-254708269209}"

if [ -z "$DO_DOMAIN" ]; then echo "ERROR: set DO_DOMAIN (e.g. DO_DOMAIN=elijays.co.ke)"; exit 1; fi
if [ -z "$CLOUDINARY_URL" ]; then echo "ERROR: set CLOUDINARY_URL"; exit 1; fi

echo "=== ELIJAY'S bootstrap — domain $DO_DOMAIN, app $APP_DIR ==="

echo "=== System packages ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git build-essential nginx postgresql postgresql-contrib openssl

echo "=== Node 20 ==="
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
npm install -g pm2

echo "=== Clone repo ==="
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"
git checkout main && git pull origin main

echo "=== Backend .env ==="
BACKEND="$APP_DIR/backend"
cat > "$BACKEND/.env" <<EOF
NODE_ENV=production
PORT=8000
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=127.0.0.1
DB_PORT=5432
CLOUDINARY_URL=$CLOUDINARY_URL
CLOUDINARY_FOLDER=ELIJAYS
STORAGE_ALLOW_LOCAL=false
REQUIRE_CLOUDINARY=true
TRUST_PROXY=true
AUTO_BOOTSTRAP=true
JWT_SECRET=$JWT_SECRET
INTERNAL_KEY=$INTERNAL_KEY
FRONTEND_URL=https://$DO_DOMAIN
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
WHATSAPP_NOTIFY_PHONE=$WHATSAPP_NOTIFY_PHONE
MPESA_CONSUMER_KEY=$MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET=$MPESA_CONSUMER_SECRET
MPESA_SHORTCODE=$MPESA_SHORTCODE
MPESA_PASSKEY=$MPESA_PASSKEY
EOF

echo "=== PostgreSQL ==="
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='$DB_NAME'\" | grep -q 1 || createdb $DB_NAME"
su - postgres -c "psql -c \"ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';\""

echo "=== Backend install + migrate + seed ==="
cd "$BACKEND"
npm ci --omit=dev
node create_db.js 2>/dev/null || true
npm run db:migrate
npm run seed:admin

echo "=== Frontend build ==="
FRONTEND="$APP_DIR/frontend"
cd "$FRONTEND"
cat > "$FRONTEND/.env.production" <<EOF
VITE_API_URL=/api
VITE_WHATSAPP_NUMBER=254708269209
VITE_INTERNAL_KEY=$INTERNAL_KEY
EOF
npm ci --include=dev
NODE_ENV=production npm run build
chmod -R a+rX "$FRONTEND/dist"

echo "=== Nginx ==="
cat > /etc/nginx/sites-available/elijays <<EOF
server {
    listen 80;
    server_name $DO_DOMAIN www.$DO_DOMAIN;

    client_max_body_size 20M;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
    }

    location / {
        root $FRONTEND/dist;
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)\$ {
        root $FRONTEND/dist;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
EOF
ln -sf /etc/nginx/sites-available/elijays /etc/nginx/sites-enabled/elijays
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "=== SSL (optional) ==="
if [ -n "$EMAIL_FOR_SSL" ]; then
  apt-get install -y certbot python3-certbot-nginx
  certbot --nginx -n --agree-tos -m "$EMAIL_FOR_SSL" -d "$DO_DOMAIN" -d "www.$DO_DOMAIN" || echo "WARN: certbot failed; check DNS/email."
fi

echo "=== Start API (PM2) ==="
cd "$BACKEND"
pm2 delete elijays-api 2>/dev/null || true
pm2 start src/index.js --name elijays-api
pm2 save
pm2 startup | tail -2 || true

echo "=== Health check ==="
sleep 4
curl -fs "http://127.0.0.1:8000/api/health" && echo "  <- API OK" || echo "WARN: API health failed"

echo ""
echo "=== Done ==="
echo "Site: http://$DO_DOMAIN  (https if SSL configured)"
echo "For future updates, run: cd $APP_DIR && bash scripts/server-update.sh"
