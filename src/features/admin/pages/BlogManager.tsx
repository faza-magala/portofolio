import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogPostSchema, type BlogPostInput } from '@shared/schemas';
import { useAdminBlog } from '../../../hooks/useAdminData';
import type { BlogPostData } from '../../../hooks/usePortfolioData';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Loader2,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export const BlogManager: React.FC = () => {
  const { posts, isLoading, createPost, updatePost, deletePost } = useAdminBlog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: '',
      authorName: 'Admin',
      category: 'Engineering',
      tags: [],
      status: 'published',
    },
  });

  const contentWatch = watch('content');

  const openCreateModal = () => {
    setEditingPost(null);
    reset({
      title: '',
      slug: '',
      excerpt: '',
      content: '## Introduction\n\nWrite your article here using standard Markdown...\n\n### Core Points\n- Point 1\n- Point 2\n\n```ts\nconsole.log("Clean code");\n```',
      coverImageUrl: '',
      authorName: 'Faza Ghaisan Abdillah',
      category: 'Engineering',
      tags: ['TypeScript', 'Architecture'],
      status: 'published',
    });
    setTagsInput('TypeScript, Architecture');
    setEditorTab('write');
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPostData) => {
    setEditingPost(post);
    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.coverImageUrl || '',
      authorName: post.authorName,
      category: post.category,
      tags: post.tags,
      status: post.status,
    });
    setTagsInput(post.tags.join(', '));
    setEditorTab('write');
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!editingPost) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug);
    }
  };

  const onSave = async (data: BlogPostInput) => {
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        ...data,
        tags: tags.length > 0 ? tags : ['General'],
      };

      if (editingPost) {
        await updatePost({ id: editingPost.id, data: payload });
        toast.success('Article updated successfully!');
      } else {
        await createPost(payload);
        toast.success('Article created successfully!');
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    }
  };

  const handleTogglePublish = async (post: BlogPostData) => {
    try {
      const nextStatus = post.status === 'published' ? 'draft' : 'published';
      await updatePost({ id: post.id, data: { status: nextStatus } });
      toast.success(`Article ${nextStatus === 'published' ? 'published' : 'moved to drafts'}`);
    } catch {
      toast.error('Failed to change publication status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      setDeleteConfirmId(null);
      toast.success('Article deleted');
    } catch {
      toast.error('Failed to delete article');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Blog Posts & Articles</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Write, preview, and publish technical engineering writeups with Markdown.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
        >
          <Plus size={16} />
          <span>New Article</span>
        </button>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <Loader2 size={18} className="animate-spin text-[#3898EC]" />
            <span>Loading articles...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No blog articles yet. Click "New Article" to create your first post.
          </div>
        ) : (
          <div className="divide-y divide-[#DCEAF7]">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 md:p-6 hover:bg-[#F8FBFF] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="text-[11px] font-semibold text-[#3898EC]">{post.category}</span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] text-[#5B6B82] flex items-center space-x-1">
                      <Calendar size={11} className="mr-0.5" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#172B4D]">{post.title}</h3>
                  <p className="text-xs text-[#5B6B82] line-clamp-2">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {post.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`p-2 rounded-lg text-xs font-medium border transition ${
                      post.status === 'published'
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                    }`}
                    title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {post.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>

                  <button
                    onClick={() => openEditModal(post)}
                    className="p-2 rounded-lg text-xs font-medium border border-blue-200 text-[#3898EC] hover:bg-blue-50 transition"
                  >
                    <Edit2 size={15} />
                  </button>

                  {deleteConfirmId === post.id ? (
                    <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <button
                        onClick={() => handleDelete(post.id)}
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
                      onClick={() => setDeleteConfirmId(post.id)}
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

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-2xl border border-[#DCEAF7] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF7]">
              <h2 className="text-base font-bold text-[#172B4D]">
                {editingPost ? 'Edit Article' : 'Write New Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Article Title</label>
                  <input
                    type="text"
                    {...register('title')}
                    onChange={handleTitleChange}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                  {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Slug</label>
                  <input
                    type="text"
                    {...register('slug')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs font-mono text-[#172B4D]"
                  />
                  {errors.slug && <p className="text-xs text-rose-600 mt-1">{errors.slug.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Excerpt / Brief Summary</label>
                <textarea
                  rows={2}
                  {...register('excerpt')}
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
                {errors.excerpt && <p className="text-xs text-rose-600 mt-1">{errors.excerpt.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Category</label>
                  <input
                    type="text"
                    {...register('category')}
                    placeholder="e.g. Web Development"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, Hono, Turso"
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Markdown Content with Editor Tabs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#172B4D]">
                    Article Content (Markdown)
                  </label>
                  <div className="flex rounded-lg border border-[#DCEAF7] p-0.5 bg-slate-50 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditorTab('write')}
                      className={`px-3 py-1 rounded-md font-semibold transition ${
                        editorTab === 'write' ? 'bg-white text-[#3898EC] shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1 rounded-md font-semibold transition ${
                        editorTab === 'preview' ? 'bg-white text-[#3898EC] shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {editorTab === 'write' ? (
                  <textarea
                    rows={12}
                    {...register('content')}
                    className="w-full px-3.5 py-2.5 font-mono text-xs text-[#172B4D] border border-[#DCEAF7] rounded-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30"
                  />
                ) : (
                  <div className="w-full min-h-[300px] p-5 border border-[#DCEAF7] rounded-xl bg-slate-50/50 text-xs text-[#172B4D] overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
                    {contentWatch}
                  </div>
                )}
                {errors.content && <p className="text-xs text-rose-600 mt-1">{errors.content.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Cover Image URL</label>
                <input
                  type="text"
                  {...register('coverImageUrl')}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#DCEAF7]">
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
                  {isSubmitting ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
