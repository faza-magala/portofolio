import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogPostBySlug } from '../../hooks/usePortfolioData';
import { ArrowLeft, Calendar, User, Loader2 } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

/**
 * Clean and secure markdown formatter that parses headers, bold, code blocks, and lists
 * without danger of arbitrary raw HTML execution (XSS safe).
 */
function renderSafeMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  lines.forEach((line, index) => {
    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${index}`}
            className="my-4 p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto"
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-bold text-[#172B4D] mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-[#172B4D] mt-8 mb-3 pb-1 border-b border-[#DCEAF7]">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-xl font-extrabold text-[#172B4D] mt-8 mb-4">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={index} className="ml-5 list-disc text-xs sm:text-sm text-[#172B4D] my-1 leading-relaxed">
          {line.replace('- ', '')}
        </li>
      );
    } else if (line.trim().length === 0) {
      elements.push(<div key={index} className="h-3" />);
    } else {
      elements.push(
        <p key={index} className="text-xs sm:text-sm text-[#172B4D] leading-relaxed my-1.5">
          {line}
        </p>
      );
    }
  });

  return elements;
}

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPostBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FBFF]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#3898EC]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FBFF]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-2xl font-bold text-[#172B4D] mb-2">Article Not Found</h1>
          <p className="text-xs text-[#5B6B82] mb-6">The article you are looking for does not exist or has been unpublished.</p>
          <Link
            to="/blog"
            className="px-5 py-2.5 rounded-xl bg-[#3898EC] text-white text-xs font-semibold shadow hover:bg-[#2483D6] transition"
          >
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF] text-[#172B4D]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 md:py-16">
        <Link
          to="/blog"
          className="inline-flex items-center text-xs font-semibold text-[#5B6B82] hover:text-[#3898EC] mb-8 transition"
        >
          <ArrowLeft size={14} className="mr-1.5" /> Back to Articles
        </Link>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#3898EC] border border-[#3898EC]/20">
              {post.category}
            </span>
            <span className="text-xs text-[#5B6B82] flex items-center space-x-1">
              <Calendar size={13} className="mr-0.5" />
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172B4D] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-3 pt-2 text-xs text-[#5B6B82]">
            <div className="flex items-center space-x-1.5 font-semibold text-[#172B4D]">
              <User size={14} className="text-[#3898EC]" />
              <span>{post.authorName}</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-[#DCEAF7] shadow-md">
            <img src={post.coverImageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[420px]" />
          </div>
        )}

        {/* Content Body */}
        <article className="bg-white p-6 sm:p-10 rounded-2xl border border-[#DCEAF7] shadow-sm mb-10 prose-slate">
          {renderSafeMarkdown(post.content)}
        </article>

        {/* Tags Footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#DCEAF7]">
            <span className="text-xs font-semibold text-[#5B6B82] mr-1">Tags:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-white border border-[#DCEAF7] rounded-lg text-xs font-medium text-[#172B4D]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
