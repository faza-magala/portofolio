import React from 'react';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { useEducation } from '../../hooks/usePortfolioData';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const Education: React.FC = () => {
  const { data: educationList, isLoading } = useEducation();

  if (isLoading || !educationList || educationList.length === 0) {
    return null;
  }

  return (
    <section id="education" aria-label="Education Background" className="py-20 bg-[#F8FBFF]">
      <Container>
        <SectionHeading
          eyebrow="ACADEMIC BACKGROUND"
          title="Education and formal foundation."
          description="Degrees, academic coursework, and formal studies that strengthened my software engineering principles."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {educationList.map((edu) => (
            <Card
              key={edu.id}
              className="p-6 bg-white border border-[#DCEAF7] shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center font-bold">
                    <GraduationCap size={24} />
                  </div>
                  <span className="inline-flex items-center space-x-1 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    <Calendar size={12} />
                    <span>
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#172B4D]">{edu.degree}</h3>
                <p className="text-xs sm:text-sm font-semibold text-[#3898EC] mt-0.5">{edu.fieldOfStudy}</p>
                <p className="text-xs text-[#5B6B82] mt-1 font-medium">{edu.institution}</p>

                {edu.description && (
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed pt-3 border-t border-slate-100">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#3898EC] mt-4 pt-3 border-t border-slate-50">
                <BookOpen size={13} />
                <span>Verified Academic Record</span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
