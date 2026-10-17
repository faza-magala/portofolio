import React from 'react';
import { ArrowUp } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Container } from '../ui/Container';
import { SocialLinks } from '../ui/SocialLinks';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#DCEAF7] bg-white py-12">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand info */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3898EC] font-mono text-xs font-bold text-white">
                {siteConfig.developer.avatarInitials}
              </span>
              <span className="text-sm font-bold text-[#172B4D]">
                {siteConfig.developer.name}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5B6B82]">
              {siteConfig.developer.role} • {siteConfig.developer.location}
            </p>
          </div>

          {/* Social Links */}
          <SocialLinks />

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-1.5 text-xs font-medium text-[#5B6B82] hover:text-[#3898EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC] rounded-lg p-1.5"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 border-t border-[#DCEAF7]/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5B6B82] gap-3">
          <p>
            © {currentYear} {siteConfig.developer.name}. All rights reserved.
          </p>
          <p className="text-[11px] text-[#5B6B82]/80">
            Crafted with React, TypeScript & Tailwind CSS • Deployed with Vercel
          </p>
        </div>
      </Container>
    </footer>
  );
};
