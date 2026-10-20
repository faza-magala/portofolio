import React from 'react';
import { Layers, Code2, Globe, Cpu, CheckCircle } from 'lucide-react';
import { useServices } from '../../hooks/usePortfolioData';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const Services: React.FC = () => {
  const { data: services, isLoading } = useServices();

  if (isLoading || !services || services.length === 0) {
    return null;
  }

  const getServiceIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'code':
      case 'code2':
        return <Code2 size={24} />;
      case 'globe':
      case 'web':
        return <Globe size={24} />;
      case 'cpu':
      case 'api':
        return <Cpu size={24} />;
      default:
        return <Layers size={24} />;
    }
  };

  return (
    <section id="services" aria-label="Services and Solutions" className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="SERVICES & SOLUTIONS"
          title="What I can build for you."
          description="High-quality web development, robust API backends, and responsive user experiences tailored to your goals."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <Card
              key={svc.id}
              className="p-6 bg-white border border-[#DCEAF7] shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center font-bold mb-4">
                  {getServiceIcon(svc.iconName)}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#172B4D] mb-2">{svc.title}</h3>
                <p className="text-xs sm:text-sm text-[#5B6B82] leading-relaxed">{svc.description}</p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#3898EC]">
                  {svc.pricingText || 'Available for freelance & contract'}
                </span>
                <CheckCircle size={16} className="text-emerald-500" />
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
