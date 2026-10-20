import { Hono } from 'hono';
import { portfolioRepository } from '../repositories/portfolio.repository';
import { contactMessageSchema } from '../../../shared/src/schemas';
import { rateLimiter } from '../middleware/rateLimit.middleware';

export const publicRoutes = new Hono();

// Public Profile & Settings
publicRoutes.get('/profile', async (c) => {
  const profile = await portfolioRepository.getProfile();
  return c.json({ success: true, data: profile });
});

publicRoutes.get('/settings', async (c) => {
  const settings = await portfolioRepository.getSettings();
  return c.json({ success: true, data: settings });
});

// Skills
publicRoutes.get('/skills', async (c) => {
  const skills = await portfolioRepository.getSkills(false);
  return c.json({ success: true, data: skills });
});

// Experiences & Education
publicRoutes.get('/experiences', async (c) => {
  const experiences = await portfolioRepository.getExperiences();
  return c.json({ success: true, data: experiences });
});

publicRoutes.get('/education', async (c) => {
  const education = await portfolioRepository.getEducation();
  return c.json({ success: true, data: education });
});

publicRoutes.get('/learning', async (c) => {
  const learning = await portfolioRepository.getLearningJourney();
  return c.json({ success: true, data: learning });
});

// Projects (Published only)
publicRoutes.get('/projects', async (c) => {
  const projects = await portfolioRepository.getProjects({ onlyPublished: true });
  return c.json({ success: true, data: projects });
});

publicRoutes.get('/projects/:slug', async (c) => {
  const slug = c.req.param('slug');
  const project = await portfolioRepository.getProjectBySlug(slug, { onlyPublished: true });
  if (!project) {
    return c.json({ success: false, error: 'Project not found' }, 404);
  }
  return c.json({ success: true, data: project });
});

// Blog Posts (Published only)
publicRoutes.get('/blog', async (c) => {
  const posts = await portfolioRepository.getBlogPosts({ onlyPublished: true });
  return c.json({ success: true, data: posts });
});

publicRoutes.get('/blog/:slug', async (c) => {
  const slug = c.req.param('slug');
  const post = await portfolioRepository.getBlogPostBySlug(slug, { onlyPublished: true });
  if (!post) {
    return c.json({ success: false, error: 'Blog post not found' }, 404);
  }
  return c.json({ success: true, data: post });
});

// Services, Certifications & Testimonials
publicRoutes.get('/services', async (c) => {
  const services = await portfolioRepository.getServices();
  return c.json({ success: true, data: services });
});

publicRoutes.get('/certifications', async (c) => {
  const certifications = await portfolioRepository.getCertifications();
  return c.json({ success: true, data: certifications });
});

publicRoutes.get('/testimonials', async (c) => {
  const testimonials = await portfolioRepository.getTestimonials();
  return c.json({ success: true, data: testimonials });
});

// Contact Form Submission (Rate limited to 5 submissions per 10 minutes)
publicRoutes.post('/contact', rateLimiter({ maxRequests: 5, windowMs: 10 * 60 * 1000 }), async (c) => {
  try {
    const body = await c.req.json();
    const result = contactMessageSchema.safeParse(body);

    if (!result.success) {
      return c.json({ success: false, error: 'Validation failed', details: result.error.flatten() }, 400);
    }

    // Honeypot field check
    if (result.data.website && result.data.website.length > 0) {
      // Silently discard spam without informing bot
      return c.json({ success: true, message: 'Message sent successfully' });
    }

    const ipAddress = c.req.header('x-forwarded-for') || c.req.header('x-real-ip');
    const msg = await portfolioRepository.createContactMessage({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
      ipAddress,
    });

    return c.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
      data: { id: msg?.id },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return c.json({ success: false, error: 'Failed to submit contact message', details: message }, 500);
  }
});
