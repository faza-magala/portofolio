import { Hono } from 'hono';
import { portfolioRepository } from '../repositories/portfolio.repository';
import { authRepository } from '../repositories/auth.repository';
import { loginSchema, changePasswordSchema, userCreateSchema } from '../../../shared/src/schemas';
import { requireAuth, type AuthContextVariables } from '../middleware/auth.middleware';
import { cloudinaryService } from '../services/cloudinary.service';
import {
  profileSchema,
  siteSettingsSchema,
  skillSchema,
  experienceSchema,
  educationSchema,
  learningJourneySchema,
  projectSchema,
  blogPostSchema,
  serviceSchema,
  certificationSchema,
  testimonialSchema,
} from '../../../shared/src/schemas';

export const adminRoutes = new Hono<{ Variables: AuthContextVariables }>();

// All admin routes require valid authentication
adminRoutes.use('*', requireAuth);

// ======================== DASHBOARD STATS ========================
adminRoutes.get('/dashboard', async (c) => {
  const stats = await portfolioRepository.getDashboardStats();
  return c.json({ success: true, data: stats });
});

// ======================== PROFILE ========================
adminRoutes.get('/profile', async (c) => {
  const profile = await portfolioRepository.getProfile();
  return c.json({ success: true, data: profile });
});

adminRoutes.put('/profile', async (c) => {
  const body = await c.req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateProfile(parsed.data);
  return c.json({ success: true, data: updated, message: 'Profile updated successfully' });
});

// ======================== SITE SETTINGS ========================
adminRoutes.get('/settings', async (c) => {
  const settings = await portfolioRepository.getSettings();
  return c.json({ success: true, data: settings });
});

adminRoutes.put('/settings', async (c) => {
  const body = await c.req.json();
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateSettings(parsed.data);
  return c.json({ success: true, data: updated, message: 'Settings updated successfully' });
});

// ======================== SKILLS ========================
adminRoutes.get('/skills', async (c) => {
  const skills = await portfolioRepository.getSkills(true);
  return c.json({ success: true, data: skills });
});

adminRoutes.post('/skills', async (c) => {
  const body = await c.req.json();
  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const created = await portfolioRepository.createSkill(parsed.data);
  return c.json({ success: true, data: created, message: 'Skill created successfully' }, 201);
});

adminRoutes.put('/skills/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = skillSchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateSkill(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Skill updated successfully' });
});

adminRoutes.delete('/skills/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteSkill(id);
  return c.json({ success: true, message: 'Skill deleted successfully' });
});

// ======================== EXPERIENCES ========================
adminRoutes.get('/experiences', async (c) => {
  const experiences = await portfolioRepository.getExperiences();
  return c.json({ success: true, data: experiences });
});

adminRoutes.post('/experiences', async (c) => {
  const body = await c.req.json();
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const created = await portfolioRepository.createExperience(parsed.data);
  return c.json({ success: true, data: created, message: 'Experience added successfully' }, 201);
});

adminRoutes.put('/experiences/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = experienceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateExperience(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Experience updated successfully' });
});

adminRoutes.delete('/experiences/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteExperience(id);
  return c.json({ success: true, message: 'Experience deleted successfully' });
});

// ======================== EDUCATION ========================
adminRoutes.get('/education', async (c) => {
  const education = await portfolioRepository.getEducation();
  return c.json({ success: true, data: education });
});

adminRoutes.post('/education', async (c) => {
  const body = await c.req.json();
  const parsed = educationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const created = await portfolioRepository.createEducation(parsed.data);
  return c.json({ success: true, data: created, message: 'Education added successfully' }, 201);
});

adminRoutes.put('/education/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = educationSchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateEducation(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Education updated successfully' });
});

adminRoutes.delete('/education/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteEducation(id);
  return c.json({ success: true, message: 'Education deleted successfully' });
});

// ======================== LEARNING JOURNEY ========================
adminRoutes.get('/learning', async (c) => {
  const learning = await portfolioRepository.getLearningJourney();
  return c.json({ success: true, data: learning });
});

adminRoutes.post('/learning', async (c) => {
  const body = await c.req.json();
  const parsed = learningJourneySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const created = await portfolioRepository.createLearningItem(parsed.data);
  return c.json({ success: true, data: created, message: 'Learning milestone added successfully' }, 201);
});

