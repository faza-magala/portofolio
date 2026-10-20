import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdminDashboard } from '../../hooks/useAdminData';
import {
  LayoutDashboard,
  User,
  Settings,
  FolderGit2,
  Code2,
  Briefcase,
  GraduationCap,
  Compass,
  BookOpen,
  Layers,
  Award,
  MessageSquareQuote,
  Mail,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export const AdminLayout: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const { data: stats } = useAdminDashboard();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadMessagesCount = stats?.messages?.unread || 0;

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Profile & Bio', href: '/admin/profile', icon: User },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    { label: 'Projects', href: '/admin/projects', icon: FolderGit2, badge: stats?.projects?.total },
    { label: 'Skills', href: '/admin/skills', icon: Code2, badge: stats?.skills?.total },
    { label: 'Experiences', href: '/admin/experiences', icon: Briefcase },
    { label: 'Education', href: '/admin/education', icon: GraduationCap },
    { label: 'Learning Journey', href: '/admin/learning', icon: Compass },
    { label: 'Blog Posts', href: '/admin/blog', icon: BookOpen, badge: stats?.blogPosts?.total },
    { label: 'Services', href: '/admin/services', icon: Layers },
    { label: 'Certifications', href: '/admin/certifications', icon: Award },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Messages', href: '/admin/messages', icon: Mail, badge: unreadMessagesCount },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch {
      // ignore
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#172B4D] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-[#DCEAF7] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#3898EC] text-white flex items-center justify-center font-bold text-sm shadow">
            CMS
          </div>
          <span className="font-semibold text-sm tracking-tight text-[#172B4D]">Portfolio Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#DCEAF7] flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-[#DCEAF7] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3898EC] to-[#2483D6] text-white flex items-center justify-center font-bold shadow-md shadow-[#3898EC]/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="font-bold text-base text-[#172B4D] leading-tight">Admin CMS</h1>
              <p className="text-xs text-[#5B6B82]">Portfolio Manager</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info Card */}
        <div className="px-4 py-3 mx-3 my-3 bg-[#F8FBFF] rounded-xl border border-[#DCEAF7]/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#EBF5FF] text-[#3898EC] font-bold flex items-center justify-center text-sm border border-[#3898EC]/20">
            {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#172B4D] truncate">{user?.username || 'Administrator'}</p>
            <p className="text-[11px] text-[#5B6B82] truncate">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#3898EC] text-white shadow-sm shadow-[#3898EC]/30 font-semibold'
                    : 'text-[#5B6B82] hover:bg-[#F0F7FF] hover:text-[#3898EC]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={16} className={active ? 'text-white' : 'text-[#7A889B]'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      active ? 'bg-white text-[#3898EC]' : 'bg-[#EBF5FF] text-[#3898EC]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#DCEAF7] space-y-1.5">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-[#5B6B82] hover:bg-slate-100 transition"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink size={15} />
              <span>View Public Site</span>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut size={15} />
            <span>{isLoggingOut ? 'Logging out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
