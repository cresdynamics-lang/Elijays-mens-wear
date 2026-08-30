-- Support a second display image per color variant (Enzo/MensWorld style gallery with 2 images per color).
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS image_url2 VARCHAR(500);