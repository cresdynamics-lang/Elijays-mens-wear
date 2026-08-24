const { formatResponse } = require('../utils/responseFormatter');
const db = require('../config/db');
const { attachVariantAvailability } = require('../utils/productAvailability');
const { optimizeCloudinaryUrl } = require('../utils/cloudinaryImage');

const CACHE_TTL_MS = 5 * 60 * 1000;
let catalogueCache = null;
let catalogueCacheTime = 0;

exports.invalidateCatalogueCache = () => {
    catalogueCache = null;
    catalogueCacheTime = 0;
};

const toImageUrl = (product) => product.thumbnail || product.image_url || null;

exports.getCatalogue = async (req, res, next) => {
    try {
        const now = Date.now();
        if (catalogueCache && now - catalogueCacheTime < CACHE_TTL_MS) {
            res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
            return formatResponse(res, 200, true, 'Catalogue fetched from cache', catalogueCache);
        }

        const [productsResult, categoriesResult, brandsResult] = await Promise.all([
            db.query(`
                SELECT
                    p.id,
                    p.slug,
                    p.name,
                    p.price,
                    p.discount_price,
                    p.is_featured,
                    p.is_active,
                    p.stock_quantity,
                    p.thumbnail,
                    c.name AS category_name,
                    c.slug AS category_slug,
                    p_cat.name AS parent_category_name,
                    p_cat.slug AS parent_category_slug,
                    b.name AS brand_name,
                    b.slug AS brand_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN categories p_cat ON c.parent_id = p_cat.id
                LEFT JOIN brands b ON p.brand_id = b.id
                WHERE p.is_active = true
                ORDER BY p.created_at DESC
            `),
            db.query('SELECT id, name, slug, parent_id FROM categories ORDER BY name ASC'),
            db.query('SELECT id, name, slug FROM brands ORDER BY name ASC'),
        ]);

        let products = productsResult.rows.map((product) => {
            const thumb = product.thumbnail;
            let gridImage = null;
            try {
                gridImage = thumb
                    ? optimizeCloudinaryUrl(thumb, { width: 400 })
                    : null;
            } catch (error) {
                console.error('Error optimizing catalogue product image:', error);
                gridImage = thumb;
            }
            return {
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                discount_price: product.discount_price,
                is_featured: product.is_featured,
                is_active: product.is_active,
                stock_quantity: product.stock_quantity,
                category_name: product.category_name,
                category_slug: product.category_slug,
                parent_category_name: product.parent_category_name,
                parent_category_slug: product.parent_category_slug,
                brand_name: product.brand_name,
                brand_slug: product.brand_slug,
                thumbnail: thumb,
                thumbnail_optimized: gridImage,
                image_url: gridImage || thumb,
            };
        });

        try {
            products = await attachVariantAvailability(products);
        } catch (error) {
            console.error('Error attaching variant availability:', error);
            // Continue without variant availability enrichment
        }

        const ads = products
            .filter((product) => product.is_featured || product.online_in_stock)
            .slice(0, 12)
            .map((product) => ({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image_url: toImageUrl(product),
                description: product.description || '',
                brand_name: product.brand_name,
                category_name: product.category_name,
            }));

        catalogueCache = {
            generated_at: new Date().toISOString(),
            products,
            categories: categoriesResult.rows,
            brands: brandsResult.rows,
            ads,
        };
        catalogueCacheTime = now;

        res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
        formatResponse(res, 200, true, 'Catalogue fetched successfully', catalogueCache);
    } catch (error) {
        next(error);
    }
};

