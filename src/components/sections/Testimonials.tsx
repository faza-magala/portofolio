import React from 'react';
import { MessageSquareQuote, Star } from 'lucide-react';
import { useTestimonials } from '../../hooks/usePortfolioData';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const Testimonials: React.FC = () => {
  const { data: testimonials, isLoading } = useTestimonials();

  if (isLoading || !testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" aria-label="Client & Peer Recommendations" className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="ENDORSEMENTS"
          title="What teammates and clients say."
          description="Honest recommendations reflecting my work ethic, collaboration style, and commitment to delivering quality code."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="p-6 bg-white border border-[#DCEAF7] shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center">
                    <MessageSquareQuote size={20} />
                  </div>
                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} className="fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{t.testimonialText}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-[#DCEAF7]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center font-bold text-xs">
                    {t.clientName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-[#172B4D] leading-tight">{t.clientName}</h4>
                  <p className="text-xs text-[#5B6B82] mt-0.5">{t.positionOrCompany}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
