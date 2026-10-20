import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testimonialSchema, type TestimonialInput } from '@shared/schemas';
import { useAdminTestimonials } from '../../../hooks/useAdminData';
import type { TestimonialData } from '../../../hooks/usePortfolioData';
import { MessageSquareQuote, Plus, Edit2, Trash2, X, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const TestimonialsManager: React.FC = () => {
  const { testimonials, isLoading, createTestimonial, updateTestimonial, deleteTestimonial } =
    useAdminTestimonials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      clientName: '',
      positionOrCompany: '',
      testimonialText: '',
      avatarUrl: '',
      featured: false,
      displayOrder: 0,
    },
  });

  const openCreateModal = () => {
    setEditingTestimonial(null);
    reset({
      clientName: '',
      positionOrCompany: '',
      testimonialText: '',
      avatarUrl: '',
      featured: false,
      displayOrder: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: TestimonialData) => {
    setEditingTestimonial(t);
    reset({
      clientName: t.clientName,
      positionOrCompany: t.positionOrCompany,
      testimonialText: t.testimonialText,
      avatarUrl: t.avatarUrl || '',
      featured: t.featured,
      displayOrder: t.displayOrder,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: TestimonialInput) => {
    try {
      if (editingTestimonial) {
        await updateTestimonial({ id: editingTestimonial.id, data });
        toast.success('Testimonial updated successfully');
      } else {
        await createTestimonial(data);
        toast.success('Testimonial added successfully');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
      toast.success('Testimonial removed');
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DCEAF7] shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#3898EC] font-semibold text-xs tracking-wider uppercase mb-1">
            <MessageSquareQuote size={15} />
            <span>Social Proof</span>
          </div>
          <h1 className="text-xl font-bold text-[#172B4D]">Client & Peer Testimonials</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Manage endorsements, recommendations, and reviews from colleagues, clients, and managers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-[#DCEAF7]" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#DCEAF7] p-12 text-center">
          <MessageSquareQuote size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-sm text-[#172B4D]">No testimonials recorded yet</h3>
          <p className="text-xs text-[#5B6B82] max-w-sm mx-auto mt-1 mb-4">
            Highlight feedback from clients or team leads to build trust and credibility.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#3898EC] text-white text-xs font-semibold hover:bg-[#2483D6] transition"
          >
            <Plus size={14} />
            <span>Add First Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-[#DCEAF7] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.clientName}
                        className="w-10 h-10 rounded-full object-cover border border-[#DCEAF7]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center font-bold text-xs">
                        {t.clientName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-[#172B4D] leading-none">{t.clientName}</h3>
                      <p className="text-[11px] text-[#5B6B82] mt-0.5">{t.positionOrCompany}</p>
                    </div>
                  </div>

                  {t.featured && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold">
                      <Star size={10} className="fill-amber-400" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 italic bg-slate-50/80 p-3 rounded-xl border border-slate-100 line-clamp-4">
                  "{t.testimonialText}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Order: {t.displayOrder}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 text-slate-500 hover:text-[#3898EC] rounded-lg hover:bg-slate-50 transition"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(t.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCEAF7] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#172B4D]">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Client / Colleague Name *</label>
                  <input
                    {...register('clientName')}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                  />
                  {errors.clientName && <p className="text-[11px] text-rose-500 mt-1">{errors.clientName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Position & Organization *</label>
                  <input
                    {...register('positionOrCompany')}
                    placeholder="e.g. Senior Tech Lead at TechCorp"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                  />
                  {errors.positionOrCompany && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.positionOrCompany.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Testimonial Quote *</label>
                <textarea
                  {...register('testimonialText')}
                  rows={4}
                  placeholder="Share what this client or team lead had to say about your technical work..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none resize-none"
                />
                {errors.testimonialText && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.testimonialText.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Avatar Image URL (Optional)</label>
                <input
                  {...register('avatarUrl')}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                />
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="rounded border-slate-300 text-[#3898EC] focus:ring-[#3898EC]/20"
                  />
                  <span className="text-xs font-semibold text-[#172B4D]">Feature on Homepage</span>
                </label>

                <div className="flex items-center space-x-2 ml-auto">
                  <label className="text-xs font-semibold text-[#172B4D]">Order:</label>
                  <input
                    type="number"
                    {...register('displayOrder', { valueAsNumber: true })}
                    className="w-20 px-2 py-1 rounded-lg text-xs border border-slate-200 focus:border-[#3898EC] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#3898EC] text-white text-xs font-semibold hover:bg-[#2483D6] disabled:opacity-50 transition"
                >
                  {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingTestimonial ? 'Save Changes' : 'Create Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={22} />
            </div>
            <h4 className="font-bold text-sm text-[#172B4D]">Remove Testimonial?</h4>
            <p className="text-xs text-[#5B6B82] mt-1 mb-5">
              This action cannot be undone. It will be removed from your public portfolio.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
