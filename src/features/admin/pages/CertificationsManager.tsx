import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificationSchema, type CertificationInput } from '@shared/schemas';
import { useAdminCertifications } from '../../../hooks/useAdminData';
import type { CertificationData } from '../../../hooks/usePortfolioData';
import { Award, Plus, Edit2, Trash2, X, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export const CertificationsManager: React.FC = () => {
  const { certifications, isLoading, createCertification, updateCertification, deleteCertification } =
    useAdminCertifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificationInput>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
      certificateImageUrl: '',
      displayOrder: 0,
    },
  });

  const openCreateModal = () => {
    setEditingCert(null);
    reset({
      title: '',
      issuer: '',
      issueDate: new Date().getFullYear().toString(),
      credentialUrl: '',
      certificateImageUrl: '',
      displayOrder: certifications.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificationData) => {
    setEditingCert(cert);
    reset({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      credentialUrl: cert.credentialUrl || '',
      certificateImageUrl: cert.certificateImageUrl || '',
      displayOrder: cert.displayOrder,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CertificationInput) => {
    try {
      if (editingCert) {
        await updateCertification({ id: editingCert.id, data });
        toast.success('Certification updated successfully');
      } else {
        await createCertification(data);
        toast.success('Certification added successfully');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCertification(id);
      toast.success('Certification removed');
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
            <Award size={15} />
            <span>Credentials & Licenses</span>
          </div>
          <h1 className="text-xl font-bold text-[#172B4D]">Certifications & Achievements</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Manage your professional licenses, verified course certificates, and accredited badges.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Grid of Certifications */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-[#DCEAF7]" />
          ))}
        </div>
      ) : certifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#DCEAF7] p-12 text-center">
          <Award size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-sm text-[#172B4D]">No certifications recorded yet</h3>
          <p className="text-xs text-[#5B6B82] max-w-sm mx-auto mt-1 mb-4">
            Showcase your verified skills from AWS, Meta, Google, Dicoding, or universities.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#3898EC] text-white text-xs font-semibold hover:bg-[#2483D6] transition"
          >
            <Plus size={14} />
            <span>Add First Certificate</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-[#DCEAF7] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {cert.issueDate}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#172B4D] leading-snug">{cert.title}</h3>
                <p className="text-xs text-[#3898EC] font-medium mt-1">{cert.issuer}</p>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-[#5B6B82] hover:text-[#3898EC] mt-3 transition"
                  >
                    <span>View Credential</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Order: {cert.displayOrder}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 text-slate-500 hover:text-[#3898EC] rounded-lg hover:bg-slate-50 transition"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cert.id)}
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
                {editingCert ? 'Edit Certification' : 'Add New Certification'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Certificate / Course Title *
                </label>
                <input
                  {...register('title')}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                />
                {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Issuer Organization *</label>
                  <input
                    {...register('issuer')}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                  />
                  {errors.issuer && <p className="text-[11px] text-rose-500 mt-1">{errors.issuer.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Issue Date *</label>
                  <input
                    {...register('issueDate')}
                    placeholder="e.g. May 2024"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                  />
                  {errors.issueDate && <p className="text-[11px] text-rose-500 mt-1">{errors.issueDate.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Credential Verification URL
                </label>
                <input
                  {...register('credentialUrl')}
                  placeholder="https://credly.com/badges/..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Certificate Image URL (Optional)
                </label>
                <input
                  {...register('certificateImageUrl')}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Display Order</label>
                <input
                  type="number"
                  {...register('displayOrder', { valueAsNumber: true })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#3898EC] focus:ring-2 focus:ring-[#3898EC]/20 outline-none"
                />
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
                  <span>{editingCert ? 'Save Changes' : 'Create Certificate'}</span>
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
            <h4 className="font-bold text-sm text-[#172B4D]">Remove Certification?</h4>
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
