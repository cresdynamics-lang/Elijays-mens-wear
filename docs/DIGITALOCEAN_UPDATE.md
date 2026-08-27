# Deploy & update live site on DigitalOcean (167.71.17.195)

## 0. First-time setup (fresh Ubuntu droplet)

SSH in, then run the bootstrap script. It installs Node/Postgres/nginx/PM2, clones
the repo, writes `.env` files, migrates + seeds the DB, builds the frontend, and
configures nginx + PM2.

```bash
ssh root@167.71.17.195
DO_DOMAIN=elijays.co.ke \
CLOUDINARY_URL='cloudinary://key:secret@account' \
EMAIL_FOR_SSL=admin@elijays.co.ke \
bash scripts/server-setup.sh
```

Set `EMAIL_FOR_SSL` to auto-provision a Let's Encrypt certificate. The script
autogenerates `JWT_SECRET`, `INTERNAL_KEY`, and the Postgres password unless you
pass them. Admin login defaults to `admin@elijays.co.ke` / `elijays2026`.

After this, skip to step 4 below for every future update.

## 1. SSH into the server

You need the droplet SSH private key (from DigitalOcean → Droplet → Access).

```bash
ssh root@167.71.17.195
# or
ssh ubuntu@167.71.17.195
```

If `Permission denied (publickey)`, add your key in DigitalOcean console or use the one-time password reset.

## 2. Find the app directory

```bash
bash /path/to/Elijays-Mens-Wear/scripts/server-find-app.sh
```

Common locations:

- `/var/www/Elijays-mens-wear`
- `/home/ubuntu/Elijays-Mens-Wear`

Look for a folder that contains both `backend/` and `frontend/`.

Also check:

```bash
pm2 list
cat /etc/nginx/sites-enabled/*
```

## 3. Backup database (required before update)

```bash
pg_dump eljays_db | gzip > ~/backup_$(date +%F).sql.gz
```

## 4. Update code safely

```bash
cd /var/www/Elijays-mens-wear   # your actual path
git pull origin main
bash scripts/server-update.sh
```

The update script:

- Backs up the database
- Pulls latest code
- Runs **only pending** migrations (skips already-applied SQL)
- Builds frontend
- Restarts PM2

## 5. Database — what changes on live data

Migrations are **additive** (new tables/columns/indexes). Existing products, orders, and stock rows stay.

| Migration range | What it does |
|-----------------|--------------|
| 010 | `angle_images` on variants |
| 011–012 | New POS tables + link columns on `products` / `pos_products` |
| 013–015, 022 | Indexes only (no data loss) |
| 016–021 | POS sales, SKUs, store stock, `website_details` JSONB |
| 018 | Backfills `sku` on products/variants (updates empty SKUs only) |

**Do not run on production:**

- `npm run db:seed:pos`
- `npm run seed:dummy-products`
- `npm run import:stock` (unless you intend to overwrite stock sheet)
- `npm run angles:apply` (unless you want to replace product images)

**First deploy with POS on old DB:** `migrate.js` auto-marks older migrations as applied if `pos_products` already exists.

## 6. Production `.env` tips

In `backend/.env` on the server:

```env
NODE_ENV=production
TRUST_PROXY=true
AUTO_BOOTSTRAP=true
REQUIRE_CLOUDINARY=true
STORAGE_ALLOW_LOCAL=false
CLOUDINARY_URL=...
FRONTEND_URL=https://your-domain.com
```

Set `AUTO_BOOTSTRAP=false` for the first restart if you want to skip automatic POS link sync; turn back on after verifying.

## 7. Nginx

After frontend build, nginx should serve `frontend/dist`. Example:

```nginx
root /var/www/Elijays-mens-wear/frontend/dist;
location /api/ {
    proxy_pass http://127.0.0.1:8000;
}
```

Reload: `sudo nginx -t && sudo systemctl reload nginx`

## 8. Verify

```bash
curl http://127.0.0.1:8000/api/health
curl http://127.0.0.1:8000/api/health/data
```

Open the site in a browser and test product page + admin login.
