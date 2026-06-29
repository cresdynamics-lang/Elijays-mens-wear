-- Fix: Create Sweaters subcategory and move sweat-shirt products into it
-- First get the Sweaters parent category ID
DO $$
DECLARE
  v_sweaters_id uuid;
  v_swcount integer;
  v_sweatshirts_id uuid;
BEGIN
  SELECT id INTO v_sweaters_id FROM categories WHERE slug = 'sweaters';
  
  IF v_sweaters_id IS NULL THEN
    RAISE NOTICE 'Sweaters parent not found';
    RETURN;
  END IF;

  -- Create the Sweatshirts subcategory under Sweaters if it doesn't exist
  INSERT INTO categories (id, name, slug, parent_id)
  SELECT gen_random_uuid(), 'Sweatshirts', 'sweater-items', v_sweaters_id
  WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'sweater-items')
  RETURNING id INTO v_sweatshirts_id;

  -- If it already existed, get its ID
  IF v_sweatshirts_id IS NULL THEN
    SELECT id INTO v_sweatshirts_id FROM categories WHERE slug = 'sweater-items';
  END IF;

  -- Move all Sweat-shirt products (currently under T-shirts > Sweat-shirts) to Sweaters > Sweater-items
  UPDATE products p
  SET category_id = v_sweatshirts_id
  WHERE p.category_id IN (
    SELECT id FROM categories WHERE slug = 'sweat-shirts'
  );

  GET DIAGNOSTICS v_swcount = ROW_COUNT;
  RAISE NOTICE 'Moved % sweat-shirt products to Sweaters > Sweater-items', v_swcount;
END $$;

-- Activate all Presidential shirts (currently inactive but have stock/photos)
UPDATE products p
SET is_active = true
WHERE p.category_id IN (
  SELECT id FROM categories WHERE slug = 'presidential'
)
AND p.thumbnail IS NOT NULL
AND COALESCE(p.stock_quantity, 0) >= 0;

-- Activate all Sweaters products (from new subcategory)
UPDATE products p
SET is_active = true
WHERE p.category_id IN (
  SELECT id FROM categories WHERE parent_id IN (
    SELECT id FROM categories WHERE slug = 'sweaters'
  )
)
AND p.thumbnail IS NOT NULL;

-- Also activate Three piece suits (subcategory of Suits) that are inactive
UPDATE products p
SET is_active = true
WHERE p.category_id IN (
  SELECT id FROM categories WHERE slug = 'three-piece'
)
AND p.thumbnail IS NOT NULL
AND COALESCE(p.stock_quantity, 0) >= 0;
