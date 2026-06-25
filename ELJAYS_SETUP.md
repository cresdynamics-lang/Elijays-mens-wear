# ELIJAY'S — Local & Production Setup

This project is **completely separate** from Prince Esquire. Do not deploy to Prince's server or push to the Prince repo.

## 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+
- (Optional) Cloudinary account — folder `ELIJAYS`

## 2. Create database

```bash
cd backend
cp .env.example .env
```

Set in `.env`:

```env
DB_NAME=eljays_db
DB_USER=postgres
DB_PASSWORD=your_password
CLOUDINARY_FOLDER=ELIJAYS
CLOUDINARY_UPLOAD_PRESET=ELIJAYS
STORAGE_ALLOW_LOCAL=true
REQUIRE_CLOUDINARY=false
FRONTEND_URL=http://localhost:5173
```

Create DB:

```bash
node create_db.js
npm ci
npm run db:migrate
npm run seed:admin
```

Default admin comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

**Local credentials (already seeded):**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@elijays.co.ke` | `elijays2026` |
| POS Seller | `seller@elijays.co.ke` | `elijays2026` |

## 3. Seed POS inventory (Excel)

Bundled file: `backend/data/eljays-inventory-stock-june16.xlsx`

```bash
npm run seed:eljays-inventory
```

This creates POS stock lines for all 30 Excel categories (belts, suits, shirts, jackets, khakis, etc.) with opening stock from the sheet.

## 4. Import website catalog (Prince structure, no shoes)

Product images live in `backend/data/*-images/` (copied from Prince). Footwear folders are kept on disk but **not imported**.

Preview plan:

```bash
node scripts/eljays-import-catalog.js
```

Run imports (needs Cloudinary or local storage):

```bash
node scripts/eljays-import-catalog.js --run
npm run link:products
```

**Excluded imports:** formal-shoes, casual-shoes, loafers, chelsea boots.

## 5. Frontend

```bash
cd ../frontend
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api
npm ci
npm run dev
```

Logo: `frontend/public/eljays-logo.png` (round in navbar + favicon).

## 6. Git & GitHub

```bash
git init
git remote add origin https://github.com/cresdynamics-lang/Elijays-mens-wear.git
git add .
git commit -m "Initial ELIJAY'S Men's Wear platform"
git push -u origin main
```

## 7. Production (when ready)

Use a **new server or new site** — not Prince Esquire's DigitalOcean deploy.

1. Create PostgreSQL database `eljays_db` on the new host
2. Set production `.env` (domain, M-Pesa, Cloudinary, JWT)
3. Run `bash scripts/server-update.sh` from this repo on that server
4. Point DNS (e.g. `elijays.co.ke`) to the new host

## 8. Update when you have business details

| Item | File |
|------|------|
| Phone / email | `frontend/src/seo/seoData.js` |
| M-Pesa | `frontend/src/lib/storeContact.js`, `backend/.env` |
| WhatsApp notify | `backend/.env` → `WHATSAPP_NOTIFY_PHONE` |
| Address | Footer + `seoData.js` schemas |

## 9. Replace product photos

When ELIJAY'S photos are ready, upload to Cloudinary folder `ELIJAYS` and update products via Admin → Products, or re-run category import scripts with new image folders.
