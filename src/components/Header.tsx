import React, { useState } from 'react';
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Cpu,
  Share2,
  HelpCircle,
  SlidersHorizontal,
  ChevronDown,
  Check,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { AppSettings, UserProfile } from '../types';
import { useToast } from './Toast';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeConversationTitle: string;
  settings: AppSettings;
  onChangeModel: (model: string) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  activeConversationTitle,
  settings,
  onChangeModel,
  onOpenSettings,
  onOpenHelp,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const { showToast } = useToast();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const models = [
    { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', tag: 'Fast' },
    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tag: 'Lite' },
    { id: 'gemini-4-argon', name: 'Gemini 4 Argon', tag: 'Reasoning' },
  ];

  const currentModel = models.find((m) => m.id === settings.activeModel) || models[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Session link copied to clipboard!');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFF7FA]/85 backdrop-blur-xl border-b border-[#F1DCE4]/80 px-3 sm:px-6 flex items-center justify-between shadow-[0_1px_8px_rgba(64,39,53,0.02)]">
      {/* Left side with Top Toggle Button */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
          className="p-2 rounded-xl text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 hidden lg:block" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 hidden lg:block text-[#C76D8A]" />
          )}
          <Menu className="w-5 h-5 lg:hidden" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-xs sm:text-sm text-[#402735] truncate max-w-[140px] sm:max-w-xs md:max-w-sm">
            {activeConversationTitle || 'Ranuu AI'}
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#FFE8F1] text-[#C76D8A] font-semibold text-[10px] tracking-wide uppercase">
            Active Session
          </span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Model dropdown */}
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white text-[#402735] border border-[#F1DCE4] text-xs font-semibold shadow-xs hover:border-[#C76D8A] transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-[#C76D8A]" />
            <span className="hidden md:inline">{currentModel.name}</span>
            <span className="md:hidden">{currentModel.tag}</span>
            <ChevronDown className="w-3 h-3 text-[#8A687B]" />
          </button>

          {modelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setModelDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-white border border-[#F1DCE4] shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#8A687B]">
                  Select AI Provider Model
                </div>
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onChangeModel(m.id);
                      setModelDropdownOpen(false);
                      showToast(`Switched model to ${m.name}`);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                      settings.activeModel === m.id
                        ? 'bg-[#FFE8F1] text-[#C76D8A] font-semibold'
                        : 'text-[#402735] hover:bg-[#FFF7FA]'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span>{m.name}</span>
                      <span className="text-[10px] text-[#8A687B]">{m.tag}</span>
                    </div>
                    {settings.activeModel === m.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quota status */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE8F1]/60 border border-[#F1DCE4] text-[#874C67] text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#C76D8A] animate-pulse"></span>
          <span>Quota: 85% remaining</span>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="hidden sm:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white text-[#402735] border border-[#F1DCE4] text-xs font-medium hover:bg-[#FFE8F1] transition-colors shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-[#8A687B]" />
          <span>Share</span>
        </button>

        {/* Help icon */}
        <button
          onClick={onOpenHelp}
          title="About Ranuu AI & Guide"
          className="p-1.5 rounded-xl text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Settings"
          className="p-1.5 rounded-xl text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Auth Section: Login / Sign Up OR User Profile Dropdown */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#F4B6C2] transition-all"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#F4B6C2] to-[#C76D8A] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            </button>

            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#F1DCE4] shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95 space-y-1">
                  <div className="px-3 py-2 border-b border-[#F1DCE4]/60">
                    <p className="text-xs font-bold text-[#402735] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#8A687B] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#FFE8F1] text-[10px] font-semibold text-[#874C67]">
                      {currentUser.plan}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#402735] hover:bg-[#FFF7FA] transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A687B]" />
                    <span>Settings & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#BA1A1A] hover:bg-[#FFDAD6] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#402735] hover:bg-[#FFE8F1] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F4B6C2] hover:bg-[#E8A0BF] text-[#402735] shadow-xs hover:shadow active:scale-95 transition-all"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
