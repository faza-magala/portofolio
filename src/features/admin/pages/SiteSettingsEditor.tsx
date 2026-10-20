import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { siteSettingsSchema, type SiteSettingsInput } from '@shared/schemas';
import { useAdminSettings } from '../../../hooks/useAdminData';
import { Save, Loader2, Globe, Mail, Github, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

export const SiteSettingsEditor: React.FC = () => {
  const { data: settings, isLoading, updateSettings, isUpdating } = useAdminSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteTitle: '',
      siteDescription: '',
      siteUrl: '',
      contactEmail: '',
      githubUrl: '',
      linkedinUrl: '',
      collaborativeInvite: '',
      footerText: '',
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        siteUrl: settings.siteUrl,
        contactEmail: settings.contactEmail,
        githubUrl: settings.githubUrl,
        linkedinUrl: settings.linkedinUrl,
        collaborativeInvite: settings.collaborativeInvite,
        footerText: settings.footerText,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SiteSettingsInput) => {
    try {
      await updateSettings(data);
      toast.success('Site settings updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update settings';
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-[#3898EC]" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-[#172B4D]">Site Settings & SEO</h1>
        <p className="text-xs text-[#5B6B82] mt-0.5">
          Configure site metadata, social profiles, email contacts, and footer notices.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-[#DCEAF7] shadow-sm">
        {/* SEO & Meta */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider text-[#3898EC]">
            Global SEO & Metadata
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Site Title (Browser Tab & OpenGraph)</label>
            <input
              type="text"
              {...register('siteTitle')}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
            />
            {errors.siteTitle && <p className="text-xs text-rose-600 mt-1">{errors.siteTitle.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Site Meta Description</label>
            <textarea
              rows={3}
              {...register('siteDescription')}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
            />
            {errors.siteDescription && <p className="text-xs text-rose-600 mt-1">{errors.siteDescription.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Canonical Site URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe size={15} />
              </div>
              <input
                type="text"
                {...register('siteUrl')}
                placeholder="https://yourportfolio.vercel.app"
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
              />
            </div>
            {errors.siteUrl && <p className="text-xs text-rose-600 mt-1">{errors.siteUrl.message}</p>}
          </div>
        </div>

        {/* Social Links & Contact */}
        <div className="space-y-4 pt-4 border-t border-[#DCEAF7]">
          <h2 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider text-[#3898EC]">
            Contact & Social Profiles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Primary Contact Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  {...register('contactEmail')}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>
              {errors.contactEmail && <p className="text-xs text-rose-600 mt-1">{errors.contactEmail.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">GitHub Profile URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Github size={15} />
                </div>
                <input
                  type="text"
                  {...register('githubUrl')}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">LinkedIn Profile URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Linkedin size={15} />
                </div>
                <input
                  type="text"
                  {...register('linkedinUrl')}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Collaborative Invite Text</label>
            <input
              type="text"
              {...register('collaborativeInvite')}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Footer Copyright & Note</label>
            <input
              type="text"
              {...register('footerText')}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#DCEAF7] flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#3898EC]/20 hover:shadow-lg transition flex items-center space-x-2 disabled:opacity-60"
          >
            {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
