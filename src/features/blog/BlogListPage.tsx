import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../../hooks/usePortfolioData';
import { BookOpen, Calendar, ArrowRight, Search, Loader2 } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const BlogListPage: React.FC = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = (posts || []).filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF] text-[#172B4D]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EBF5FF] text-[#3898EC] text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen size={13} />
            <span>Articles & Notes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight">
            Engineering Blog & Writeups
          </h1>
          <p className="text-sm text-[#5B6B82] mt-2">
            Thoughts, technical deep dives, and lessons learned building full-stack web applications.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-2xl border border-[#DCEAF7] shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-[#172B4D] bg-transparent focus:outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 size={32} className="animate-spin text-[#3898EC]" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-[#DCEAF7]">
            <p className="text-sm text-[#5B6B82]">No articles found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm hover:shadow-md hover:border-[#3898EC]/40 transition flex flex-col justify-between overflow-hidden"
              >
                {post.coverImageUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#5B6B82]">
                      <span className="font-semibold text-[#3898EC]">{post.category}</span>
                      <span className="flex items-center space-x-1">
                        <Calendar size={11} className="mr-0.5" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-base font-bold text-[#172B4D] hover:text-[#3898EC] transition line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-[#5B6B82] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-[#3898EC] hover:text-[#2483D6] inline-flex items-center space-x-1"
                    >
                      <span>Read</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
