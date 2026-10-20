import React from 'react';
import { Award, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useCertifications } from '../../hooks/usePortfolioData';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const Certifications: React.FC = () => {
  const { data: certs, isLoading } = useCertifications();

  if (isLoading || !certs || certs.length === 0) {
    return null;
  }

  return (
    <section id="certifications" aria-label="Certifications and Achievements" className="py-20 bg-[#F8FBFF]">
      <Container>
        <SectionHeading
          eyebrow="CREDENTIALS"
          title="Verified certifications and achievements."
          description="Accreditations and specialized learning tracks verifying modern full-stack development competencies."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <Card
              key={cert.id}
              className="p-6 bg-white border border-[#DCEAF7] shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center font-bold">
                    <Award size={24} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {cert.issueDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#172B4D] leading-snug">{cert.title}</h3>
                <p className="text-xs sm:text-sm font-semibold text-[#3898EC] mt-1">{cert.issuer}</p>

                {cert.certificateImageUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-[#DCEAF7] bg-slate-50">
                    <img
                      src={cert.certificateImageUrl}
                      alt={cert.title}
                      className="w-full h-36 object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 size={13} />
                  <span>Verified Issuer</span>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-[#3898EC] hover:underline"
                  >
                    <span>View Credential</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
