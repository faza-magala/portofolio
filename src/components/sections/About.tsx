import React from 'react';
import {
  Code2,
  Server,
  ShieldCheck,
  Compass,
  MapPin,
  Laptop,
  BookOpen,
} from 'lucide-react';
import { siteConfig } from '../../config/site';
import { useProfile } from '../../hooks/usePortfolioData';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const About: React.FC = () => {
  const { data: profile } = useProfile();

  const fullBio = profile?.fullBio && profile.fullBio.length > 0 ? profile.fullBio : siteConfig.developer.fullBio;
  const location = profile?.location || siteConfig.developer.location;
  const preferredStyle = profile?.preferredStyle || siteConfig.developer.preferredStyle;
  const learningFocus = profile?.learningFocus || siteConfig.developer.learningFocus;

  const pillars = [
    {
      icon: <Code2 className="h-5 w-5 text-[#3898EC]" aria-hidden="true" />,
      title: 'Frontend Craftsmanship',
      description:
        'Building interfaces that feel crisp, fast, and accessible. Deeply appreciating semantic HTML, clean CSS patterns, and declarative React paradigms.',
    },
    {
      icon: <Server className="h-5 w-5 text-[#3898EC]" aria-hidden="true" />,
      title: 'Backend & Data Flow',
      description:
        'Designing structured REST APIs, handling data persistence in SQLite/PostgreSQL, and validating requests to guarantee predictable server behavior.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#3898EC]" aria-hidden="true" />,
      title: 'Security & Robustness',
      description:
        'Treating security as a design requirement: safe URL sanitization, environment isolation, input validation, and protecting sensitive endpoints.',
    },
    {
      icon: <Compass className="h-5 w-5 text-[#3898EC]" aria-hidden="true" />,
      title: 'Pragmatic Engineering',
      description:
        'Preferring readable and maintainable solutions over clever hacks. Writing meaningful Git commits, strict TypeScript, and modular components.',
    },
  ];

  return (
    <section id="about" aria-label="About Me" className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="ABOUT ME"
          title="Curious mind, committed to engineering quality."
          description="A glimpse into my background, engineering values, and what drives my daily coding habits."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Story narrative & quick facts */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4 text-base leading-relaxed text-[#5B6B82]">
              {fullBio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Quick Context Card */}
            <div className="rounded-2xl border border-[#DCEAF7] bg-[#F8FBFF] p-5 space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
                Profile Snapshot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#5B6B82]">
                  <MapPin className="h-4 w-4 text-[#3898EC] shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-[#172B4D]">Location:</strong> {location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#5B6B82]">
                  <Laptop className="h-4 w-4 text-[#3898EC] shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-[#172B4D]">Workstyle:</strong> {preferredStyle}
                  </span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 text-[#5B6B82]">
                  <BookOpen className="h-4 w-4 text-[#3898EC] shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-[#172B4D]">Current Focus:</strong> {learningFocus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Engineering Pillars */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, index) => (
              <Card
                key={index}
                hoverable
                className="flex flex-col p-5 bg-[#F8FBFF] border-[#DCEAF7]"
              >
                <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#DCEAF7] shadow-subtle">
                  {pillar.icon}
                </div>
                <h4 className="text-sm font-semibold text-[#172B4D] mb-1.5">
                  {pillar.title}
                </h4>
                <p className="text-xs leading-relaxed text-[#5B6B82]">
                  {pillar.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
