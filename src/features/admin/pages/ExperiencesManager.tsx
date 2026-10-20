import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema, type ExperienceInput } from '@shared/schemas';
import { useAdminExperiences } from '../../../hooks/useAdminData';
import type { ExperienceData } from '../../../hooks/usePortfolioData';
import { Plus, Edit2, Trash2, X, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const ExperiencesManager: React.FC = () => {
  const { experiences, isLoading, createExperience, updateExperience, deleteExperience } = useAdminExperiences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      position: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: 'Present',
      isCurrent: true,
      description: '',
      technologies: [],
      displayOrder: 0,
    },
  });

  const openCreateModal = () => {
    setEditingExp(null);
    reset({
      company: '',
      position: '',
      employmentType: 'Full-time',
      startDate: '2023',
      endDate: 'Present',
      isCurrent: true,
      description: '',
      technologies: ['React', 'TypeScript', 'Node.js'],
      displayOrder: experiences.length + 1,
    });
    setTechInput('React, TypeScript, Node.js');
    setIsModalOpen(true);
  };

  const openEditModal = (exp: ExperienceData) => {
    setEditingExp(exp);
    reset({
      company: exp.company,
      position: exp.position,
      employmentType: exp.employmentType,
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present',
      isCurrent: exp.isCurrent,
      description: exp.description,
      technologies: exp.technologies,
      displayOrder: exp.displayOrder,
    });
    setTechInput(exp.technologies.join(', '));
    setIsModalOpen(true);
  };

  const onSave = async (data: ExperienceInput) => {
    try {
      const tags = techInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = { ...data, technologies: tags };

      if (editingExp) {
        await updateExperience({ id: editingExp.id, data: payload });
        toast.success('Experience record updated!');
      } else {
        await createExperience(payload);
        toast.success('Experience added!');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience(id);
      setDeleteConfirmId(null);
      toast.success('Experience removed');
    } catch {
      toast.error('Failed to delete experience');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Work Experience</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">Manage your professional career history and positions.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>Add Position</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <Loader2 size={18} className="animate-spin text-[#3898EC]" />
            <span>Loading experience records...</span>
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No experience records yet.</div>
        ) : (
          <div className="divide-y divide-[#DCEAF7]">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-4 md:p-6 hover:bg-[#F8FBFF] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#172B4D]">{exp.position}</span>
                    <span className="text-xs font-semibold text-[#3898EC]">@ {exp.company}</span>
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#5B6B82] flex items-center space-x-1">
                    <Calendar size={12} className="mr-0.5" />
                    <span>
                      {exp.startDate} - {exp.endDate || 'Present'} ({exp.employmentType})
                    </span>
                  </p>

                  <p className="text-xs text-[#172B4D] mt-1">{exp.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-2 rounded-lg text-xs font-medium border border-blue-200 text-[#3898EC] hover:bg-blue-50 transition"
                  >
                    <Edit2 size={15} />
                  </button>
                  {deleteConfirmId === exp.id ? (
                    <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="px-2 py-1 bg-rose-600 text-white text-[10px] font-bold rounded"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 text-slate-600 text-[10px] rounded"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(exp.id)}
                      className="p-2 rounded-lg text-xs font-medium border border-rose-200 text-rose-500 hover:bg-rose-50 transition"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCEAF7] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCEAF7]">
              <h2 className="text-base font-bold text-[#172B4D]">
                {editingExp ? 'Edit Experience' : 'Add Work Experience'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Company</label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                  {errors.company && <p className="text-xs text-rose-600 mt-1">{errors.company.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Position / Title</label>
                  <input
                    type="text"
                    {...register('position')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                  {errors.position && <p className="text-xs text-rose-600 mt-1">{errors.position.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Start Date</label>
                  <input
                    type="text"
                    {...register('startDate')}
                    placeholder="2022"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">End Date</label>
                  <input
                    type="text"
                    {...register('endDate')}
                    placeholder="Present"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Type</label>
                  <input
                    type="text"
                    {...register('employmentType')}
                    placeholder="Full-time"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Description & Responsibilities</label>
                <textarea
                  rows={3}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
                {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Technologies Used (Comma-separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="current-exp"
                  {...register('isCurrent')}
                  className="w-4 h-4 text-[#3898EC] rounded border-slate-300"
                />
                <label htmlFor="current-exp" className="text-xs font-semibold text-[#172B4D]">
                  Current Position
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#DCEAF7]">
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
                  className="px-5 py-2 text-xs font-semibold bg-[#3898EC] hover:bg-[#2483D6] text-white rounded-xl shadow transition"
                >
                  {isSubmitting ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
