import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileInput } from '@shared/schemas';
import { useAdminProfile } from '../../../hooks/useAdminData';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const ProfileEditor: React.FC = () => {
  const { data: profile, isLoading, updateProfile, isUpdating } = useAdminProfile();
  const [bioParagraphs, setBioParagraphs] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      role: '',
      eyebrow: '',
      headline: '',
      shortBio: '',
      fullBio: [''],
      location: '',
      available: true,
      statusLabel: '',
      preferredStyle: '',
      learningFocus: '',
      avatarUrl: '',
      avatarInitials: 'AR',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        role: profile.role,
        eyebrow: profile.eyebrow,
        headline: profile.headline,
        shortBio: profile.shortBio,
        fullBio: profile.fullBio || [''],
        location: profile.location,
        available: profile.available,
        statusLabel: profile.statusLabel,
        preferredStyle: profile.preferredStyle || '',
        learningFocus: profile.learningFocus || '',
        avatarUrl: profile.avatarUrl || '',
        avatarInitials: profile.avatarInitials,
      });
      setBioParagraphs(profile.fullBio && profile.fullBio.length > 0 ? profile.fullBio : ['']);
    }
  }, [profile, reset]);

  const addParagraph = () => {
    setBioParagraphs([...bioParagraphs, '']);
  };

  const removeParagraph = (index: number) => {
    if (bioParagraphs.length <= 1) return;
    setBioParagraphs(bioParagraphs.filter((_, i) => i !== index));
  };

  const updateParagraphText = (index: number, text: string) => {
    const updated = [...bioParagraphs];
    updated[index] = text;
    setBioParagraphs(updated);
  };

  const onSubmit = async (data: ProfileInput) => {
    try {
      const payload = {
        ...data,
        fullBio: bioParagraphs.filter((p) => p.trim().length > 0),
      };
      await updateProfile(payload);
      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Personal Profile & Biography</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Manage your personal bio, headline, availability status, and avatar information.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-[#DCEAF7] shadow-sm">
        {/* Core Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Professional Role</label>
            <input
              type="text"
              {...register('role')}
              placeholder="Software Engineer"
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
            />
            {errors.role && <p className="text-xs text-rose-600 mt-1">{errors.role.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Hero Eyebrow Tag</label>
            <input
              type="text"
              {...register('eyebrow')}
              placeholder="SOFTWARE ENGINEER"
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
            />
            {errors.eyebrow && <p className="text-xs text-rose-600 mt-1">{errors.eyebrow.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Location</label>
            <input
              type="text"
              {...register('location')}
              placeholder="Bandung, Indonesia (Open to Remote)"
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
            />
            {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location.message}</p>}
          </div>
        </div>

        {/* Headline & Short Bio */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Main Headline</label>
            <input
              type="text"
              {...register('headline')}
              placeholder="Building digital experiences that are simple, useful, and impactful."
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
            />
            {errors.headline && <p className="text-xs text-rose-600 mt-1">{errors.headline.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Short Bio (Hero Intro)</label>
            <textarea
              rows={3}
              {...register('shortBio')}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
            />
            {errors.shortBio && <p className="text-xs text-rose-600 mt-1">{errors.shortBio.message}</p>}
          </div>
        </div>

        {/* Availability Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F8FBFF] rounded-xl border border-[#DCEAF7]">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="available-check"
              {...register('available')}
              className="w-4 h-4 text-[#3898EC] rounded border-slate-300 focus:ring-[#3898EC]"
            />
            <label htmlFor="available-check" className="text-xs font-semibold text-[#172B4D]">
              Available for Work / Opportunities
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1">Status Badge Text</label>
            <input
              type="text"
              {...register('statusLabel')}
              placeholder="Open to junior roles & internships"
              className="w-full px-3 py-1.5 bg-white border border-[#DCEAF7] rounded-lg text-xs text-[#172B4D]"
            />
          </div>
        </div>

        {/* Full Bio Paragraphs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-[#172B4D]">
              About Me - Full Bio Paragraphs
            </label>
            <button
              type="button"
              onClick={addParagraph}
              className="text-xs text-[#3898EC] hover:text-[#2483D6] font-semibold flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div className="space-y-3">
            {bioParagraphs.map((para, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-xs font-bold text-slate-400 mt-2.5 shrink-0">{idx + 1}.</span>
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => updateParagraphText(idx, e.target.value)}
                  placeholder="Enter paragraph text..."
                  className="flex-1 px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC]"
                />
                {bioParagraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg mt-1"
                    title="Remove paragraph"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Avatar & Additional Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Avatar Initials</label>
            <input
              type="text"
              maxLength={4}
              {...register('avatarInitials')}
              placeholder="FG"
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Avatar Image URL (Optional)</label>
            <input
              type="text"
              {...register('avatarUrl')}
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-[#DCEAF7] flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#3898EC]/20 hover:shadow-lg transition flex items-center space-x-2 disabled:opacity-60"
          >
            {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
