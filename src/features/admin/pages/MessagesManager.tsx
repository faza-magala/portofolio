import React, { useState } from 'react';
import { useAdminMessages, type ContactMessage } from '../../../hooks/useAdminData';
import { Mail, Trash2, Clock, Reply, X, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

export const MessagesManager: React.FC = () => {
  const { messages, isLoading, markAsRead, deleteMessage } = useAdminMessages();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      await markAsRead({ id: msg.id, isRead: true });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      setDeleteConfirmId(null);
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Contact Inquiries Inbox</h1>
          <p className="text-xs text-[#5B6B82] mt-0.5">
            Incoming inquiries from recruiters, collaborators, and clients sent through your contact form.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-[#DCEAF7]">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search inquiries by sender, email, or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs text-[#172B4D] placeholder-slate-400 bg-transparent focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#DCEAF7] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <Loader2 size={18} className="animate-spin text-[#3898EC]" />
            <span>Loading inbox...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <Mail size={28} className="mx-auto text-slate-300 mb-2" />
            No inquiries matching your search.
          </div>
        ) : (
          <div className="divide-y divide-[#DCEAF7]">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 md:p-6 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !msg.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-[#F8FBFF]'
                }`}
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-[#172B4D]">{msg.name}</span>
                    <span className="text-[11px] text-[#5B6B82]">&lt;{msg.email}&gt;</span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3898EC] text-white">
                        Unread
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-xs text-[#172B4D]">{msg.subject}</h3>
                  <p className="text-xs text-[#5B6B82] line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center space-x-4 shrink-0 text-xs text-slate-400">
                  <span className="flex items-center space-x-1 text-[11px]">
                    <Clock size={12} />
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(msg.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete message"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#DCEAF7] space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#DCEAF7]">
              <div>
                <h2 className="text-base font-bold text-[#172B4D]">{selectedMessage.subject}</h2>
                <p className="text-xs text-[#5B6B82] mt-0.5">
                  From: <span className="font-semibold text-[#172B4D]">{selectedMessage.name}</span> (
                  <a href={`mailto:${selectedMessage.email}`} className="text-[#3898EC] hover:underline">
                    {selectedMessage.email}
                  </a>
                  )
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-xl border border-[#DCEAF7] text-xs text-[#172B4D] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {selectedMessage.message}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#DCEAF7]">
              {deleteConfirmId === selectedMessage.id ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-rose-600 font-semibold">Delete message?</span>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-2 py-1 text-slate-600 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(selectedMessage.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center space-x-1"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              )}

              <div className="flex items-center space-x-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="px-4 py-2 bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold rounded-xl shadow flex items-center space-x-1.5 transition"
                >
                  <Reply size={14} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
