import React from 'react';
import { ArrowRight, Mail, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';

export const Hero: React.FC = () => {
  const coreStack = ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'];

  return (
    <section
      id="home"
      aria-label="Introduction and Overview"
      className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-24 lg:pb-32 bg-gradient-to-b from-[#F8FBFF] via-[#F8FBFF] to-[#EAF6FF]/40"
    >
      {/* Decorative background grid pattern */}
      <div
        className="absolute inset-0 bg-grid-subtle opacity-70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative soft glowing blur blobs */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#60B5FF]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-4 h-72 w-72 rounded-full bg-[#3898EC]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status / Availability Badge */}
            {siteConfig.developer.status.available && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCEAF7] bg-white px-3.5 py-1.5 text-xs font-medium text-[#172B4D] shadow-subtle">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{siteConfig.developer.status.label}</span>
              </div>
            )}

            {/* Eyebrow */}
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#3898EC]">
              {siteConfig.developer.eyebrow}
            </p>

            {/* Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-[#172B4D] sm:text-4xl md:text-5xl lg:text-5xl lg:leading-[1.15]">
              {siteConfig.developer.headline}
            </h1>

            {/* Supporting text */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#5B6B82] max-w-xl">
              {siteConfig.developer.shortBio}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                href="#projects"
                icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                iconPosition="right"
              >
                Explore My Projects
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="#contact"
                icon={<Mail className="h-4 w-4" aria-hidden="true" />}
              >
                Get In Touch
              </Button>
            </div>

            {/* Core Stack Badges */}
            <div className="mt-10 border-t border-[#DCEAF7]/80 pt-6 w-full max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5B6B82] mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#3898EC]" aria-hidden="true" />
                <span>Primary Technologies In Use</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {coreStack.map((tech) => (
                  <Badge key={tech} variant="default" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Clean Developer Visual Element & Portrait Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Decorative Card container */}
              <div className="relative overflow-hidden rounded-3xl border border-[#DCEAF7] bg-white p-6 shadow-card transition-all duration-300">
                {/* Header of code card */}
                <div className="flex items-center justify-between border-b border-[#DCEAF7] pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F56]/80" aria-hidden="true" />
                    <span className="h-3 w-3 rounded-full bg-[#FFBD2E]/80" aria-hidden="true" />
                    <span className="h-3 w-3 rounded-full bg-[#27C93F]/80" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#5B6B82]">
                    <Terminal className="h-3.5 w-3.5 text-[#3898EC]" aria-hidden="true" />
                    <span>developer.config.ts</span>
                  </div>
                </div>

                {/* Profile Card Snippet */}
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#F8FBFF] border border-[#DCEAF7] mb-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3898EC] to-[#60B5FF] text-xl font-bold font-mono text-white shadow-sm">
                    {siteConfig.developer.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#172B4D] truncate">
                      {siteConfig.developer.name}
                    </p>
                    <p className="text-xs text-[#5B6B82] truncate">
                      {siteConfig.developer.location}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      <span>Ready to build & contribute</span>
                    </div>
                  </div>
                </div>

                {/* Code preview block */}
                <pre
                  tabIndex={0}
                  className="rounded-xl bg-[#172B4D] p-4 font-mono text-xs text-[#EAF6FF] overflow-x-auto shadow-inner leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#3898EC]"
                >
                  <code>{`// Core Engineering Philosophy
const developer = {
  mindset: "Curious & pragmatic",
  principles: [
    "Clean, readable TypeScript",
    "Accessible by default (WCAG)",
    "Secure API design",
    "Continuous learning",
  ],
  status: "Ready for junior fullstack roles",
};`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