adminRoutes.put('/learning/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = learningJourneySchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateLearningItem(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Learning milestone updated successfully' });
});

adminRoutes.delete('/learning/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteLearningItem(id);
  return c.json({ success: true, message: 'Learning milestone deleted successfully' });
});

// ======================== PROJECTS ========================
adminRoutes.get('/projects', async (c) => {
  // Returns all projects including drafts
  const projects = await portfolioRepository.getProjects({ onlyPublished: false });
  return c.json({ success: true, data: projects });
});

adminRoutes.get('/projects/:id', async (c) => {
  const id = c.req.param('id');
  const project = await portfolioRepository.getProjectById(id);
  if (!project) return c.json({ success: false, error: 'Project not found' }, 404);
  return c.json({ success: true, data: project });
});

adminRoutes.post('/projects', async (c) => {
  const body = await c.req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }

  // Check unique slug
  const existing = await portfolioRepository.getProjectBySlug(parsed.data.slug);
  if (existing) {
    return c.json({ success: false, error: 'A project with this URL slug already exists.' }, 409);
  }

  const created = await portfolioRepository.createProject(parsed.data);
  return c.json({ success: true, data: created, message: 'Project created successfully' }, 201);
});

adminRoutes.put('/projects/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }

  if (parsed.data.slug) {
    const existing = await portfolioRepository.getProjectBySlug(parsed.data.slug);
    if (existing && existing.id !== id) {
      return c.json({ success: false, error: 'Another project already uses this URL slug.' }, 409);
    }
  }

  const updated = await portfolioRepository.updateProject(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Project updated successfully' });
});

adminRoutes.delete('/projects/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteProject(id);
  return c.json({ success: true, message: 'Project deleted successfully' });
});

// ======================== BLOG POSTS ========================
adminRoutes.get('/blog', async (c) => {
  const posts = await portfolioRepository.getBlogPosts({ onlyPublished: false });
  return c.json({ success: true, data: posts });
});

adminRoutes.get('/blog/:id', async (c) => {
  const id = c.req.param('id');
  const post = await portfolioRepository.getBlogPostById(id);
  if (!post) return c.json({ success: false, error: 'Blog post not found' }, 404);
  return c.json({ success: true, data: post });
});

adminRoutes.post('/blog', async (c) => {
  const body = await c.req.json();
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }

  const existing = await portfolioRepository.getBlogPostBySlug(parsed.data.slug);
  if (existing) {
    return c.json({ success: false, error: 'An article with this URL slug already exists.' }, 409);
  }

  const created = await portfolioRepository.createBlogPost(parsed.data);
  return c.json({ success: true, data: created, message: 'Blog post created successfully' }, 201);
});

adminRoutes.put('/blog/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = blogPostSchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }

  if (parsed.data.slug) {
    const existing = await portfolioRepository.getBlogPostBySlug(parsed.data.slug);
    if (existing && existing.id !== id) {
      return c.json({ success: false, error: 'Another article already uses this URL slug.' }, 409);
    }
  }

  const updated = await portfolioRepository.updateBlogPost(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Blog post updated successfully' });
});

adminRoutes.delete('/blog/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteBlogPost(id);
  return c.json({ success: true, message: 'Blog post deleted successfully' });
});

// ======================== SERVICES & CERTIFICATIONS ========================
adminRoutes.get('/services', async (c) => {
  const services = await portfolioRepository.getServices();
  return c.json({ success: true, data: services });
});

adminRoutes.post('/services', async (c) => {
  const body = await c.req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const created = await portfolioRepository.createService(parsed.data);
  return c.json({ success: true, data: created, message: 'Service created successfully' }, 201);
});

adminRoutes.put('/services/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateService(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Service updated successfully' });
});

adminRoutes.delete('/services/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteService(id);
  return c.json({ success: true, message: 'Service deleted successfully' });
});

adminRoutes.get('/certifications', async (c) => {
  const certs = await portfolioRepository.getCertifications();
  return c.json({ success: true, data: certs });
});