exports.getCatalogueAds = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT
                p.id,
                p.slug,
                p.name,
                p.price,
                p.thumbnail AS image_url,
                p.description,
                c.name AS category_name,
                b.name AS brand_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            WHERE p.is_active = true
            ORDER BY p.is_featured DESC, p.created_at DESC
            LIMIT 24
        `);

        const ads = result.rows.map((product) => ({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            description: product.description || '',
            category_name: product.category_name,
            brand_name: product.brand_name,
        }));

        res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=180');
        formatResponse(res, 200, true, 'Catalogue ads fetched successfully', ads);
    } catch (error) {
        next(error);
    }
};

const csvEscape = (value) => {
    const str = value == null ? '' : String(value);
    if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

const absoluteMediaUrl = (url, siteUrl) => {
    if (!url) return '';
    const raw = String(url).trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith('//')) return `https:${raw}`;
    const base = String(siteUrl || '').replace(/\/$/, '');
    if (!base) return raw;
    return raw.startsWith('/') ? `${base}${raw}` : `${base}/${raw}`;
};

/**
 * Meta Commerce Manager product catalogue CSV.
 * @route GET /api/catalogue/meta-products.csv
 * Paste this URL into Meta → Catalogue → Data sources → Scheduled feed.
 */
exports.getMetaCatalogueCsv = async (req, res, next) => {
    try {
        const siteUrl = (
            process.env.FRONTEND_URL ||
            process.env.CORS_ORIGIN ||
            process.env.SITE_URL ||
            'https://elijays-mens-wear.co.ke'
        ).replace(/\/$/, '');

        const result = await db.query(`
            SELECT
                p.id,
                p.sku,
                p.slug,
                p.name,
                p.description,
                p.price,
                p.discount_price,
                p.stock_quantity,
                p.thumbnail,
                p.images,
                p.is_active,
                c.name AS category_name,
                c.slug AS category_slug,
                p_cat.name AS parent_category_name,
                b.name AS brand_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN categories p_cat ON c.parent_id = p_cat.id
            LEFT JOIN brands b ON p.brand_id = b.id
            WHERE p.is_active = true
            ORDER BY p.created_at DESC
        `);

        const header = [
            'id',
            'title',
            'description',
            'availability',
            'condition',
            'price',
            'sale_price',
            'link',
            'image_link',
            'brand',
            'product_type',
            'google_product_category',
            'item_group_id',
            'additional_image_link',
        ];

        const rows = result.rows.map((product) => {
            const listPrice = Number(product.price) || 0;
            const sale = product.discount_price != null ? Number(product.discount_price) : null;
            const inStock = Number(product.stock_quantity) > 0;
            const productType = [product.parent_category_name, product.category_name]
                .filter(Boolean)
                .join(' > ') || product.category_name || 'Menswear';

            let extraImages = [];
            try {
                const imgs = typeof product.images === 'string'
                    ? JSON.parse(product.images)
                    : product.images;
                if (Array.isArray(imgs)) {
                    extraImages = imgs
                        .map((img) => (typeof img === 'string' ? img : img?.url))
                        .filter(Boolean)
                        .slice(0, 5)
                        .map((u) => absoluteMediaUrl(u, siteUrl));
                }
            } catch {
                extraImages = [];
            }

            const imageLink = absoluteMediaUrl(product.thumbnail, siteUrl) || extraImages[0] || '';
            const description = String(product.description || product.name || '')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 5000);

            return [
                product.sku || product.id,
                product.name,
                description || product.name,
                inStock ? 'in stock' : 'out of stock',
                'new',
                `${listPrice.toFixed(2)} KES`,
                sale != null && sale > 0 && sale < listPrice ? `${sale.toFixed(2)} KES` : '',
                `${siteUrl}/product/${product.slug}`,
                imageLink,
                product.brand_name || "ELIJAY'S Men's Wear",
                productType,
                'Apparel & Accessories > Clothing',
                product.slug || product.id,
                extraImages.filter((u) => u && u !== imageLink).join(','),
            ].map(csvEscape).join(',');
        });

        const csv = `${header.join(',')}\n${rows.join('\n')}\n`;

        res.set({
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'inline; filename="meta-products.csv"',
            'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
        });
        res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};
