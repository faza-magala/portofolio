import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceInput } from '@shared/schemas';
import { useAdminServices } from '../../../hooks/useAdminData';
import type { ServiceData } from '../../../hooks/usePortfolioData';
import { Layers, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ServicesManager: React.FC = () => {
  const { services, isLoading, createService, updateService, deleteService } = useAdminServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      iconName: 'Layers',
      pricingText: '',
      displayOrder: 0,
    },
  });

  const openCreateModal = () => {
    setEditingService(null);
    reset({
      title: '',
      description: '',
      iconName: 'Layers',
      pricingText: 'Available for freelance or contract',
      displayOrder: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (srv: ServiceData) => {
    setEditingService(srv);
    reset({
      title: srv.title,
      description: srv.description,
      iconName: srv.iconName || 'Layers',
      pricingText: srv.pricingText || '',
      displayOrder: srv.displayOrder,
    });
    setIsModalOpen(true);
  };

  const onSave = async (data: ServiceInput) => {
    try {
      if (editingService) {
        await updateService({ id: editingService.id, data });
        toast.success('Service updated!');
      } else {
        await createService(data);
        toast.success('Service created!');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      setDeleteConfirmId(null);
      toast.success('Service removed');
    } catch {
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Offered Services</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">Define freelancing and software engineering services you provide.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 col-span-full">
            <Loader2 size={18} className="animate-spin text-[#3898EC] mx-auto mb-2" />
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 col-span-full">No services registered yet.</div>
        ) : (
          services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white p-5 rounded-2xl border border-[#DCEAF7] shadow-sm hover:border-[#3898EC]/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center mb-3">
                  <Layers size={18} />
                </div>
                <h3 className="font-bold text-sm text-[#172B4D]">{srv.title}</h3>
                <p className="text-xs text-[#5B6B82] mt-1.5">{srv.description}</p>
                {srv.pricingText && (
                  <p className="text-xs font-semibold text-[#3898EC] mt-2">{srv.pricingText}</p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-[#DCEAF7]/60">
                <button
                  onClick={() => openEditModal(srv)}
                  className="p-1.5 text-slate-500 hover:text-[#3898EC] rounded-lg hover:bg-slate-50"
                >
                  <Edit2 size={14} />
                </button>
                {deleteConfirmId === srv.id ? (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDelete(srv.id)}
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
                    onClick={() => setDeleteConfirmId(srv.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DCEAF7] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCEAF7]">
              <h2 className="text-base font-bold text-[#172B4D]">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Service Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Description</label>
                <textarea
                  rows={3}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
                {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Pricing / Availability Note</label>
                <input
                  type="text"
                  {...register('pricingText')}
                  placeholder="e.g. Contract or project-based"
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
                  {isSubmitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