adminRoutes.post('/certifications', async (c) => {
  const body = await c.req.json();
  const parsed = certificationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validasi gagal', details: parsed.error.flatten() }, 400);
  }
  const created = await portfolioRepository.createCertification(parsed.data);
  return c.json({ success: true, data: created, message: 'Sertifikasi berhasil ditambahkan' }, 201);
});

// Create new user endpoint
adminRoutes.post('/users', async (c) => {
  const body = await c.req.json();
  const parsed = userCreateSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const { username, email, password, role } = parsed.data;
  const user = await authRepository.createUser({ username, email, password, role });
  await authRepository.createAuditLog(user.id, 'USER_CREATED');
  return c.json({ success: true, data: user, message: 'Pengguna berhasil dibuat' }, 201);
});


adminRoutes.put('/certifications/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = certificationSchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateCertification(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Certification updated successfully' });
});

adminRoutes.delete('/certifications/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteCertification(id);
  return c.json({ success: true, message: 'Certification deleted successfully' });
});

// ======================== TESTIMONIALS ========================
adminRoutes.get('/testimonials', async (c) => {
  const testimonials = await portfolioRepository.getTestimonials();
  return c.json({ success: true, data: testimonials });
});

adminRoutes.post('/testimonials', async (c) => {
  const body = await c.req.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const created = await portfolioRepository.createTestimonial(parsed.data);
  return c.json({ success: true, data: created, message: 'Testimonial added successfully' }, 201);
});

adminRoutes.put('/testimonials/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }
  const updated = await portfolioRepository.updateTestimonial(id, parsed.data);
  return c.json({ success: true, data: updated, message: 'Testimonial updated successfully' });
});

adminRoutes.delete('/testimonials/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteTestimonial(id);
  return c.json({ success: true, message: 'Testimonial deleted successfully' });
});

// ======================== CONTACT MESSAGES ========================
adminRoutes.get('/messages', async (c) => {
  const messages = await portfolioRepository.getContactMessages();
  return c.json({ success: true, data: messages });
});

adminRoutes.patch('/messages/:id/read', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({ isRead: true }));
  await portfolioRepository.markMessageAsRead(id, body.isRead !== false);
  return c.json({ success: true, message: 'Message status updated' });
});

adminRoutes.delete('/messages/:id', async (c) => {
  const id = c.req.param('id');
  await portfolioRepository.deleteContactMessage(id);
  return c.json({ success: true, message: 'Message deleted successfully' });
});

// ======================== MEDIA ASSETS & UPLOADS ========================
adminRoutes.get('/media', async (c) => {
  const assets = await portfolioRepository.getMediaAssets();
  return c.json({
    success: true,
    data: assets,
    cloudinaryAvailable: cloudinaryService.isAvailable(),
  });
});

adminRoutes.post('/media', async (c) => {
  const body = await c.req.json();
  if (!body.publicId || !body.secureUrl) {
    return c.json({ success: false, error: 'publicId and secureUrl are required' }, 400);
  }
  const asset = await portfolioRepository.createMediaAsset({
    publicId: body.publicId,
    secureUrl: body.secureUrl,
    resourceType: body.resourceType || 'image',
    width: body.width,
    height: body.height,
    format: body.format,
    bytes: body.bytes,
    altText: body.altText,
  });
  return c.json({ success: true, data: asset, message: 'Media asset recorded' }, 201);
});

adminRoutes.delete('/media/:id', async (c) => {
  const id = c.req.param('id');
  const assets = await portfolioRepository.getMediaAssets();
  const asset = assets.find((a) => a.id === id);

  if (asset && asset.publicId) {
    await cloudinaryService.deleteAsset(asset.publicId).catch(() => null);
  }
  await portfolioRepository.deleteMediaAsset(id);
  return c.json({ success: true, message: 'Media asset deleted successfully' });
});

adminRoutes.post('/uploads/signature', async (c) => {
  if (!cloudinaryService.isAvailable()) {
    return c.json({
      success: false,
      error: 'Cloudinary is not configured on this server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
    }, 400);
  }

  const body = await c.req.json().catch(() => ({}));
  const folder = body.folder || 'portfolio_cms';
  const signatureData = cloudinaryService.generateUploadSignature(folder);
  return c.json({ success: true, data: signatureData });
});
