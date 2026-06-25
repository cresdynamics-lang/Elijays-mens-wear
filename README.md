# ELIJAY'S Men's Wear

Luxury menswear platform — full stack clone of Prince Esquire **without footwear**, separate database, repo, and deployment.

- **Repo:** [github.com/cresdynamics-lang/Elijays-mens-wear](https://github.com/cresdynamics-lang/Elijays-mens-wear)
- **Database:** `eljays_db`
- **Brand:** Gold `#F7D138` + black luxury theme

## Quick start (local)

**Already set up on this machine.** Open:

- Shop: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- Admin: [http://localhost:5173/admin/login](http://localhost:5173/admin/login) → `admin@elijays.co.ke` / `elijays2026`
- POS: [http://localhost:5173/pos/login](http://localhost:5173/pos/login) → `seller@elijays.co.ke` / `elijays2026`

To reset from scratch: `node scripts/eljays-setup-local.js`

See **[ELJAYS_SETUP.md](./ELJAYS_SETUP.md)** for the full guide.

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
