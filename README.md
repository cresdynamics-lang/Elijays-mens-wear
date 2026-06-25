# ELIJAY'S Men's Wear

Luxury menswear platform — full stack clone of Prince Esquire **without footwear**, separate database, repo, and deployment.

- **Repo:** [github.com/cresdynamics-lang/Elijays-mens-wear](https://github.com/cresdynamics-lang/Elijays-mens-wear)
- **Database:** `eljays_db`
- **Brand:** Gold `#F7D138` + black luxury theme

## Quick start (local)

See **[ELJAYS_SETUP.md](./ELJAYS_SETUP.md)** for the full guide.

```bash
# 1. Database
cd backend && cp .env.example .env   # set DB_NAME=eljays_db
node create_db.js
npm ci && npm run db:migrate && npm run seed:admin

# 2. Inventory from Excel (June 16 sheet bundled in backend/data/)
npm run seed:eljays-inventory

# 3. Website catalog (uses Prince image/data folders — no shoe imports)
node scripts/eljays-import-catalog.js --run
npm run link:products

# 4. Frontend
cd ../frontend && cp .env.example .env && npm ci && npm run dev
```

Backend API: `http://localhost:8000` · Frontend: `http://localhost:5173`

## What is different from Prince Esquire

| | Prince Esquire | ELIJAY'S |
|---|----------------|----------|
| Repo | Prince-Esquare | Elijays-mens-wear |
| Database | prince_esquare | eljays_db |
| Footwear | Yes | **No** |
| Theme | Navy + gold | **Black + gold** |
| Logo | Prince | **Round ELIJAY'S logo** |

## Placeholders to update later

- Phone / WhatsApp (`frontend/src/seo/seoData.js`, `backend/.env`)
- M-Pesa Pay Bill (`frontend/src/lib/storeContact.js`)
- Domain (`SITE_URL` in seoData.js)
- Cloudinary folder (`ELIJAYS` in backend `.env`)

## Inventory categories (from Excel)

30 stock lines including belts, suits, shirts, jackets, khakis, polos, sweaters, ties, caps, socks, etc. — see `backend/data/eljays-excel-categories.json`.
