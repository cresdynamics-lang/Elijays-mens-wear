INSERT INTO categories (id, name, slug, parent_id)
SELECT gen_random_uuid(), 'Jeans Shirts', 'jeans-shirts', '759eec11-1e62-43f5-8416-33fb2038a06b'::uuid
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'jeans-shirts')
UNION ALL
SELECT gen_random_uuid(), 'Khaki Shirts', 'khaki-shirts', '759eec11-1e62-43f5-8416-33fb2038a06b'::uuid
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'khaki-shirts')
UNION ALL
SELECT gen_random_uuid(), 'Boxers', 'boxers', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'boxers')
UNION ALL
SELECT gen_random_uuid(), 'Socks', 'socks', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'socks');
