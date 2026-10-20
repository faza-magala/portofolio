import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Shield } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { useProfile, useSiteSettings } from '../../hooks/usePortfolioData';
import { Container } from '../ui/Container';
import { SocialLinks } from '../ui/SocialLinks';

export const Footer: React.FC = () => {
  const { data: profile } = useProfile();
  const { data: settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const name = profile?.name || siteConfig.developer.name;
  const role = profile?.role || siteConfig.developer.role;
  const location = profile?.location || siteConfig.developer.location;
  const avatarInitials = profile?.avatarInitials || siteConfig.developer.avatarInitials;
  const footerText = settings?.footerText || siteConfig.meta.description;

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
                {avatarInitials}
              </span>
              <span className="text-sm font-bold text-[#172B4D]">{name}</span>
            </div>
            <p className="mt-1 text-xs text-[#5B6B82]">
              {role} • {location}
            </p>
          </div>

          {/* Social Links */}
          <SocialLinks />

          {/* Back to top & Admin Link */}
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-[#3898EC] transition"
              title="Admin CMS"
            >
              <Shield size={13} />
              <span>CMS</span>
            </Link>

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
        </div>

        <div className="mt-8 border-t border-[#DCEAF7]/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5B6B82] gap-3">
          <p>
            © {currentYear} {name}. All rights reserved.
          </p>
          <p className="text-[11px] text-[#5B6B82]/80">
            {footerText}
          </p>
        </div>
      </Container>
    </footer>
  );
};
