import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema, type SkillInput } from '@shared/schemas';
import { useAdminSkills } from '../../../hooks/useAdminData';
import type { SkillItemData } from '../../../hooks/usePortfolioData';
import { Plus, Edit2, Trash2, X, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const SkillsManager: React.FC = () => {
  const { skills, isLoading, createSkill, updateSkill, deleteSkill } = useAdminSkills();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItemData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: 'frontend',
      proficiency: 'Proficient',
      iconName: 'Code',
      description: '',
      isFocus: false,
      displayOrder: 0,
    },
  });

  const openCreateModal = () => {
    setEditingSkill(null);
    reset({
      name: '',
      category: 'frontend',
      proficiency: 'Proficient',
      iconName: 'Code',
      description: '',
      isFocus: false,
      displayOrder: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: SkillItemData) => {
    setEditingSkill(skill);
    reset({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      iconName: skill.iconName || 'Code',
      description: skill.description || '',
      isFocus: skill.isFocus,
      displayOrder: skill.displayOrder,
    });
    setIsModalOpen(true);
  };

  const onSave = async (data: SkillInput) => {
    try {
      if (editingSkill) {
        await updateSkill({ id: editingSkill.id, data });
        toast.success('Skill updated successfully!');
      } else {
        await createSkill(data);
        toast.success('Skill created successfully!');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      setDeleteConfirmId(null);
      toast.success('Skill deleted');
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  const filteredSkills = skills.filter((s) =>
    activeCategory === 'all' ? true : s.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Skills & Technologies</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Manage your technical languages, frameworks, databases, and workflow tools.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {['all', 'frontend', 'backend', 'databases', 'tools'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              activeCategory === cat
                ? 'bg-[#3898EC] text-white shadow-sm'
                : 'bg-white text-[#5B6B82] border border-[#DCEAF7] hover:bg-[#F0F7FF]'
            }`}
          >
            {cat === 'all' ? 'All Skills' : cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <Loader2 size={18} className="animate-spin text-[#3898EC]" />
            <span>Loading skills...</span>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No skills in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-4 p-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-xl border border-[#DCEAF7] bg-white hover:border-[#3898EC]/40 hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {skill.category}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        skill.proficiency === 'Proficient'
                          ? 'text-emerald-600'
                          : skill.proficiency === 'Learning'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {skill.proficiency}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-sm text-[#172B4D]">{skill.name}</h3>
                    {skill.isFocus && (
                      <span title="Core Focus Skill">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                      </span>
                    )}
                  </div>
                  {skill.description && (
                    <p className="text-xs text-[#5B6B82] mt-1">{skill.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-1.5 text-slate-500 hover:text-[#3898EC] rounded-lg hover:bg-slate-50"
                  >
                    <Edit2 size={14} />
                  </button>
                  {deleteConfirmId === skill.id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="px-2 py-0.5 bg-rose-600 text-white text-[10px] rounded font-bold"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 text-slate-500 text-[10px]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(skill.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                    >
                      <Trash2 size={14} />
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
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Skill Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. TypeScript, React, Docker"
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Category</label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] bg-white"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="databases">Databases</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Proficiency</label>
                  <select
                    {...register('proficiency')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] bg-white"
                  >
                    <option value="Proficient">Proficient</option>
                    <option value="Learning">Learning</option>
                    <option value="Exploring">Exploring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Short Description</label>
                <input
                  type="text"
                  {...register('description')}
                  placeholder="e.g. Type safety, generics, interfaces"
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="focus-checkbox"
                  {...register('isFocus')}
                  className="w-4 h-4 text-[#3898EC] rounded border-slate-300"
                />
                <label htmlFor="focus-checkbox" className="text-xs font-semibold text-[#172B4D]">
                  Highlight as Core Technical Focus
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
                  {isSubmitting ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
