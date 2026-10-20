import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, Code2, Layers, ArrowRight } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { useProjects } from '../../hooks/usePortfolioData';
import { isSafeUrl, getExternalLinkProps } from '../../lib/validators';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const Projects: React.FC = () => {
  const { data: remoteProjects } = useProjects();
  const [filter, setFilter] = useState<string>('All');

  const activeProjectsList = remoteProjects && remoteProjects.length > 0 ? remoteProjects : projectsData;

  const categories = ['All', 'Full-Stack', 'Frontend', 'Backend / API'];

  const filteredProjects =
    filter === 'All'
      ? activeProjectsList
      : activeProjectsList.filter((project) => project.category === filter);

  return (
    <section id="projects" aria-label="Featured Projects" className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="PORTFOLIO PROJECTS"
          title="Practical applications built with care."
          description="Explore projects demonstrating full-stack architecture, clean TypeScript, and responsive interfaces. Managed dynamically via CMS."
        />

        {/* Filter Pills */}
        <div
          role="tablist"
          aria-label="Project category filters"
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {categories.map((cat) => {
            const isSelected = filter === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setFilter(cat)}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC] ${
                  isSelected
                    ? 'bg-[#3898EC] text-white shadow-sm'
                    : 'bg-[#F8FBFF] text-[#5B6B82] border border-[#DCEAF7] hover:border-[#3898EC] hover:text-[#172B4D]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const hasDemo = isSafeUrl(project.liveDemoUrl);
            const hasRepo = isSafeUrl(project.sourceCodeUrl);
            const demoProps = getExternalLinkProps(project.liveDemoUrl);
            const repoProps = getExternalLinkProps(project.sourceCodeUrl);

            // slug fallback
            const slug = 'slug' in project && project.slug ? project.slug : project.id;

            return (
              <Card
                key={project.id}
                hoverable
                className="flex flex-col justify-between overflow-hidden p-0 border-[#DCEAF7] bg-white group"
              >
                {/* Visual Area */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#F8FBFF] border-b border-[#DCEAF7] p-5 flex flex-col justify-between">
                  <div className="absolute inset-0 bg-grid-subtle opacity-50" aria-hidden="true" />

                  {/* Top Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#172B4D]">
                      <Code2 className="h-3.5 w-3.5 text-[#3898EC]" aria-hidden="true" />
                      {project.title}
                    </span>
                    <Badge variant="subtle" size="sm">
                      {project.category}
                    </Badge>
                  </div>

                  {/* Cover or placeholder */}
                  {'coverImageUrl' in project && project.coverImageUrl ? (
                    <div className="relative z-10 my-auto rounded-lg overflow-hidden h-24 max-h-24">
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative z-10 flex items-center justify-center my-auto">
                      <Layers className="h-10 w-10 text-[#60B5FF]/50" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <Link to={`/projects/${slug}`}>
                      <h3 className="text-lg font-bold text-[#172B4D] group-hover:text-[#3898EC] transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-xs sm:text-sm text-[#5B6B82] leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Highlights bullet points if present */}
                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="mt-3.5 space-y-1.5 text-xs text-[#5B6B82]">
                        {project.highlights.slice(0, 3).map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#3898EC] font-bold">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Stack Tags */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-[#EAF6FF] px-2 py-0.5 text-[11px] font-medium text-[#172B4D] border border-[#DCEAF7]/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-6 flex items-center justify-between gap-2 pt-4 border-t border-[#DCEAF7]/80">
                    <Link
                      to={`/projects/${slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#3898EC] hover:text-[#2483D6]"
                    >
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </Link>

                    <div className="flex items-center gap-2">
                      {hasRepo && (
                        <a
                          href={repoProps.href}
                          target={repoProps.target}
                          rel={repoProps.rel}
                          className="p-1.5 text-[#172B4D] hover:text-[#3898EC] transition-colors"
                          title="Source Code"
                        >
                          <Github className="h-4 w-4" aria-hidden="true" />
                        </a>
                      )}

                      {hasDemo && (
                        <a
                          href={demoProps.href}
                          target={demoProps.target}
                          rel={demoProps.rel}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#3898EC] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2483d6] transition shadow-subtle"
                          title="Live Demo"
                        >
                          <span>Demo</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
