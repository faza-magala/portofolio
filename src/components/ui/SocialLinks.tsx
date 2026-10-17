import React from 'react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getExternalLinkProps, isSafeUrl } from '../../lib/validators';
import { siteConfig } from '../../config/site';

interface SocialLinksProps {
  className?: string;
  variant?: 'icons-only' | 'buttons' | 'minimal';
  showLabels?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className,
  variant = 'icons-only',
  showLabels = false,
}) => {
  const links = [
    {
      id: 'github',
      name: 'GitHub',
      url: siteConfig.contact.githubUrl,
      icon: <Github className="h-4 w-4" aria-hidden="true" />,
      ariaLabel: `Visit ${siteConfig.developer.name}'s GitHub profile`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: siteConfig.contact.linkedinUrl,
      icon: <Linkedin className="h-4 w-4" aria-hidden="true" />,
      ariaLabel: `Visit ${siteConfig.developer.name}'s LinkedIn profile`,
    },
    {
      id: 'email',
      name: 'Email',
      url: `mailto:${siteConfig.contact.email}`,
      icon: <Mail className="h-4 w-4" aria-hidden="true" />,
      ariaLabel: `Send email to ${siteConfig.developer.name}`,
    },
  ];

  if (variant === 'buttons') {
    return (
      <div className={cn('flex flex-wrap gap-2.5', className)}>
        {links.map((link) => {
          if (!isSafeUrl(link.url)) return null;
          const linkProps = getExternalLinkProps(link.url);

          return (
            <a
              key={link.id}
              href={linkProps.href}
              target={linkProps.target}
              rel={linkProps.rel}
              aria-label={link.ariaLabel}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DCEAF7] bg-white px-3.5 py-2 text-xs font-medium text-[#172B4D] shadow-subtle transition-all duration-200 hover:border-[#3898EC] hover:bg-[#F8FBFF] hover:text-[#3898EC]"
            >
              {link.icon}
              <span>{link.name}</span>
              <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {links.map((link) => {
        if (!isSafeUrl(link.url)) return null;
        const linkProps = getExternalLinkProps(link.url);

        return (
          <a
            key={link.id}
            href={linkProps.href}
            target={linkProps.target}
            rel={linkProps.rel}
            aria-label={link.ariaLabel}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCEAF7] bg-white text-[#5B6B82] shadow-subtle transition-all duration-200 hover:border-[#3898EC] hover:bg-[#EAF6FF] hover:text-[#3898EC]"
          >
            {link.icon}
            {showLabels && <span className="sr-only">{link.name}</span>}
          </a>
        );
      })}
    </div>
  );
};
