import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ContactMessageInput } from '@shared/schemas';

export interface ProfileData {
  id: string;
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
  avatarInitials: string;
}

export interface SiteSettingsData {
  id: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  collaborativeInvite: string;
  footerText: string;
}

export interface SkillItemData {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'databases' | 'tools';
  proficiency: 'Learning' | 'Proficient' | 'Exploring';
  iconName?: string;
  description?: string;
  isFocus: boolean;
  displayOrder: number;
}

export interface ProjectItemData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category: 'Full-Stack' | 'Frontend' | 'Backend / API' | 'Tool / CLI';
  techStack: string[];
  featured: boolean;
  status: 'published' | 'draft';
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
  coverImageUrl?: string;
  highlights?: string[];
  displayOrder: number;
}

export interface LearningItemData {
  id: string;
  title: string;
  status: 'In Progress' | 'Planned' | 'Milestone';
  description: string;
  topics: string[];
  resourcesOrGoals?: string;
  displayOrder: number;
}

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  authorName: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft';
  publishedAt: string;
  createdAt: string;
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  pricingText?: string;
  displayOrder: number;
}

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
  displayOrder: number;
}

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
  displayOrder: number;
}

export interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  certificateImageUrl?: string;
  displayOrder: number;
}

export interface TestimonialData {
  id: string;
  clientName: string;
  positionOrCompany: string;
  testimonialText: string;
  avatarUrl?: string;
  featured: boolean;
  displayOrder: number;
}

// Queries
export function useProfile() {
  return useQuery({
    queryKey: ['public', 'profile'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ProfileData }>('/public/profile');
      return res.data;
    },
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['public', 'settings'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: SiteSettingsData }>('/public/settings');
      return res.data;
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ['public', 'skills'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: SkillItemData[] }>('/public/skills');
      return res.data;
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['public', 'projects'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ProjectItemData[] }>('/public/projects');
      return res.data;
    },
  });
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ['public', 'project', slug],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ProjectItemData }>(`/public/projects/${slug}`);
      return res.data;
    },
    enabled: Boolean(slug),
  });
}

export function useLearningJourney() {
  return useQuery({
    queryKey: ['public', 'learning'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: LearningItemData[] }>('/public/learning');
      return res.data;
    },
  });
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['public', 'blog'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BlogPostData[] }>('/public/blog');
      return res.data;
    },
  });
}

export function useBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: ['public', 'blog', slug],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BlogPostData }>(`/public/blog/${slug}`);
      return res.data;
    },
    enabled: Boolean(slug),
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ['public', 'experiences'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ExperienceData[] }>('/public/experiences');
      return res.data;
    },
  });
}

export function useEducation() {
  return useQuery({
    queryKey: ['public', 'education'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: EducationData[] }>('/public/education');
      return res.data;
    },
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['public', 'services'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ServiceData[] }>('/public/services');
      return res.data;
    },
  });
}

export function useCertifications() {
  return useQuery({
    queryKey: ['public', 'certifications'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: CertificationData[] }>('/public/certifications');
      return res.data;
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['public', 'testimonials'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: TestimonialData[] }>('/public/testimonials');
      return res.data;
    },
  });
}

// Contact Submission Mutation
export function useSubmitContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ContactMessageInput) => {
      return api.post<{ success: boolean; message: string }>('/public/contact', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}
