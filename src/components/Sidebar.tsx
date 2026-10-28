import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  SearchCode,
  Image as ImageIcon,
  BookOpen,
  Pin,
  Edit2,
  Trash2,
  Settings,
  PanelLeftClose,
  X,
  Check,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { Conversation, TabMode, AppSettings, UserProfile } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onTogglePinConversation: (id: string) => void;
  activeTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenSettings: () => void;
  settings: AppSettings;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  onTogglePinConversation,
  activeTab,
  onSelectTab,
  isOpen,
  onToggleOpen,
  onOpenSettings,
  settings,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  // Group by time
  const groups = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const previous7Days: Conversation[] = [];
    const older: Conversation[] = [];

    // Prioritize pinned
    const sorted = [...filteredConversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    sorted.forEach((c) => {
      const time = new Date(c.updatedAt).getTime();
      const diff = now - time;
      if (diff < oneDay) {
        today.push(c);
      } else if (diff < 2 * oneDay) {
        yesterday.push(c);
      } else if (diff < 7 * oneDay) {
        previous7Days.push(c);
      } else {
        older.push(c);
      }
    });

    return { today, yesterday, previous7Days, older };
  }, [filteredConversations]);

  const handleStartRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 bg-[#402735]/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Drawer (Works on Desktop & Mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#FFF0F5]/90 backdrop-blur-xl border-r border-[#F1DCE4] z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out shadow-[0_1px_12px_rgba(64,39,53,0.04)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header with Close/Dock Button */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#F1DCE4]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F4B6C2] to-[#E8A0BF] flex items-center justify-center text-[#402735] shadow-xs">
                <Sparkles className="w-4 h-4 text-[#81515B]" />
              </div>
              <span className="font-semibold text-base text-[#402735] tracking-tight">Ranuu AI</span>
            </div>
            {/* Top Close Button (Desktop & Mobile) */}
            <button
              onClick={onToggleOpen}
              title="Close sidebar (Click to collapse)"
              className="p-1.5 rounded-lg text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-4 pt-3.5 pb-2">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#F4B6C2] hover:bg-[#E8A0BF] text-[#402735] font-semibold text-xs shadow-sm hover:shadow active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="px-4 py-1.5">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#8A687B] absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white text-xs text-[#402735] placeholder:text-[#8A687B] border border-[#F1DCE4] focus:outline-none focus:border-[#C76D8A]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#8A687B] hover:text-[#402735] p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="px-4 py-2">
            <nav className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-white/80 border border-[#F1DCE4]/60">
              <button
                onClick={() => {
                  onSelectTab('chat');
                  if (window.innerWidth < 1024) onToggleOpen();
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-[#FFE8F1] text-[#402735] shadow-xs'
                    : 'text-[#8A687B] hover:text-[#402735] hover:bg-[#FFF7FA]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C76D8A]" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('research');
                  if (window.innerWidth < 1024) onToggleOpen();
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'research'
                    ? 'bg-[#FFE8F1] text-[#402735] shadow-xs'
                    : 'text-[#8A687B] hover:text-[#402735] hover:bg-[#FFF7FA]'
                }`}
              >
                <SearchCode className="w-3.5 h-3.5 text-[#874C67]" />
                <span>Research</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('studio');
                  if (window.innerWidth < 1024) onToggleOpen();
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'studio'
                    ? 'bg-[#FFE8F1] text-[#402735] shadow-xs'
                    : 'text-[#8A687B] hover:text-[#402735] hover:bg-[#FFF7FA]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#94445F]" />
                <span>Studio</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('prompts');
                  if (window.innerWidth < 1024) onToggleOpen();
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'prompts'
                    ? 'bg-[#FFE8F1] text-[#402735] shadow-xs'
                    : 'text-[#8A687B] hover:text-[#402735] hover:bg-[#FFF7FA]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#81515B]" />
                <span>Prompts</span>
              </button>
            </nav>
          </div>

          {/* Grouped Conversation History List */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
            {Object.entries(groups).map(([key, list]) => {
              if (list.length === 0) return null;
              const titleMap: Record<string, string> = {
                today: 'Today',
                yesterday: 'Yesterday',
                previous7Days: 'Previous 7 Days',
                older: 'Older',
              };

              return (
                <div key={key} className="space-y-1">
                  <div className="px-2 text-[10px] font-semibold text-[#8A687B] uppercase tracking-wider">
                    {titleMap[key]}
                  </div>
                  <div className="space-y-1">
                    {list.map((conv) => {
                      const isActive = activeConversationId === conv.id;
                      const isEditing = editingId === conv.id;

                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            onSelectConversation(conv.id);
                            onSelectTab('chat');
                            if (window.innerWidth < 1024) onToggleOpen();
                          }}
                          className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                            isActive
                              ? 'bg-white text-[#402735] font-semibold shadow-xs border border-[#F1DCE4]'
                              : 'text-[#514346] hover:bg-white/60 hover:text-[#402735]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {conv.isPinned && (
                              <Pin className="w-3 h-3 text-[#C76D8A] fill-[#C76D8A] flex-shrink-0" />
                            )}
                            {isEditing ? (
                              <form
                                onSubmit={(e) => handleSaveRename(conv.id, e)}
                                className="flex items-center gap-1 flex-1 min-w-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  className="w-full bg-[#FFF7FA] border border-[#C76D8A] rounded px-1.5 py-0.5 text-xs text-[#402735] focus:outline-none"
                                  autoFocus
                                />
                                <button type="submit" className="text-[#C76D8A] hover:text-[#81515B]">
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            ) : (
                              <span className="truncate">{conv.title}</span>
                            )}
                          </div>

                          {!isEditing && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTogglePinConversation(conv.id);
                                }}
                                title={conv.isPinned ? 'Unpin' : 'Pin to top'}
                                className="p-1 rounded text-[#8A687B] hover:text-[#C76D8A] hover:bg-[#FFE8F1]"
                              >
                                <Pin className={`w-3 h-3 ${conv.isPinned ? 'fill-[#C76D8A]' : ''}`} />
                              </button>
                              <button
                                onClick={(e) => handleStartRename(conv, e)}
                                title="Rename conversation"
                                className="p-1 rounded text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1]"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteConversation(conv.id);
                                }}
                                title="Delete conversation"
                                className="p-1 rounded text-[#8A687B] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-xs text-[#8A687B] space-y-1">
                <p>No conversations found</p>
                <p className="text-[11px]">Click "New Chat" to begin</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card Footer with Auth Options */}
        <div className="p-3.5 bg-white/70 backdrop-blur-md border-t border-[#F1DCE4]/60">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div
                onClick={onOpenSettings}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F4B6C2] to-[#C76D8A] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#402735] leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#874C67] font-medium">{currentUser.plan} · Synced</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenSettings}
                  title="Open Settings"
                  className="p-1.5 rounded-xl text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-xl text-[#8A687B] hover:text-[#BA1A1A] hover:bg-[#FFDAD6] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-gradient-to-r from-[#F4B6C2] to-[#FEB4D4] hover:opacity-95 text-[#402735] text-xs font-semibold transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#81515B]" />
                <span>Sign In / Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
