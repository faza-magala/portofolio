import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectInput } from '@shared/schemas';
import { useAdminProjects } from '../../../hooks/useAdminData';
import type { ProjectItemData } from '../../../hooks/usePortfolioData';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  X,
  Loader2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

export const ProjectsManager: React.FC = () => {
  const { projects, isLoading, createProject, updateProject, deleteProject } = useAdminProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItemData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [techStackInput, setTechStackInput] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      category: 'Full-Stack',
      techStack: [],
      featured: false,
      status: 'published',
      liveDemoUrl: '',
      sourceCodeUrl: '',
      coverImageUrl: '',
      highlights: [],
      displayOrder: 0,
    },
  });

  const openCreateModal = () => {
    setEditingProject(null);
    reset({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      category: 'Full-Stack',
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      featured: false,
      status: 'published',
      liveDemoUrl: '',
      sourceCodeUrl: '',
      coverImageUrl: '',
      highlights: [],
      displayOrder: projects.length + 1,
    });
    setTechStackInput('React, TypeScript, Tailwind CSS');
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectItemData) => {
    setEditingProject(project);
    reset({
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription || '',
      category: project.category,
      techStack: project.techStack,
      featured: project.featured,
      status: project.status,
      liveDemoUrl: project.liveDemoUrl || '',
      sourceCodeUrl: project.sourceCodeUrl || '',
      coverImageUrl: project.coverImageUrl || '',
      highlights: project.highlights || [],
      displayOrder: project.displayOrder,
    });
    setTechStackInput(project.techStack.join(', '));
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!editingProject) {
      // Auto-generate clean slug from title for new projects
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug);
    }
  };

  const onSave = async (data: ProjectInput) => {
    try {
      // Process comma-separated tech stack
      const tags = techStackInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        ...data,
        techStack: tags.length > 0 ? tags : ['General'],
      };

      if (editingProject) {
        await updateProject({ id: editingProject.id, data: payload });
        toast.success('Project updated successfully!');
      } else {
        await createProject(payload);
        toast.success('Project created successfully!');
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    }
  };

  const handleTogglePublish = async (project: ProjectItemData) => {
    try {
      const nextStatus = project.status === 'published' ? 'draft' : 'published';
      await updateProject({ id: project.id, data: { status: nextStatus } });
      toast.success(`Project ${nextStatus === 'published' ? 'published' : 'moved to drafts'}`);
    } catch {
      toast.error('Failed to change publication status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setDeleteConfirmId(null);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Projects Portfolio</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Manage your showcase projects, galleries, technical stacks, and publication states.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-[#DCEAF7]">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search projects by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs text-[#172B4D] placeholder-slate-400 bg-transparent focus:outline-none"
        />
      </div>

      {/* Projects Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <Loader2 size={18} className="animate-spin text-[#3898EC]" />
            <span>Loading projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No projects found matching your query. Click "Add New Project" to create one.
          </div>
        ) : (
          <div className="divide-y divide-[#DCEAF7]">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 md:p-6 hover:bg-[#F8FBFF] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {project.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="flex items-center text-amber-500 text-[11px] font-bold" title="Featured Project">
                        <Star size={12} className="fill-amber-400 mr-0.5" /> Featured
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-[#172B4D]">{project.title}</h3>
                  <p className="text-xs text-[#5B6B82] line-clamp-2">{project.shortDescription}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(project)}
                    className={`p-2 rounded-lg text-xs font-medium border transition flex items-center space-x-1 ${
                      project.status === 'published'
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                    }`}
                    title={project.status === 'published' ? 'Unpublish to draft' : 'Publish live'}
                  >
                    {project.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>

                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 rounded-lg text-xs font-medium border border-blue-200 text-[#3898EC] hover:bg-blue-50 transition"
                    title="Edit project"
                  >
                    <Edit2 size={15} />
                  </button>

                  {deleteConfirmId === project.id ? (
                    <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-2 py-1 bg-rose-600 text-white text-[10px] font-bold rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 text-slate-600 text-[10px] rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-2 rounded-lg text-xs font-medium border border-rose-200 text-rose-500 hover:bg-rose-50 transition"
                      title="Delete project"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#DCEAF7] space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF7]">
              <h2 className="text-base font-bold text-[#172B4D]">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Project Title</label>
                  <input
                    type="text"
                    {...register('title')}
                    onChange={handleTitleChange}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                  {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">URL Slug</label>
                  <input
                    type="text"
                    {...register('slug')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs font-mono text-[#172B4D]"
                  />
                  {errors.slug && <p className="text-xs text-rose-600 mt-1">{errors.slug.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Short Description</label>
                <textarea
                  rows={2}
                  {...register('shortDescription')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
                {errors.shortDescription && (
                  <p className="text-xs text-rose-600 mt-1">{errors.shortDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Full Description (Detail View)</label>
                <textarea
                  rows={4}
                  {...register('fullDescription')}
                  placeholder="Detailed architectural breakdown, technical challenges overcome, and design goals..."
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Category</label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] bg-white"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend / API">Backend / API</option>
                    <option value="Tool / CLI">Tool / CLI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Publication Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Display Order</label>
                  <input
                    type="number"
                    {...register('displayOrder', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="React, TypeScript, Tailwind CSS, Turso"
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    {...register('liveDemoUrl')}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    {...register('sourceCodeUrl')}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Cover Image URL (Cloudinary)</label>
                <input
                  type="text"
                  {...register('coverImageUrl')}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  {...register('featured')}
                  className="w-4 h-4 text-[#3898EC] rounded border-slate-300 focus:ring-[#3898EC]"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-semibold text-[#172B4D]">
                  Feature this project on the homepage
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#DCEAF7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold bg-[#3898EC] hover:bg-[#2483D6] text-white rounded-xl shadow transition disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
