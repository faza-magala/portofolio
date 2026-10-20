import { z } from 'zod';

// ======================== AUTH SCHEMAS ========================

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Confirm password must match'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ======================== PROFILE & SITE SCHEMAS ========================

export const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  eyebrow: z.string().min(2, 'Eyebrow text is required'),
  headline: z.string().min(5, 'Headline is required'),
  shortBio: z.string().min(10, 'Short bio is required'),
  fullBio: z.array(z.string()).min(1, 'At least one bio paragraph is required'),
  location: z.string().min(2, 'Location is required'),
  available: z.boolean(),
  statusLabel: z.string().min(2, 'Status label is required'),
  preferredStyle: z.string(),
  learningFocus: z.string(),
  avatarUrl: z.string(),
  avatarInitials: z.string().max(4),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(2, 'Site title is required'),
  siteDescription: z.string().min(10, 'Site description is required'),
  siteUrl: z.string().url('Invalid URL format').or(z.literal('')),
  contactEmail: z.string().email('Valid email is required'),
  githubUrl: z.string().url('Invalid GitHub URL').or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').or(z.literal('')),
  collaborativeInvite: z.string().min(5, 'Collaborative invite text is required'),
  footerText: z.string().min(2, 'Footer text is required'),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// ======================== SKILLS SCHEMAS ========================

export const skillCategoryEnum = z.enum(['frontend', 'backend', 'databases', 'tools']);
export const skillProficiencyEnum = z.enum(['Learning', 'Proficient', 'Exploring']);

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: skillCategoryEnum,
  proficiency: skillProficiencyEnum,
  iconName: z.string(),
  description: z.string(),
  isFocus: z.boolean(),
  displayOrder: z.number().int(),
});

export type SkillInput = z.infer<typeof skillSchema>;

// ======================== EXPERIENCE & EDUCATION ========================

export const experienceSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  position: z.string().min(2, 'Position is required'),
  employmentType: z.string(),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string(),
  isCurrent: z.boolean(),
  description: z.string().min(10, 'Description is required'),
  technologies: z.array(z.string()),
  displayOrder: z.number().int(),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution is required'),
  degree: z.string().min(2, 'Degree is required'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string(),
  description: z.string(),
  displayOrder: z.number().int(),
});

export type EducationInput = z.infer<typeof educationSchema>;

// ======================== LEARNING JOURNEY ========================

export const learningStatusEnum = z.enum(['In Progress', 'Planned', 'Milestone']);

export const learningJourneySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  status: learningStatusEnum,
  description: z.string().min(5, 'Description is required'),
  topics: z.array(z.string()),
  resourcesOrGoals: z.string(),
  displayOrder: z.number().int(),
});

export type LearningJourneyInput = z.infer<typeof learningJourneySchema>;

// ======================== PROJECTS SCHEMAS ========================

export const projectCategoryEnum = z.enum(['Full-Stack', 'Frontend', 'Backend / API', 'Tool / CLI']);
export const publicationStatusEnum = z.enum(['published', 'draft']);

export const projectSchema = z.object({
  title: z.string().min(2, 'Project title is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  shortDescription: z.string().min(10, 'Short description is required'),
  fullDescription: z.string(),
  category: projectCategoryEnum,
  techStack: z.array(z.string()).min(1, 'At least one technology must be specified'),
  featured: z.boolean(),
  status: publicationStatusEnum,
  liveDemoUrl: z.string().url('Invalid URL').or(z.literal('')),
  sourceCodeUrl: z.string().url('Invalid URL').or(z.literal('')),
  coverImageUrl: z.string(),
  highlights: z.array(z.string()),
  displayOrder: z.number().int(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ======================== BLOG SCHEMAS ========================

export const blogPostSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().min(10, 'Excerpt is required'),
  content: z.string().min(20, 'Content is required'),
  coverImageUrl: z.string(),
  authorName: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  status: publicationStatusEnum,
  publishedAt: z.string(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ======================== CERTIFICATIONS & SERVICES & TESTIMONIALS ========================

export const certificationSchema = z.object({
  title: z.string().min(2, 'Certification title is required'),
  issuer: z.string().min(2, 'Issuer is required'),
  issueDate: z.string().min(4, 'Issue date is required'),
  credentialUrl: z.string().url('Invalid URL').or(z.literal('')),
  certificateImageUrl: z.string(),
  displayOrder: z.number().int(),
});

export type CertificationInput = z.infer<typeof certificationSchema>;

export const serviceSchema = z.object({
  title: z.string().min(2, 'Service title is required'),
  description: z.string().min(10, 'Description is required'),
  iconName: z.string(),
  pricingText: z.string(),
  displayOrder: z.number().int(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const testimonialSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  positionOrCompany: z.string().min(2, 'Position or company is required'),
  testimonialText: z.string().min(10, 'Testimonial text is required'),
  avatarUrl: z.string(),
  featured: z.boolean(),
  displayOrder: z.number().int(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ======================== CONTACT MESSAGE SCHEMAS ========================

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  // Honeypot spam field: must remain empty
  website: z.string().max(0, 'Spam detected').optional(),
});

// User creation schema
export const userCreateSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;



export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
