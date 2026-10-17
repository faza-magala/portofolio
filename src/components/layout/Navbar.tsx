import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeSection = useScrollSpy(
    ['home', 'about', 'skills', 'projects', 'journey', 'contact'],
    140
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#3898EC] focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'border-b border-[#DCEAF7]/80 bg-white/90 backdrop-blur-md shadow-subtle'
            : 'border-b border-transparent bg-[#F8FBFF]/80 backdrop-blur-sm'
        }`}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Developer Brand Logo */}
            <a
              href="#home"
              className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC] rounded-lg p-1"
              aria-label={`${siteConfig.developer.name} - Home`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3898EC] to-[#60B5FF] font-mono text-sm font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                {siteConfig.developer.avatarInitials}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-[#172B4D] group-hover:text-[#3898EC] transition-colors">
                  {siteConfig.developer.name}
                </span>
                <span className="text-[11px] font-medium text-[#5B6B82]">
                  {siteConfig.developer.role}
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const sectionId = item.href.replace('#', '');
                const isActive = activeSection === sectionId;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EAF6FF] text-[#3898EC] font-semibold'
                        : 'text-[#5B6B82] hover:bg-[#EAF6FF]/60 hover:text-[#172B4D]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                href="#contact"
                icon={<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
                iconPosition="right"
              >
                Let&apos;s Talk
              </Button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCEAF7] bg-white text-[#172B4D] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-[#172B4D]" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5 text-[#172B4D]" aria-hidden="true" />
              )}
            </button>
          </div>
        </Container>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-white px-6 py-6 md:hidden overflow-y-auto border-t border-[#DCEAF7]"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {navItems.map((item) => {
                const sectionId = item.href.replace('#', '');
                const isActive = activeSection === sectionId;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EAF6FF] text-[#3898EC] font-semibold'
                        : 'text-[#172B4D] hover:bg-[#F8FBFF]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-[#5B6B82]">{item.href}</span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-8 border-t border-[#DCEAF7] pt-6">
              <Button
                variant="primary"
                size="md"
                href="#contact"
                className="w-full justify-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Let&apos;s Talk
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
