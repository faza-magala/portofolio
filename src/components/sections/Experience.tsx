import React from 'react';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { useExperiences } from '../../hooks/usePortfolioData';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const Experience: React.FC = () => {
  const { data: experiences, isLoading } = useExperiences();

  if (isLoading || !experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" aria-label="Work Experience" className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="CAREER PATH"
          title="Work experience and professional background."
          description="A timeline of my hands-on roles, company contributions, and technologies used."
        />

        <div className="max-w-3xl mx-auto space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#DCEAF7] sm:before:left-8">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative flex items-start space-x-4 sm:space-x-6">
              {/* Timeline Icon Node */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-16 sm:h-16 rounded-2xl bg-[#EBF5FF] text-[#3898EC] border-2 border-white shadow-sm flex items-center justify-center">
                <Briefcase size={20} className="sm:w-6 sm:h-6" />
              </div>

              {/* Experience Card */}
              <Card className="flex-1 p-5 sm:p-6 bg-white border border-[#DCEAF7] shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#172B4D]">{exp.position}</h3>
                    <p className="text-xs sm:text-sm text-[#3898EC] font-semibold">{exp.company}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      <Calendar size={11} />
                      <span>
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                      </span>
                    </span>
                    {exp.isCurrent && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 size={11} />
                        <span>Current</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5B6B82] leading-relaxed mb-4 whitespace-pre-line">
                  {exp.description}
                </p>

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="subtle" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
