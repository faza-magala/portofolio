import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { learningJourneySchema, type LearningJourneyInput } from '@shared/schemas';
import { useAdminLearning } from '../../../hooks/useAdminData';
import type { LearningItemData } from '../../../hooks/usePortfolioData';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const LearningJourneyManager: React.FC = () => {
  const { learning, isLoading, createLearning, updateLearning, deleteLearning } = useAdminLearning();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LearningItemData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [topicsInput, setTopicsInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LearningJourneyInput>({
    resolver: zodResolver(learningJourneySchema),
    defaultValues: {
      title: '',
      status: 'In Progress',
      description: '',
      topics: [],
      resourcesOrGoals: '',
      displayOrder: 0,
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    reset({
      title: '',
      status: 'In Progress',
      description: '',
      topics: [],
      resourcesOrGoals: '',
      displayOrder: learning.length + 1,
    });
    setTopicsInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: LearningItemData) => {
    setEditingItem(item);
    reset({
      title: item.title,
      status: item.status,
      description: item.description,
      topics: item.topics,
      resourcesOrGoals: item.resourcesOrGoals || '',
      displayOrder: item.displayOrder,
    });
    setTopicsInput(item.topics.join(', '));
    setIsModalOpen(true);
  };

  const onSave = async (data: LearningJourneyInput) => {
    try {
      const parsedTopics = topicsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = { ...data, topics: parsedTopics };

      if (editingItem) {
        await updateLearning({ id: editingItem.id, data: payload });
        toast.success('Learning milestone updated!');
      } else {
        await createLearning(payload);
        toast.success('Learning milestone added!');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLearning(id);
      setDeleteConfirmId(null);
      toast.success('Milestone deleted');
    } catch {
      toast.error('Failed to delete milestone');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Learning Journey</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Transparently document your continuous technical learning and roadmap.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>Add Milestone</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <Loader2 size={18} className="animate-spin text-[#3898EC]" />
            <span>Loading milestones...</span>
          </div>
        ) : learning.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No learning milestones yet.</div>
        ) : (
          <div className="divide-y divide-[#DCEAF7]">
            {learning.map((item) => (
              <div
                key={item.id}
                className="p-4 md:p-6 hover:bg-[#F8FBFF] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Milestone'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                    <h3 className="font-bold text-sm text-[#172B4D]">{item.title}</h3>
                  </div>

                  <p className="text-xs text-[#5B6B82]">{item.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.topics.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-lg text-xs font-medium border border-blue-200 text-[#3898EC] hover:bg-blue-50 transition"
                  >
                    <Edit2 size={15} />
                  </button>
                  {deleteConfirmId === item.id ? (
                    <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <button
                        onClick={() => handleDelete(item.id)}
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
                      onClick={() => setDeleteConfirmId(item.id)}
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
                {editingItem ? 'Edit Milestone' : 'Add Learning Milestone'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Status</label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] bg-white"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                  <option value="Milestone">Milestone (Achieved)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Description</label>
                <textarea
                  rows={2}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Topics (Comma-separated)</label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={(e) => setTopicsInput(e.target.value)}
                  placeholder="Generics, Conditional Types, Strict Config"
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Resources / Next Goals</label>
                <input
                  type="text"
                  {...register('resourcesOrGoals')}
                  placeholder="Books, documentation, or milestone repositories"
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
                  {isSubmitting ? 'Saving...' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
