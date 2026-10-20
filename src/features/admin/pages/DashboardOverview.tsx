import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminDashboard, useAdminMessages } from '../../../hooks/useAdminData';
import {
  FolderGit2,
  BookOpen,
  Code2,
  Mail,
  ArrowUpRight,
  PlusCircle,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { data: stats, isLoading } = useAdminDashboard();
  const { markAsRead } = useAdminMessages();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white rounded-2xl border border-[#DCEAF7]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-[#DCEAF7]" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Projects',
      value: stats?.projects?.total ?? 0,
      subtext: `${stats?.projects?.published ?? 0} Published • ${stats?.projects?.draft ?? 0} Draft`,
      icon: FolderGit2,
      href: '/admin/projects',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Blog Articles',
      value: stats?.blogPosts?.total ?? 0,
      subtext: `${stats?.blogPosts?.published ?? 0} Published • ${stats?.blogPosts?.draft ?? 0} Draft`,
      icon: BookOpen,
      href: '/admin/blog',
      color: 'from-sky-400 to-blue-600',
    },
    {
      title: 'Skills Registered',
      value: stats?.skills?.total ?? 0,
      subtext: 'Frontend, Backend, Databases, Tools',
      icon: Code2,
      href: '/admin/skills',
      color: 'from-teal-400 to-emerald-600',
    },
    {
      title: 'Inquiries & Messages',
      value: stats?.messages?.total ?? 0,
      subtext: `${stats?.messages?.unread ?? 0} Unread inquiry`,
      icon: Mail,
      href: '/admin/messages',
      color: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#172B4D] via-[#203a66] to-[#172B4D] text-white p-6 md:p-8 rounded-3xl shadow-lg shadow-[#172B4D]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm mb-3">
            <Sparkles size={13} className="text-[#60B5FF]" />
            <span>Portfolio CMS Control Center</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Welcome to your Portfolio CMS</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
            Manage your personal profile, showcase featured projects, publish engineering articles, and monitor client inquiries in real time.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/admin/projects"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/30 transition"
          >
            <PlusCircle size={15} />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/blog"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition"
          >
            <PlusCircle size={15} />
            <span>Write Article</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.href}
              className="group bg-white p-6 rounded-2xl border border-[#DCEAF7] shadow-sm hover:shadow-md hover:border-[#3898EC]/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md`}
                >
                  <Icon size={20} />
                </div>
                <span className="p-1 rounded-lg text-slate-400 group-hover:text-[#3898EC] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-[#5B6B82]">{card.title}</p>
                <p className="text-2xl font-bold text-[#172B4D] tracking-tight mt-0.5">{card.value}</p>
                <p className="text-[11px] text-[#7A889B] mt-1.5">{card.subtext}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Messages */}
      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#DCEAF7] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail size={18} className="text-[#3898EC]" />
            <h2 className="text-sm font-bold text-[#172B4D]">Recent Contact Inquiries</h2>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-semibold text-[#3898EC] hover:text-[#2483D6] flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-[#DCEAF7]/60">
          {(!stats?.messages?.recent || stats.messages.recent.length === 0) ? (
            <div className="p-8 text-center text-xs text-[#7A889B]">
              <Mail size={24} className="mx-auto text-slate-300 mb-2" />
              No contact messages received yet.
            </div>
          ) : (
            stats.messages.recent.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 md:px-6 hover:bg-[#F8FBFF] transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  !msg.isRead ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-[#172B4D]">{msg.name}</span>
                    <span className="text-[11px] text-[#5B6B82]">({msg.email})</span>
                    {!msg.isRead && (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#172B4D] line-clamp-1">{msg.subject}</p>
                  <p className="text-xs text-[#5B6B82] line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 text-xs text-[#7A889B]">
                  <span className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </span>
                  {!msg.isRead && (
                    <button
                      onClick={() => markAsRead({ id: msg.id, isRead: true })}
                      className="text-[#3898EC] hover:underline flex items-center space-x-1 text-xs"
                      title="Mark as read"
                    >
                      <CheckCircle size={13} />
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
