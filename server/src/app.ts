import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { publicRoutes } from './routes/public.routes';
import { authRoutes } from './routes/auth.routes';
import { adminRoutes } from './routes/admin.routes';
import { portfolioRepository } from './repositories/portfolio.repository';

export const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', secureHeaders());

// CORS configuration
const allowedOrigin = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow localhost in development, or matching configured production origin
      if (!origin || origin.includes('localhost') || origin === allowedOrigin) {
        return origin || allowedOrigin;
      }
      return allowedOrigin;
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Health check endpoint
app.get('/api/v1/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Dynamic sitemap generation
app.get('/api/v1/sitemap.xml', async (c) => {
  const settings = await portfolioRepository.getSettings();
  const baseUrl = settings?.siteUrl || 'https://faza-portfolio.vercel.app';
  const projects = await portfolioRepository.getProjects({ onlyPublished: true });
  const blogs = await portfolioRepository.getBlogPosts({ onlyPublished: true });

  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'daily' },
    ...projects.map((p) => ({
      loc: `${baseUrl}/projects/${p.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
    ...blogs.map((b) => ({
      loc: `${baseUrl}/blog/${b.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
    })),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  c.header('Content-Type', 'application/xml');
  return c.body(sitemapXml);
});

// Mount modular subroutes
app.route('/api/v1/public', publicRoutes);
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/admin', adminRoutes);

// Global 404 handler for API routes
app.notFound((c) => {
  return c.json({ success: false, error: 'Endpoint not found' }, 404);
});

// Centralized error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  const isProduction = process.env.NODE_ENV === 'production';
  return c.json(
    {
      success: false,
      error: isProduction ? 'Internal Server Error' : err.message,
    },
    500
  );
});

export default app;
