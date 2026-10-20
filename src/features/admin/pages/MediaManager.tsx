import React, { useState } from 'react';
import { useAdminMedia } from '../../../hooks/useAdminData';
import { api } from '../../../lib/api';
import {
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  UploadCloud,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export const MediaManager: React.FC = () => {
  const { assets, cloudinaryAvailable, isLoading, recordAsset, deleteAsset } = useAdminMedia();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [manualPublicId, setManualPublicId] = useState('');
  const [manualAlt, setManualAlt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl || !manualPublicId) {
      toast.error('URL and Public ID are required');
      return;
    }

    try {
      await recordAsset({
        publicId: manualPublicId,
        secureUrl: manualUrl,
        altText: manualAlt,
      });
      toast.success('Media asset registered successfully!');
      setManualUrl('');
      setManualPublicId('');
      setManualAlt('');
      setIsUploadModalOpen(false);
    } catch {
      toast.error('Failed to register media asset');
    }
  };

  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!cloudinaryAvailable) {
      toast.error('Cloudinary environment variables are not configured on the backend.');
      return;
    }

    try {
      setIsUploading(true);
      // 1. Get signed signature from backend
      const sigRes = await api.post<{
        success: boolean;
        data: { timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string };
      }>('/admin/uploads/signature', { folder: 'portfolio_cms' });

      const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

      // 2. Direct upload to Cloudinary with secure signature
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || 'Cloudinary upload failed');
      }

      // 3. Record metadata in Turso database
      await recordAsset({
        publicId: uploadData.public_id,
        secureUrl: uploadData.secure_url,
        resourceType: uploadData.resource_type || 'image',
        width: uploadData.width,
        height: uploadData.height,
        format: uploadData.format,
        bytes: uploadData.bytes,
        altText: file.name,
      });

      toast.success('Asset uploaded and registered in library!');
      setIsUploadModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id);
      setDeleteConfirmId(null);
      toast.success('Asset deleted');
    } catch {
      toast.error('Failed to delete asset');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Media Asset Library</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Upload, browse, and organize images hosted on Cloudinary for projects and blog covers.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <UploadCloud size={16} />
          <span>Upload Asset</span>
        </button>
      </div>

      {!cloudinaryAvailable && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-800">
          <AlertTriangle size={18} className="shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="font-semibold">Cloudinary Credentials Notice</p>
            <p className="text-amber-700 mt-0.5">
              To enable direct uploads, configure <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">CLOUDINARY_CLOUD_NAME</code>, <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">CLOUDINARY_API_KEY</code>, and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">CLOUDINARY_API_SECRET</code> in your environment variables. You can still register external URLs manually anytime!
            </p>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm p-6">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <Loader2 size={18} className="animate-spin text-[#3898EC]" />
            <span>Loading media library...</span>
          </div>
        ) : assets.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
            No media assets registered yet. Click "Upload Asset" to add images.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative rounded-xl border border-[#DCEAF7] overflow-hidden bg-slate-50 flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="aspect-video w-full bg-slate-200 overflow-hidden relative">
                  <img
                    src={asset.secureUrl}
                    alt={asset.altText || 'Media preview'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="p-3 bg-white space-y-1">
                  <p className="text-xs font-semibold text-[#172B4D] truncate" title={asset.publicId}>
                    {asset.publicId.split('/').pop() || asset.publicId}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {asset.format ? asset.format.toUpperCase() : 'IMG'} {asset.width ? `• ${asset.width}x${asset.height}` : ''}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => copyToClipboard(asset.secureUrl, asset.id)}
                      className="text-xs text-[#3898EC] hover:text-[#2483D6] flex items-center space-x-1"
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedId === asset.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    {deleteConfirmId === asset.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="px-1.5 py-0.5 bg-rose-600 text-white text-[10px] rounded font-bold"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 text-slate-500 text-[10px]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(asset.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete asset"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload / Register Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DCEAF7] space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCEAF7]">
              <h2 className="text-base font-bold text-[#172B4D]">Add Media Asset</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Cloudinary direct upload */}
            {cloudinaryAvailable && (
              <div className="p-4 border-2 border-dashed border-[#3898EC]/40 rounded-xl bg-blue-50/30 text-center space-y-2">
                <UploadCloud size={24} className="mx-auto text-[#3898EC]" />
                <p className="text-xs font-semibold text-[#172B4D]">Upload to Cloudinary CDN</p>
                <p className="text-[11px] text-[#5B6B82]">Images are securely signed and delivered via global edge CDN.</p>
                <label className="inline-block mt-2 px-4 py-2 bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold rounded-xl cursor-pointer shadow transition">
                  {isUploading ? 'Uploading to Cloudinary...' : 'Select Image File'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    onChange={handleCloudinaryUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Or manual URL registration */}
            <form onSubmit={handleManualSave} className="space-y-3 pt-2">
              <p className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                {cloudinaryAvailable ? 'Or Register Existing Asset URL' : 'Register Asset URL'}
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Image Secure URL</label>
                <input
                  type="url"
                  required
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/... or https://..."
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Public ID / Name</label>
                <input
                  type="text"
                  required
                  value={manualPublicId}
                  onChange={(e) => setManualPublicId(e.target.value)}
                  placeholder="e.g. project_cover_flowtask"
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Alt Text</label>
                <input
                  type="text"
                  value={manualAlt}
                  onChange={(e) => setManualAlt(e.target.value)}
                  placeholder="e.g. Project screenshot"
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#DCEAF7]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#3898EC] hover:bg-[#2483D6] text-white rounded-xl shadow transition"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
