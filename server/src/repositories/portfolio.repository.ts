import { db, schema } from '../db';
import { eq, desc, asc, and } from 'drizzle-orm';

export class PortfolioRepository {
  // ======================== PROFILE ========================
  async getProfile() {
    const row = await db.select().from(schema.profile).where(eq(schema.profile.id, 'default')).get();
    if (!row) return null;
    return {
      ...row,
      fullBio: JSON.parse(row.fullBio || '[]') as string[],
    };
  }

  async updateProfile(data: {
    name: string;
    role: string;
    eyebrow: string;
    headline: string;
    shortBio: string;
    fullBio: string[];
    location: string;
    available: boolean;
    statusLabel: string;
    preferredStyle?: string;
    learningFocus?: string;
    avatarUrl?: string;
    avatarInitials?: string;
  }) {
    await db.insert(schema.profile).values({
      id: 'default',
      ...data,
      fullBio: JSON.stringify(data.fullBio),
      updatedAt: new Date().toISOString(),
    }).onConflictDoUpdate({
      target: schema.profile.id,
      set: {
        ...data,
        fullBio: JSON.stringify(data.fullBio),
        updatedAt: new Date().toISOString(),
      },
    });
    return this.getProfile();
  }

  // ======================== SITE SETTINGS ========================
  async getSettings() {
    return db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 'default')).get();
  }

  async updateSettings(data: {
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;
    contactEmail: string;
    githubUrl: string;
    linkedinUrl: string;
    collaborativeInvite: string;
    footerText: string;
  }) {
    await db.insert(schema.siteSettings).values({
      id: 'default',
      ...data,
      updatedAt: new Date().toISOString(),
    }).onConflictDoUpdate({
      target: schema.siteSettings.id,
      set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
    return this.getSettings();
  }

  // ======================== SKILLS ========================
  async getSkills(_admin = false) {
    const rows = await db.select().from(schema.skills).orderBy(asc(schema.skills.displayOrder)).all();
    return rows;
  }

  async createSkill(data: {
    name: string;
    category: string;
    proficiency: string;
    iconName?: string;
    description?: string;
    isFocus: boolean;
    displayOrder: number;
  }) {
    const id = `skill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.skills).values({ id, ...data });
    return db.select().from(schema.skills).where(eq(schema.skills.id, id)).get();
  }

  async updateSkill(id: string, data: Partial<{
    name: string;
    category: string;
    proficiency: string;
    iconName?: string;
    description?: string;
    isFocus: boolean;
    displayOrder: number;
  }>) {
    await db.update(schema.skills).set(data).where(eq(schema.skills.id, id));
    return db.select().from(schema.skills).where(eq(schema.skills.id, id)).get();
  }

  async deleteSkill(id: string) {
    await db.delete(schema.skills).where(eq(schema.skills.id, id));
  }

  // ======================== EXPERIENCES ========================
  async getExperiences() {
    const rows = await db.select().from(schema.experiences).orderBy(asc(schema.experiences.displayOrder)).all();
    return rows.map((r) => ({
      ...r,
      technologies: JSON.parse(r.technologies || '[]') as string[],
    }));
  }

  async createExperience(data: {
    company: string;
    position: string;
    employmentType: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    technologies: string[];
    displayOrder: number;
  }) {
    const id = `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.experiences).values({
      id,
      ...data,
      technologies: JSON.stringify(data.technologies),
    });
    return db.select().from(schema.experiences).where(eq(schema.experiences.id, id)).get();
  }

  async updateExperience(id: string, data: Partial<{
    company: string;
    position: string;
    employmentType: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    technologies: string[];
    displayOrder: number;
  }>) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.technologies) {
      updateData.technologies = JSON.stringify(data.technologies);
    }
    await db.update(schema.experiences).set(updateData).where(eq(schema.experiences.id, id));
    return db.select().from(schema.experiences).where(eq(schema.experiences.id, id)).get();
  }

  async deleteExperience(id: string) {
    await db.delete(schema.experiences).where(eq(schema.experiences.id, id));
  }

  // ======================== EDUCATION ========================
  async getEducation() {
    return db.select().from(schema.education).orderBy(asc(schema.education.displayOrder)).all();
  }

  async createEducation(data: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
    displayOrder: number;
  }) {
    const id = `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.education).values({ id, ...data });
    return db.select().from(schema.education).where(eq(schema.education.id, id)).get();
  }

  async updateEducation(id: string, data: Partial<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
    displayOrder: number;
  }>) {
    await db.update(schema.education).set(data).where(eq(schema.education.id, id));
    return db.select().from(schema.education).where(eq(schema.education.id, id)).get();
  }

  async deleteEducation(id: string) {
    await db.delete(schema.education).where(eq(schema.education.id, id));
  }

  // ======================== LEARNING JOURNEY ========================
  async getLearningJourney() {
    const rows = await db.select().from(schema.learningJourney).orderBy(asc(schema.learningJourney.displayOrder)).all();
    return rows.map((r) => ({
      ...r,
      topics: JSON.parse(r.topics || '[]') as string[],
    }));
  }

  async createLearningItem(data: {
    title: string;
    status: string;
    description: string;
    topics: string[];
    resourcesOrGoals?: string;
    displayOrder: number;
  }) {
    const id = `learning-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.learningJourney).values({
      id,
      ...data,
      topics: JSON.stringify(data.topics),
    });
    return db.select().from(schema.learningJourney).where(eq(schema.learningJourney.id, id)).get();
  }

  async updateLearningItem(id: string, data: Partial<{
    title: string;
    status: string;
    description: string;
    topics: string[];
    resourcesOrGoals?: string;
    displayOrder: number;
  }>) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.topics) {
      updateData.topics = JSON.stringify(data.topics);
    }
    await db.update(schema.learningJourney).set(updateData).where(eq(schema.learningJourney.id, id));
    return db.select().from(schema.learningJourney).where(eq(schema.learningJourney.id, id)).get();
  }

  async deleteLearningItem(id: string) {
    await db.delete(schema.learningJourney).where(eq(schema.learningJourney.id, id));
  }

  // ======================== PROJECTS ========================
  async getProjects(options: { onlyPublished?: boolean } = {}) {
    let rows;
    if (options.onlyPublished) {
      rows = await db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.status, 'published'))
        .orderBy(asc(schema.projects.displayOrder))
        .all();
    } else {
      rows = await db.select().from(schema.projects).orderBy(asc(schema.projects.displayOrder)).all();
    }

    return rows.map((r) => ({
      ...r,
      techStack: JSON.parse(r.techStack || '[]') as string[],
      highlights: JSON.parse(r.highlights || '[]') as string[],
    }));
  }

  async getProjectBySlug(slug: string, options: { onlyPublished?: boolean } = {}) {
    let row;
    if (options.onlyPublished) {
      row = await db
        .select()
        .from(schema.projects)
        .where(and(eq(schema.projects.slug, slug), eq(schema.projects.status, 'published')))
        .get();
    } else {
      row = await db.select().from(schema.projects).where(eq(schema.projects.slug, slug)).get();
    }

    if (!row) return null;
    return {
      ...row,
      techStack: JSON.parse(row.techStack || '[]') as string[],
      highlights: JSON.parse(row.highlights || '[]') as string[],
    };
  }

  async getProjectById(id: string) {
    const row = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).get();
    if (!row) return null;
    return {
      ...row,
      techStack: JSON.parse(row.techStack || '[]') as string[],
      highlights: JSON.parse(row.highlights || '[]') as string[],
    };
  }

  async createProject(data: {
    slug: string;
    title: string;
    shortDescription: string;
    fullDescription?: string;
    category: string;
    techStack: string[];
    featured: boolean;
    status: string;
    liveDemoUrl?: string;
    sourceCodeUrl?: string;
    coverImageUrl?: string;
    highlights?: string[];
    displayOrder: number;
  }) {
    const id = `project-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.projects).values({
      id,
      ...data,
      techStack: JSON.stringify(data.techStack),
      highlights: JSON.stringify(data.highlights || []),
    });
    return this.getProjectById(id);
  }

  async updateProject(id: string, data: Partial<{
    slug: string;
    title: string;
    shortDescription: string;
    fullDescription?: string;
    category: string;
    techStack: string[];
    featured: boolean;
    status: string;
    liveDemoUrl?: string;
    sourceCodeUrl?: string;
    coverImageUrl?: string;
    highlights?: string[];
    displayOrder: number;
  }>) {
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    if (data.techStack) {
      updateData.techStack = JSON.stringify(data.techStack);
    }
    if (data.highlights) {
      updateData.highlights = JSON.stringify(data.highlights);
    }

    await db.update(schema.projects).set(updateData).where(eq(schema.projects.id, id));
    return this.getProjectById(id);
  }

  async deleteProject(id: string) {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
  }

  // ======================== BLOG POSTS ========================
  async getBlogPosts(options: { onlyPublished?: boolean } = {}) {
    let rows;
    if (options.onlyPublished) {
      rows = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.status, 'published'))
        .orderBy(desc(schema.blogPosts.publishedAt))
        .all();
    } else {
      rows = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt)).all();
    }

    return rows.map((r) => ({
      ...r,
      tags: JSON.parse(r.tags || '[]') as string[],
    }));
  }

  async getBlogPostBySlug(slug: string, options: { onlyPublished?: boolean } = {}) {
    let row;
    if (options.onlyPublished) {
      row = await db
        .select()
        .from(schema.blogPosts)
        .where(and(eq(schema.blogPosts.slug, slug), eq(schema.blogPosts.status, 'published')))
        .get();
    } else {
      row = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug)).get();
    }

    if (!row) return null;
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]') as string[],
    };
  }

  async getBlogPostById(id: string) {
    const row = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id)).get();
    if (!row) return null;
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]') as string[],
    };
  }

  async createBlogPost(data: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImageUrl?: string;
    authorName: string;
    category: string;
    tags: string[];
    status: string;
    publishedAt?: string;
  }) {
    const id = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.blogPosts).values({
      id,
      ...data,
      tags: JSON.stringify(data.tags),
      publishedAt: data.publishedAt || new Date().toISOString(),
    });
    return this.getBlogPostById(id);
  }

  async updateBlogPost(id: string, data: Partial<{
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImageUrl?: string;
    authorName: string;
    category: string;
    tags: string[];
    status: string;
    publishedAt?: string;
  }>) {
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags);
    }
    await db.update(schema.blogPosts).set(updateData).where(eq(schema.blogPosts.id, id));
    return this.getBlogPostById(id);
  }

  async deleteBlogPost(id: string) {
    await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
  }

  // ======================== SERVICES & CERTIFICATIONS ========================
  async getServices() {
    return db.select().from(schema.services).orderBy(asc(schema.services.displayOrder)).all();
  }

  async createService(data: {
    title: string;
    description: string;
    iconName?: string;
    pricingText?: string;
    displayOrder: number;
  }) {
    const id = `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.services).values({ id, ...data });
    return db.select().from(schema.services).where(eq(schema.services.id, id)).get();
  }

  async updateService(id: string, data: Partial<{
    title: string;
    description: string;
    iconName?: string;
    pricingText?: string;
    displayOrder: number;
  }>) {
    await db.update(schema.services).set(data).where(eq(schema.services.id, id));
    return db.select().from(schema.services).where(eq(schema.services.id, id)).get();
  }

  async deleteService(id: string) {
    await db.delete(schema.services).where(eq(schema.services.id, id));
  }

  async getCertifications() {
    return db.select().from(schema.certifications).orderBy(asc(schema.certifications.displayOrder)).all();
  }

  async createCertification(data: {
    title: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    certificateImageUrl?: string;
    displayOrder: number;
  }) {
    const id = `cert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.certifications).values({ id, ...data });
    return db.select().from(schema.certifications).where(eq(schema.certifications.id, id)).get();
  }

  async updateCertification(id: string, data: Partial<{
    title: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    certificateImageUrl?: string;
    displayOrder: number;
  }>) {
    await db.update(schema.certifications).set(data).where(eq(schema.certifications.id, id));
    return db.select().from(schema.certifications).where(eq(schema.certifications.id, id)).get();
  }

  async deleteCertification(id: string) {
    await db.delete(schema.certifications).where(eq(schema.certifications.id, id));
  }

  // ======================== TESTIMONIALS ========================
  async getTestimonials() {
    return db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.displayOrder)).all();
  }

  async createTestimonial(data: {
    clientName: string;
    positionOrCompany: string;
    testimonialText: string;
    avatarUrl?: string;
    featured: boolean;
    displayOrder: number;
  }) {
    const id = `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.testimonials).values({ id, ...data });
    return db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).get();
  }

  async updateTestimonial(id: string, data: Partial<{
    clientName: string;
    positionOrCompany: string;
    testimonialText: string;
    avatarUrl?: string;
    featured: boolean;
    displayOrder: number;
  }>) {
    await db.update(schema.testimonials).set(data).where(eq(schema.testimonials.id, id));
    return db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).get();
  }

  async deleteTestimonial(id: string) {
    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
  }

  // ======================== CONTACT MESSAGES ========================
  async getContactMessages() {
    return db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt)).all();
  }

  async createContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string;
  }) {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.contactMessages).values({ id, ...data });
    return db.select().from(schema.contactMessages).where(eq(schema.contactMessages.id, id)).get();
  }

  async markMessageAsRead(id: string, isRead = true) {
    await db.update(schema.contactMessages).set({ isRead }).where(eq(schema.contactMessages.id, id));
  }

  async deleteContactMessage(id: string) {
    await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
  }

  // ======================== MEDIA ASSETS ========================
  async getMediaAssets() {
    return db.select().from(schema.mediaAssets).orderBy(desc(schema.mediaAssets.createdAt)).all();
  }

  async createMediaAsset(data: {
    publicId: string;
    secureUrl: string;
    resourceType: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    altText?: string;
  }) {
    const id = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.mediaAssets).values({ id, ...data });
    return db.select().from(schema.mediaAssets).where(eq(schema.mediaAssets.id, id)).get();
  }

  async deleteMediaAsset(id: string) {
    await db.delete(schema.mediaAssets).where(eq(schema.mediaAssets.id, id));
  }

  // ======================== DASHBOARD STATS ========================
  async getDashboardStats() {
    const allProjects = await db.select().from(schema.projects).all();
    const publishedProjects = allProjects.filter((p) => p.status === 'published').length;
    const draftProjects = allProjects.filter((p) => p.status === 'draft').length;

    const allBlogs = await db.select().from(schema.blogPosts).all();
    const publishedBlogs = allBlogs.filter((b) => b.status === 'published').length;
    const draftBlogs = allBlogs.filter((b) => b.status === 'draft').length;

    const allSkills = await db.select().from(schema.skills).all();
    const allMessages = await db.select().from(schema.contactMessages).all();
    const unreadMessages = allMessages.filter((m) => !m.isRead).length;

    const recentMessages = await db
      .select()
      .from(schema.contactMessages)
      .orderBy(desc(schema.contactMessages.createdAt))
      .limit(5)
      .all();

    return {
      projects: {
        total: allProjects.length,
        published: publishedProjects,
        draft: draftProjects,
      },
      blogPosts: {
        total: allBlogs.length,
        published: publishedBlogs,
        draft: draftBlogs,
      },
      skills: {
        total: allSkills.length,
      },
      messages: {
        total: allMessages.length,
        unread: unreadMessages,
        recent: recentMessages,
      },
    };
  }
}

export const portfolioRepository = new PortfolioRepository();
