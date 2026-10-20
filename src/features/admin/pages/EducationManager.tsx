import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, type EducationInput } from '@shared/schemas';
import { useAdminEducation } from '../../../hooks/useAdminData';
import type { EducationData } from '../../../hooks/usePortfolioData';
import { Plus, Edit2, Trash2, X, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const EducationManager: React.FC = () => {
  const { education, isLoading, createEducation, updateEducation, deleteEducation } = useAdminEducation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: 'Present',
      description: '',
      displayOrder: 0,
    },
  });

  const openCreateModal = () => {
    setEditingEdu(null);
    reset({
      institution: '',
      degree: "Bachelor's Degree",
      fieldOfStudy: 'Computer Science',
      startDate: '2019',
      endDate: '2023',
      description: '',
      displayOrder: education.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu: EducationData) => {
    setEditingEdu(edu);
    reset({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate || 'Present',
      description: edu.description || '',
      displayOrder: edu.displayOrder,
    });
    setIsModalOpen(true);
  };

  const onSave = async (data: EducationInput) => {
    try {
      if (editingEdu) {
        await updateEducation({ id: editingEdu.id, data });
        toast.success('Education record updated!');
      } else {
        await createEducation(data);
        toast.success('Education record added!');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEducation(id);
      setDeleteConfirmId(null);
      toast.success('Education record removed');
    } catch {
      toast.error('Failed to delete education record');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Education & Degrees</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">Manage your academic credentials and qualifications.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>Add Education</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <Loader2 size={18} className="animate-spin text-[#3898EC]" />
            <span>Loading education records...</span>
          </div>
        ) : education.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No education records yet.</div>
        ) : (
          <div className="divide-y divide-[#DCEAF7]">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-4 md:p-6 hover:bg-[#F8FBFF] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#172B4D]">{edu.degree} in {edu.fieldOfStudy}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#3898EC]">{edu.institution}</p>
                  <p className="text-xs text-[#5B6B82] flex items-center space-x-1">
                    <Calendar size={12} className="mr-0.5" />
                    <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
                  </p>
                  {edu.description && <p className="text-xs text-[#172B4D] mt-1">{edu.description}</p>}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => openEditModal(edu)}
                    className="p-2 rounded-lg text-xs font-medium border border-blue-200 text-[#3898EC] hover:bg-blue-50 transition"
                  >
                    <Edit2 size={15} />
                  </button>
                  {deleteConfirmId === edu.id ? (
                    <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <button
                        onClick={() => handleDelete(edu.id)}
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
                      onClick={() => setDeleteConfirmId(edu.id)}
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DCEAF7] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCEAF7]">
              <h2 className="text-base font-bold text-[#172B4D]">
                {editingEdu ? 'Edit Education' : 'Add Education Record'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Institution</label>
                <input
                  type="text"
                  {...register('institution')}
                  placeholder="e.g. University Name"
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
                {errors.institution && <p className="text-xs text-rose-600 mt-1">{errors.institution.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Degree</label>
                  <input
                    type="text"
                    {...register('degree')}
                    placeholder="Bachelor's"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Field of Study</label>
                  <input
                    type="text"
                    {...register('fieldOfStudy')}
                    placeholder="Computer Science"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Start Date</label>
                  <input
                    type="text"
                    {...register('startDate')}
                    placeholder="2019"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">End Date</label>
                  <input
                    type="text"
                    {...register('endDate')}
                    placeholder="2023"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
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
                  {isSubmitting ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
