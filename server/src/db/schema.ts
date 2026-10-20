import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// ======================== USERS & SESSIONS ========================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // Hashed session token
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(), // Unix timestamp in ms
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt),
}));

// ======================== PROFILE & SITE SETTINGS ========================

export const profile = sqliteTable('profile', {
  id: text('id').primaryKey().default('default'),
  name: text('name').notNull(),
  role: text('role').notNull(),
  eyebrow: text('eyebrow').notNull(),
  headline: text('headline').notNull(),
  shortBio: text('short_bio').notNull(),
  fullBio: text('full_bio').notNull(), // JSON string array
  location: text('location').notNull(),
  available: integer('available', { mode: 'boolean' }).notNull().default(true),
  statusLabel: text('status_label').notNull(),
  preferredStyle: text('preferred_style'),
  learningFocus: text('learning_focus'),
  avatarUrl: text('avatar_url'),
  avatarInitials: text('avatar_initials').notNull().default('AR'),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const siteSettings = sqliteTable('site_settings', {
  id: text('id').primaryKey().default('default'),
  siteTitle: text('site_title').notNull(),
  siteDescription: text('site_description').notNull(),
  siteUrl: text('site_url').notNull(),
  contactEmail: text('contact_email').notNull(),
  githubUrl: text('github_url').notNull(),
  linkedinUrl: text('linkedin_url').notNull(),
  collaborativeInvite: text('collaborative_invite').notNull(),
  footerText: text('footer_text').notNull(),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// ======================== SKILLS ========================

export const skills = sqliteTable('skills', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'frontend' | 'backend' | 'databases' | 'tools'
  proficiency: text('proficiency').notNull().default('Proficient'), // 'Learning' | 'Proficient' | 'Exploring'
  iconName: text('icon_name').default('Code'),
  description: text('description'),
  isFocus: integer('is_focus', { mode: 'boolean' }).notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  categoryIdx: index('skills_category_idx').on(table.category),
}));

// ======================== EXPERIENCES & EDUCATION ========================

export const experiences = sqliteTable('experiences', {
  id: text('id').primaryKey(),
  company: text('company').notNull(),
  position: text('position').notNull(),
  employmentType: text('employment_type').notNull().default('Full-time'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').default('Present'),
  isCurrent: integer('is_current', { mode: 'boolean' }).notNull().default(false),
  description: text('description').notNull(),
  technologies: text('technologies').notNull(), // JSON string array
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const education = sqliteTable('education', {
  id: text('id').primaryKey(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  fieldOfStudy: text('field_of_study').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').default('Present'),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const learningJourney = sqliteTable('learning_journey', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  status: text('status').notNull(), // 'In Progress' | 'Planned' | 'Milestone'
  description: text('description').notNull(),
  topics: text('topics').notNull(), // JSON string array
  resourcesOrGoals: text('resources_or_goals'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// ======================== PROJECTS ========================

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description'),
  category: text('category').notNull(), // 'Full-Stack' | 'Frontend' | 'Backend / API' | 'Tool / CLI'
  techStack: text('tech_stack').notNull(), // JSON string array
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull().default('published'), // 'published' | 'draft'
  liveDemoUrl: text('live_demo_url'),
  sourceCodeUrl: text('source_code_url'),
  coverImageUrl: text('cover_image_url'),
  highlights: text('highlights'), // JSON string array
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  slugIdx: index('projects_slug_idx').on(table.slug),
  statusIdx: index('projects_status_idx').on(table.status),
  featuredIdx: index('projects_featured_idx').on(table.featured),
}));

export const projectImages = sqliteTable('project_images', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  projectIdIdx: index('project_images_project_id_idx').on(table.projectId),
}));

// ======================== BLOG POSTS ========================

export const blogPosts = sqliteTable('blog_posts', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(), // Markdown or rich text
  coverImageUrl: text('cover_image_url'),
  authorName: text('author_name').notNull().default('Admin'),
  category: text('category').notNull().default('Engineering'),
  tags: text('tags').notNull(), // JSON string array
  status: text('status').notNull().default('published'), // 'published' | 'draft'
  publishedAt: text('published_at').notNull().$defaultFn(() => new Date().toISOString()),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  blogSlugIdx: index('blog_posts_slug_idx').on(table.slug),
  blogStatusIdx: index('blog_posts_status_idx').on(table.status),
}));

// ======================== CERTIFICATIONS, SERVICES, TESTIMONIALS ========================

export const certifications = sqliteTable('certifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  issueDate: text('issue_date').notNull(),
  credentialUrl: text('credential_url'),
  certificateImageUrl: text('certificate_image_url'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').default('Layers'),
  pricingText: text('pricing_text'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const testimonials = sqliteTable('testimonials', {
  id: text('id').primaryKey(),
  clientName: text('client_name').notNull(),
  positionOrCompany: text('position_or_company').notNull(),
  testimonialText: text('testimonial_text').notNull(),
  avatarUrl: text('avatar_url'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// ======================== CONTACT MESSAGES & AUDIT ========================

export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  isReadIdx: index('contact_messages_is_read_idx').on(table.isRead),
}));

export const mediaAssets = sqliteTable('media_assets', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  secureUrl: text('secure_url').notNull(),
  resourceType: text('resource_type').notNull().default('image'),
  width: integer('width'),
  height: integer('height'),
  format: text('format'),
  bytes: integer('bytes'),
  altText: text('alt_text'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  publicIdIdx: index('media_assets_public_id_idx').on(table.publicId),
}));

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  action: text('action').notNull(),
  details: text('details'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});
