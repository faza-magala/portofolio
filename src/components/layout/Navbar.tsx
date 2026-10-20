import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { useProfile } from '../../hooks/usePortfolioData';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { useScrollSpy } from '../../hooks/useScrollSpy';

export const Navbar: React.FC = () => {
  const { data: profile } = useProfile();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  const activeSection = useScrollSpy(
    ['home', 'about', 'skills', 'experience', 'projects', 'services', 'certifications', 'testimonials', 'journey', 'contact'],
    140
  );

  const name = profile?.name || siteConfig.developer.name;
  const role = profile?.role || siteConfig.developer.role;
  const avatarInitials = profile?.avatarInitials || siteConfig.developer.avatarInitials;

  const navItems = [
    { label: 'Home', href: isHomePage ? '#home' : '/#home' },
    { label: 'About', href: isHomePage ? '#about' : '/#about' },
    { label: 'Skills', href: isHomePage ? '#skills' : '/#skills' },
    { label: 'Experience', href: isHomePage ? '#experience' : '/#experience' },
    { label: 'Projects', href: isHomePage ? '#projects' : '/#projects' },
    { label: 'Services', href: isHomePage ? '#services' : '/#services' },
    { label: 'Blog', href: '/blog', isRoute: true },
    { label: 'Contact', href: isHomePage ? '#contact' : '/#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <Link
              to="/"
              className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC] rounded-lg p-1"
              aria-label={`${name} - Home`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3898EC] to-[#60B5FF] font-mono text-sm font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                {avatarInitials}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-[#172B4D] group-hover:text-[#3898EC] transition-colors">
                  {name}
                </span>
                <span className="text-[11px] font-medium text-[#5B6B82]">{role}</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = item.isRoute
                  ? location.pathname.startsWith(item.href)
                  : isHomePage && activeSection === item.href.replace('/#', '').replace('#', '');

                if (item.isRoute) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#EAF6FF] text-[#3898EC] font-semibold'
                          : 'text-[#5B6B82] hover:bg-[#EAF6FF]/60 hover:text-[#172B4D]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EAF6FF] text-[#3898EC] font-semibold'
                        : 'text-[#5B6B82] hover:bg-[#EAF6FF]/60 hover:text-[#172B4D]'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <Link
                to="/admin"
                className="p-2 rounded-xl text-slate-400 hover:text-[#3898EC] hover:bg-[#EAF6FF]/60 transition"
                title="Admin CMS Portal"
                aria-label="Admin CMS Portal"
              >
                <Shield size={18} />
              </Link>

              <Button
                variant="primary"
                size="sm"
                href={isHomePage ? '#contact' : '/#contact'}
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCEAF7] bg-white text-[#172B4D] md:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                if (item.isRoute) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-[#172B4D] hover:bg-[#F8FBFF]"
                    >
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-[#172B4D] hover:bg-[#F8FBFF]"
                  >
                    <span>{item.label}</span>
                  </a>
                );
              })}

              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-[#3898EC] bg-[#EAF6FF]"
              >
                <div className="flex items-center space-x-2">
                  <Shield size={16} />
                  <span>Admin CMS</span>
                </div>
              </Link>
            </nav>

            <div className="mt-8 border-t border-[#DCEAF7] pt-6">
              <Button
                variant="primary"
                size="md"
                href={isHomePage ? '#contact' : '/#contact'}
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
