import React, { useState } from 'react';
import { Github, ExternalLink, Code2, Layers, AlertCircle } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { ProjectCategory } from '../../types/portfolio';
import { isSafeUrl, getExternalLinkProps } from '../../lib/validators';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');

  const categories: (ProjectCategory | 'All')[] = [
    'All',
    'Full-Stack',
    'Frontend',
    'Backend / API',
  ];

  const filteredProjects =
    filter === 'All'
      ? projectsData
      : projectsData.filter((project) => project.category === filter);

  return (
    <section id="projects" aria-label="Featured Projects" className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="PORTFOLIO PROJECTS"
          title="Practical applications built with care."
          description="Explore sample project templates demonstrating full-stack architecture, clean TypeScript, and responsive interfaces. Easily customize these entries with your own work."
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

            return (
              <Card
                key={project.id}
                hoverable
                className="flex flex-col justify-between overflow-hidden p-0 border-[#DCEAF7] bg-white group"
              >
                {/* Visual Placeholder / Mockup Area */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#F8FBFF] border-b border-[#DCEAF7] p-5 flex flex-col justify-between">
                  {/* Decorative background dot pattern */}
                  <div
                    className="absolute inset-0 bg-grid-subtle opacity-50"
                    aria-hidden="true"
                  />

                  {/* Top Bar of Project Visual */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#172B4D]">
                      <Code2 className="h-3.5 w-3.5 text-[#3898EC]" aria-hidden="true" />
                      {project.imagePlaceholder?.label || project.title}
                    </span>
                    <Badge variant="subtle" size="sm">
                      {project.category}
                    </Badge>
                  </div>

                  {/* Code snippet illustration */}
                  {project.imagePlaceholder?.codeSnippet ? (
                    <div className="relative z-10 my-auto rounded-lg bg-[#172B4D]/95 p-3 text-[11px] font-mono text-[#EAF6FF] shadow-subtle overflow-hidden">
                      <pre className="overflow-x-hidden text-ellipsis line-clamp-3 leading-tight opacity-90">
                        {project.imagePlaceholder.codeSnippet}
                      </pre>
                    </div>
                  ) : (
                    <div className="relative z-10 flex items-center justify-center my-auto">
                      <Layers className="h-10 w-10 text-[#60B5FF]/50" aria-hidden="true" />
                    </div>
                  )}

                  {/* Sample label indicator */}
                  {project.sampleNotice && (
                    <div className="relative z-10 flex items-center gap-1 text-[10px] text-[#5B6B82] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-[#DCEAF7] w-fit">
                      <AlertCircle className="h-3 w-3 text-[#3898EC]" aria-hidden="true" />
                      <span>Editable Template</span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#172B4D] group-hover:text-[#3898EC] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#5B6B82] leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Highlights bullet points if present */}
                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="mt-3.5 space-y-1.5 text-xs text-[#5B6B82]">
                        {project.highlights.map((h, i) => (
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

                  {/* Card Action Buttons (Safe & Graceful links) */}
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#DCEAF7]/80">
                    {hasRepo ? (
                      <a
                        href={repoProps.href}
                        target={repoProps.target}
                        rel={repoProps.rel}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#172B4D] hover:text-[#3898EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC] rounded-md p-1"
                        aria-label={`View source code for ${project.title}`}
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                        <span>Source Code</span>
                      </a>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B6B82]/60 cursor-not-allowed"
                        title="Repository link will be available upon project release"
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                        <span>Code Private</span>
                      </span>
                    )}

                    <div className="ml-auto">
                      {hasDemo ? (
                        <a
                          href={demoProps.href}
                          target={demoProps.target}
                          rel={demoProps.rel}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#3898EC] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2483d6] transition-colors shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC]"
                          aria-label={`Visit live demo for ${project.title}`}
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 rounded-lg bg-[#EAF6FF] px-3 py-1.5 text-xs font-medium text-[#5B6B82] border border-[#DCEAF7]"
                          title="Live deployment URL will be added when deployed"
                        >
                          <span>Demo Coming Soon</span>
                        </span>
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
