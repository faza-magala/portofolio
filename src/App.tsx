import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Public pages
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './features/projects/ProjectDetailPage';
import { BlogListPage } from './features/blog/BlogListPage';
import { BlogPostPage } from './features/blog/BlogPostPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Auth & Admin
import { LoginPage } from './features/auth/LoginPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { AdminLayout } from './features/admin/AdminLayout';
import { DashboardOverview } from './features/admin/pages/DashboardOverview';
import { ProfileEditor } from './features/admin/pages/ProfileEditor';
import { SiteSettingsEditor } from './features/admin/pages/SiteSettingsEditor';
import { ProjectsManager } from './features/admin/pages/ProjectsManager';
import { SkillsManager } from './features/admin/pages/SkillsManager';
import { ExperiencesManager } from './features/admin/pages/ExperiencesManager';
import { EducationManager } from './features/admin/pages/EducationManager';
import { LearningJourneyManager } from './features/admin/pages/LearningJourneyManager';
import { BlogManager } from './features/admin/pages/BlogManager';
import { ServicesManager } from './features/admin/pages/ServicesManager';
import { CertificationsManager } from './features/admin/pages/CertificationsManager';
import { TestimonialsManager } from './features/admin/pages/TestimonialsManager';
import { MessagesManager } from './features/admin/pages/MessagesManager';
import { MediaManager } from './features/admin/pages/MediaManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin CMS Dashboard */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="profile" element={<ProfileEditor />} />
              <Route path="settings" element={<SiteSettingsEditor />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="experiences" element={<ExperiencesManager />} />
              <Route path="education" element={<EducationManager />} />
              <Route path="learning" element={<LearningJourneyManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="certifications" element={<CertificationsManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="messages" element={<MessagesManager />} />
              <Route path="media" element={<MediaManager />} />
            </Route>
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
