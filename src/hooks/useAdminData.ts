import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type {
  ProfileInput,
  SiteSettingsInput,
  SkillInput,
  ExperienceInput,
  EducationInput,
  LearningJourneyInput,
  ProjectInput,
  BlogPostInput,
  ServiceInput,
  CertificationInput,
  TestimonialInput,
} from '@shared/schemas';
import type {
  ProfileData,
  SiteSettingsData,
  SkillItemData,
  ProjectItemData,
  LearningItemData,
  BlogPostData,
  ExperienceData,
  EducationData,
  ServiceData,
  CertificationData,
  TestimonialData,
} from './usePortfolioData';

export interface DashboardStats {
  projects: { total: number; published: number; draft: number };
  blogPosts: { total: number; published: number; draft: number };
  skills: { total: number };
  messages: {
    total: number;
    unread: number;
    recent: Array<{ id: string; name: string; email: string; subject: string; message: string; createdAt: string; isRead: boolean }>;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  ipAddress?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  publicId: string;
  secureUrl: string;
  resourceType: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  altText?: string;
  createdAt: string;
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: DashboardStats }>('/admin/dashboard');
      return res.data;
    },
  });
}

// Profile & Settings
export function useAdminProfile() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'profile'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ProfileData }>('/admin/profile');
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileInput) => api.put<{ success: boolean; data: ProfileData }>('/admin/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'profile'] });
    },
  });

  return { ...query, updateProfile: updateMutation.mutateAsync, isUpdating: updateMutation.isPending };
}

export function useAdminSettings() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: SiteSettingsData }>('/admin/settings');
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SiteSettingsInput) => api.put<{ success: boolean; data: SiteSettingsData }>('/admin/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'settings'] });
    },
  });

  return { ...query, updateSettings: updateMutation.mutateAsync, isUpdating: updateMutation.isPending };
}

// Skills CRUD
export function useAdminSkills() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'skills'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: SkillItemData[] }>('/admin/skills');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: SkillInput) => api.post('/admin/skills', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'skills'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'skills'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SkillInput> }) => api.put(`/admin/skills/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'skills'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'skills'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'skills'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'skills'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  return {
    skills: query.data || [],
    isLoading: query.isLoading,
    createSkill: createMutation.mutateAsync,
    updateSkill: updateMutation.mutateAsync,
    deleteSkill: deleteMutation.mutateAsync,
  };
}

// Projects CRUD
export function useAdminProjects() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ProjectItemData[] }>('/admin/projects');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectInput) => api.post('/admin/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectInput> }) => api.put(`/admin/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
  };
}

// Blog Posts CRUD
export function useAdminBlog() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BlogPostData[] }>('/admin/blog');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: BlogPostInput) => api.post('/admin/blog', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPostInput> }) => api.put(`/admin/blog/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  return {
    posts: query.data || [],
    isLoading: query.isLoading,
    createPost: createMutation.mutateAsync,
    updatePost: updateMutation.mutateAsync,
    deletePost: deleteMutation.mutateAsync,
  };
}

// Experiences CRUD
export function useAdminExperiences() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'experiences'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ExperienceData[] }>('/admin/experiences');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ExperienceInput) => api.post('/admin/experiences', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'experiences'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'experiences'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExperienceInput> }) => api.put(`/admin/experiences/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'experiences'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'experiences'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/experiences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'experiences'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'experiences'] });
    },
  });

  return {
    experiences: query.data || [],
    isLoading: query.isLoading,
    createExperience: createMutation.mutateAsync,
    updateExperience: updateMutation.mutateAsync,
    deleteExperience: deleteMutation.mutateAsync,
  };
}

// Education CRUD
export function useAdminEducation() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'education'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: EducationData[] }>('/admin/education');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: EducationInput) => api.post('/admin/education', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'education'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'education'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EducationInput> }) => api.put(`/admin/education/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'education'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'education'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/education/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'education'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'education'] });
    },
  });

  return {
    education: query.data || [],
    isLoading: query.isLoading,
    createEducation: createMutation.mutateAsync,
    updateEducation: updateMutation.mutateAsync,
    deleteEducation: deleteMutation.mutateAsync,
  };
}

// Learning Journey CRUD
export function useAdminLearning() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'learning'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: LearningItemData[] }>('/admin/learning');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: LearningJourneyInput) => api.post('/admin/learning', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'learning'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'learning'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LearningJourneyInput> }) => api.put(`/admin/learning/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'learning'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'learning'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/learning/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'learning'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'learning'] });
    },
  });

  return {
    learning: query.data || [],
    isLoading: query.isLoading,
    createLearning: createMutation.mutateAsync,
    updateLearning: updateMutation.mutateAsync,
    deleteLearning: deleteMutation.mutateAsync,
  };
}

// Services CRUD
export function useAdminServices() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ServiceData[] }>('/admin/services');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ServiceInput) => api.post('/admin/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'services'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceInput> }) => api.put(`/admin/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'services'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'services'] });
    },
  });

  return {
    services: query.data || [],
    isLoading: query.isLoading,
    createService: createMutation.mutateAsync,
    updateService: updateMutation.mutateAsync,
    deleteService: deleteMutation.mutateAsync,
  };
}

// Certifications CRUD
export function useAdminCertifications() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'certifications'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: CertificationData[] }>('/admin/certifications');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CertificationInput) => api.post('/admin/certifications', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'certifications'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'certifications'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CertificationInput> }) => api.put(`/admin/certifications/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'certifications'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'certifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/certifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'certifications'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'certifications'] });
    },
  });

  return {
    certifications: query.data || [],
    isLoading: query.isLoading,
    createCertification: createMutation.mutateAsync,
    updateCertification: updateMutation.mutateAsync,
    deleteCertification: deleteMutation.mutateAsync,
  };
}

// Testimonials CRUD
export function useAdminTestimonials() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: TestimonialData[] }>('/admin/testimonials');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TestimonialInput) => api.post('/admin/testimonials', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'testimonials'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TestimonialInput> }) => api.put(`/admin/testimonials/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'testimonials'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/testimonials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'testimonials'] });
    },
  });

  return {
    testimonials: query.data || [],
    isLoading: query.isLoading,
    createTestimonial: createMutation.mutateAsync,
    updateTestimonial: updateMutation.mutateAsync,
    deleteTestimonial: deleteMutation.mutateAsync,
  };
}

// Contact Messages Inbox
export function useAdminMessages() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ContactMessage[] }>('/admin/messages');
      return res.data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) => api.patch(`/admin/messages/${id}/read`, { isRead }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    markAsRead: markReadMutation.mutateAsync,
    deleteMessage: deleteMutation.mutateAsync,
  };
}

// Media Assets Library
export function useAdminMedia() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'media'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: MediaAsset[]; cloudinaryAvailable: boolean }>('/admin/media');
      return res;
    },
  });

  const recordMediaMutation = useMutation({
    mutationFn: (data: { publicId: string; secureUrl: string; resourceType?: string; width?: number; height?: number; format?: string; bytes?: number; altText?: string }) =>
      api.post('/admin/media', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });

  return {
    assets: query.data?.data || [],
    cloudinaryAvailable: query.data?.cloudinaryAvailable || false,
    isLoading: query.isLoading,
    recordAsset: recordMediaMutation.mutateAsync,
    deleteAsset: deleteMutation.mutateAsync,
  };
}
