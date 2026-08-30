# PDP Enzo/MensWorld Rework — Checklist Report

Verified live on https://elijays-mens-wear.co.ke (commit `6103101`, deployed 2026-08-30).

## 1. Product display matches Enzo Cavalli & MensWorld Kenya
- [x] PDP layout restyled: `frontend/src/pages/ProductDetail.jsx` now renders Enzo-style left gallery + right info column.
- [x] Action buttons restructured to match: quantity stepper + prominent `Add to bag` button (dark/gold), with WhatsApp `Enquire` as a secondary button.
- [x] Description/variant tabs (Description / Details / Shipping) preserved, accordion displays match reference sites.
- [x] Title Case product names on page heading, related products, and grid cards (`displayName` in `productDescription.js`).

## 2. Hover shows a different color of the same product
- [x] Hovering the main image cycles through the other color's first image (`handleHoverEnter`/`handleHoverLeave` in `ProductDetail.jsx`); leaving restores the selected color.
- [x] Only shows when more than one color image exists (safe for single-color items).

## 3. Two display images per color + navigation
- [x] DB: `backend/src/db/migrations/051_add_variant_image_url2.sql` adds `product_variants.image_url2` (verified on server: column exists).
- [x] API: `productController.js` carries `image_url2` through create / update / list / detail responses.
- [x] Admin: `ProductsView.jsx` color groups now expose a second "Alt image (2nd view)" upload slot per color (`handleColorImage(groupKey, e, 2)`).
- [x] Data model: `frontend/src/utils/inventoryVariants.js` — `newColorGroup`, `flattenColorGroups`, `buildColorGroupsFromVariants`, `buildColorGroupsFromDetail` all handle `image_url2`.
- [x] Storefront: PDP gallery per-color thumbnail strip shows both images; prev/next arrows + dots navigate between them (dots render when >1 image).

## 4. White page background (no yellow/gold)
- [x] Removed `bg-primary` (gold `#D4AF37`) from PDP page, image panel, thumbnails, arrows, quantity box, and color cards.
- [x] Replaced with white backgrounds; text/swoop colors flipped to ink/subtle on white (loading/error/empty states included).
- [x] No `bg-primary`/`text-secondary` remnants in `ProductDetail.jsx` (grep verified clean).

## 5. AI descriptions in sentence case (not ALL CAPS)
- [x] Gemini prompt (`backend/src/services/geminiAi.js`): added "natural sentence case, NEVER ALL CAPS, only proper words / after full stops / list items capitalised, Title Case names".
- [x] Admin `handleAiDescribe` (`ProductsView.jsx`): name now Title Case, description now sentence-case normalized; no `.toUpperCase()`
- [x] Admin `handleInputChange`: `name` added to the skip-uppercase list.
- [x] Display safety net: `looksAllCaps` + `sentenceCase` in `productDescription.js` normalise legacy ALL-CAPS descriptions at render time in `ProductDescription.jsx`.

## 6. Deploy & verification
- [x] Frontend builds clean; only pre-existing chunk-size warning.
- [x] Pushed `6103101` to `origin/main`.
- [x] Manual DB backup taken (`/var/backups/elijays/pre-pdp-enzo-*.sql.gz`).
- [x] `scripts/server-update.sh` ran; API healthy, migration applied.
- [x] Live bundle `assets/index-BGsJC3da.js` confirmed; product endpoint returns 200 with `image_url2` in variants.

## Notes
- StickyAddToCart (`frontend/src/components/product/StickyAddToCart.jsx`) is currently unused; left as-is.
- Only products that have a second image uploaded will show gallery navigation; existing products get single images until admin re-saves.