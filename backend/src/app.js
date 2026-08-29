const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const pinoHttp = require('pino-http');
const path = require('path');
const logger = require('./utils/logger');
const requestId = require('./middleware/requestId');
const {
  globalLimiter,
  authLimiter,
  paymentLimiter,
  uploadLimiter,
  searchLimiter,
  strictLimiter,
} = require('./middleware/rateLimit');
const db = require('./config/db');

const app = express();

if (process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(requestId);
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.id,
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
    customErrorMessage: (req, res, err) => `${req.method} ${req.url} ${res.statusCode} — ${err.message}`,
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  })
);

app.use(
  helmet({
    // Frontend (5173) loads images from API/uploads (8000) — same-origin blocks <img> tags.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*'],
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '2mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.JSON_BODY_LIMIT || '2mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    const { getMediaStorageStatus } = require('./lib/mediaStorage');
    const media = getMediaStorageStatus();
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mediaStorage: media.provider,
      productionReady: media.productionReady,
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      message: err.message,
    });
  }
});

app.use('/api', globalLimiter);

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/pos/login', authLimiter);
app.use('/api/admin/auth/login', authLimiter);
app.use('/api/payments', paymentLimiter);
app.use('/api/admin/upload', uploadLimiter);
app.use('/api/search', searchLimiter);
app.use('/api/pos/sale', strictLimiter);
app.use('/api/inventory/import-excel', uploadLimiter);

app.use(
  '/uploads',
  (req, res, next) => {
    const origin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// --- CUSTOMER ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/catalogue', require('./routes/catalogueRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/brands', require('./routes/brandRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.get('/api/homepage', require('./controllers/bannerController').getHomepageData);

// --- ADMIN ROUTES ---
app.use('/api/admin/auth', require('./routes/adminAuthRoutes'));
app.use('/api/admin/products', require('./routes/adminProductRoutes'));
app.use('/api/admin/variants', require('./routes/variantRoutes'));
app.use('/api/admin/categories', require('./routes/adminCategoryRoutes'));
app.use('/api/admin/brands', require('./routes/adminBrandRoutes'));
app.use('/api/admin/orders', require('./routes/adminOrderRoutes'));
app.use('/api/admin/reviews', require('./routes/adminReviewRoutes'));
app.use('/api/admin/coupons', require('./routes/adminCouponRoutes'));
app.use('/api/admin/banners', require('./routes/adminBannerRoutes'));
app.use('/api/admin/blog', require('./routes/adminBlogRoutes'));
app.use('/api/admin/upload', require('./routes/adminUploadRoutes'));
app.use('/api/admin/upload', require('./routes/adminAiRoutes'));
app.use('/api/admin/customers', require('./routes/customerRoutes'));
app.use('/api/admin/dashboard', require('./routes/analyticsRoutes'));
app.use('/api/admin/settings', require('./routes/settingsRoutes'));
app.use('/api/admin/subscribers', require('./controllers/newsletterController').adminGetSubscribers);
app.use('/api/admin/inventory', require('./routes/adminInventoryRoutes'));

// --- POS & INVENTORY ROUTES ---
app.use('/api/auth/pos', require('./routes/auth.pos.routes'));
app.use('/api/pos', require('./routes/pos.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/shifts', require('./routes/shifts.routes'));
app.use('/api/reports', require('./routes/reports.routes'));
app.use('/api/sellers', require('./routes/sellers.routes'));
app.use('/api/settings', require('./routes/posSettings.routes'));
app.use('/api/pos-admin', require('./routes/posOverview.routes'));

app.use('/api/health', require('./routes/healthRoutes'));

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to ELIJAY\'S API', version: '1.0.0' });
});

app.get('/sitemap.xml', async (_req, res) => {
  try {
    const siteUrl = (
      process.env.FRONTEND_URL ||
      process.env.CORS_ORIGIN ||
      process.env.SITE_URL ||
      'https://elijays-mens-wear.co.ke'
    ).replace(/\/$/, '');

    const [productsResult, categoriesResult] = await Promise.all([
      db.query(`
        SELECT p.slug, p.updated_at
        FROM products p
        WHERE p.is_active = true
        ORDER BY p.updated_at DESC
      `),
      db.query(`
        SELECT c.slug, c.updated_at
        FROM categories c
        WHERE c.is_active = true
        ORDER BY c.updated_at DESC
      `),
    ]);

    const staticUrls = [
      { loc: '/', changefreq: 'daily', priority: '1.0' },
      { loc: '/products', changefreq: 'daily', priority: '0.9' },
      { loc: '/suits', changefreq: 'weekly', priority: '0.9' },
      { loc: '/shirts', changefreq: 'weekly', priority: '0.8' },
      { loc: '/trousers', changefreq: 'weekly', priority: '0.8' },
      { loc: '/jackets', changefreq: 'weekly', priority: '0.8' },
      { loc: '/sweaters', changefreq: 'weekly', priority: '0.8' },
      { loc: '/linen', changefreq: 'weekly', priority: '0.8' },
      { loc: '/about', changefreq: 'monthly', priority: '0.7' },
      { loc: '/contact', changefreq: 'monthly', priority: '0.8' },
      { loc: '/journal', changefreq: 'weekly', priority: '0.7' },
    ];

    const productUrls = productsResult.rows
      .filter((p) => p.slug)
      .map((p) => ({
        loc: `/product/${encodeURIComponent(p.slug)}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : undefined,
      }));

    const categoryUrls = categoriesResult.rows
      .filter((c) => c.slug)
      .map((c) => ({
        loc: `/${encodeURIComponent(c.slug)}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: c.updated_at ? new Date(c.updated_at).toISOString().split('T')[0] : undefined,
      }));

    const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...allUrls.map((u) => {
        const attrs = [`<loc>${siteUrl}${u.loc}</loc>`, `<changefreq>${u.changefreq}</changefreq>`, `<priority>${u.priority}</priority>`];
        if (u.lastmod) attrs.push(`<lastmod>${u.lastmod}</lastmod>`);
        return `  <url>\n    ${attrs.join('\n    ')}\n  </url>`;
      }),
      '</urlset>',
    ].join('\n');

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');
    res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  req.log?.error({ err, requestId: req.id, path: req.path }, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    requestId: req.id,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

module.exports = app;
