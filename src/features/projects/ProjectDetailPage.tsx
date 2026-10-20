import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectBySlug } from '../../hooks/usePortfolioData';
import { ArrowLeft, ExternalLink, Github, Star, Layers, CheckCircle2, Loader2 } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProjectBySlug(slug || '');

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

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FBFF]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-2xl font-bold text-[#172B4D] mb-2">Project Not Found</h1>
          <p className="text-xs text-[#5B6B82] mb-6">The requested project could not be found or has not been published yet.</p>
          <Link
            to="/#projects"
            className="px-5 py-2.5 rounded-xl bg-[#3898EC] text-white text-xs font-semibold shadow hover:bg-[#2483D6] transition"
          >
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF] text-[#172B4D]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Navigation Breadcrumb */}
        <Link
          to="/#projects"
          className="inline-flex items-center text-xs font-semibold text-[#5B6B82] hover:text-[#3898EC] mb-8 transition"
        >
          <ArrowLeft size={14} className="mr-1.5" /> Back to All Projects
        </Link>

        {/* Project Header */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#3898EC] border border-[#3898EC]/20">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                <Star size={12} className="fill-amber-400 mr-1" /> Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172B4D] tracking-tight">
            {project.title}
          </h1>

          <p className="text-sm md:text-base text-[#5B6B82] leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Links CTA */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 hover:shadow-lg transition"
              >
                <span>Live Demo</span>
                <ExternalLink size={14} />
              </a>
            )}

            {project.sourceCodeUrl && (
              <a
                href={project.sourceCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#172B4D] text-xs font-semibold border border-[#DCEAF7] shadow-sm transition"
              >
                <Github size={15} />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {project.coverImageUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-[#DCEAF7] shadow-lg">
            <img src={project.coverImageUrl} alt={project.title} className="w-full h-auto object-cover max-h-[480px]" />
          </div>
        )}

        {/* Tech Stack Chips */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCEAF7] shadow-sm mb-8 space-y-3">
          <h2 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center space-x-1.5 text-[#3898EC]">
            <Layers size={14} />
            <span>Technologies & Tools Used</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-[#F0F7FF] text-[#172B4D] rounded-lg text-xs font-semibold border border-[#DCEAF7]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Full Architectural Breakdown */}
        {project.fullDescription && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCEAF7] shadow-sm mb-8 space-y-4">
            <h2 className="text-base font-bold text-[#172B4D]">Architecture & Implementation Details</h2>
            <div className="text-xs sm:text-sm text-[#172B4D] leading-relaxed whitespace-pre-wrap">
              {project.fullDescription}
            </div>
          </div>
        )}

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCEAF7] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#172B4D]">Key Engineering Highlights</h2>
            <ul className="space-y-2.5">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-[#5B6B82]">
                  <CheckCircle2 size={16} className="text-[#3898EC] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
