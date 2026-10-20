import React from 'react';
import { BookOpen, CheckCircle, Clock, Target } from 'lucide-react';
import { learningJourneyData } from '../../data/learning';
import { useLearningJourney } from '../../hooks/usePortfolioData';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const LearningJourney: React.FC = () => {
  const { data: remoteLearning } = useLearningJourney();

  const activeLearning = remoteLearning && remoteLearning.length > 0 ? remoteLearning : learningJourneyData;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Milestone':
        return <CheckCircle className="h-4 w-4 text-emerald-600" aria-hidden="true" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-[#3898EC]" aria-hidden="true" />;
      case 'Planned':
      default:
        return <Target className="h-4 w-4 text-[#5B6B82]" aria-hidden="true" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Milestone':
        return 'success' as const;
      case 'In Progress':
        return 'primary' as const;
      case 'Planned':
      default:
        return 'subtle' as const;
    }
  };

  return (
    <section id="journey" aria-label="Learning Journey" className="py-20 bg-[#F8FBFF]">
      <Container>
        <SectionHeading
          eyebrow="GROWTH & ROADMAP"
          title="Current learning milestones & technical focus."
          description="How I invest in deliberate practice, modern architecture, and engineering principles day by day."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeLearning.map((item) => (
            <Card
              key={item.id}
              hoverable
              className="flex flex-col justify-between p-6 bg-white border-[#DCEAF7]"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <h3 className="font-semibold text-sm sm:text-base text-[#172B4D]">
                      {item.title}
                    </h3>
                  </div>
                  <Badge variant={getStatusBadgeVariant(item.status)} size="sm">
                    {item.status}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-[#5B6B82] leading-relaxed">
                  {item.description}
                </p>

                {/* Topics list */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md bg-[#EAF6FF] px-2.5 py-1 text-xs font-mono text-[#172B4D] border border-[#DCEAF7]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {item.resourcesOrGoals && (
                <div className="mt-5 pt-3.5 border-t border-[#DCEAF7]/80 flex items-start gap-2 text-xs text-[#5B6B82]">
                  <BookOpen className="h-3.5 w-3.5 text-[#3898EC] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-[#172B4D]">Current Activity:</strong>{' '}
                    {item.resourcesOrGoals}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
