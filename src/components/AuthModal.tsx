import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useToast } from './Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !name.trim())) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        id: 'user-' + Date.now(),
        name: mode === 'signup' ? name.trim() : (email.split('@')[0] || 'Elena Vance'),
        email: email.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        plan: 'Free Tier',
      };
      onSuccess(user);
      showToast(mode === 'login' ? `Welcome back, ${user.name}!` : `Account created! Welcome to Ranuu AI.`);
      onClose();
    }, 400);
  };

  const handleQuickDemo = () => {
    const demoUser: UserProfile = {
      id: 'user-elena-vance',
      name: 'Elena Vance',
      email: 'akqhs2511@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      plan: 'Free Tier',
    };
    onSuccess(demoUser);
    showToast('Signed in as Elena Vance');
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        id: 'user-' + Date.now(),
        name: 'Elena Vance',
        email: 'akqhs2511@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        plan: 'Free Tier',
      };
      onSuccess(user);
      showToast(`Signed in with ${provider}`);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#402735]/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#F1DCE4] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#FFF0F5] to-white border-b border-[#F1DCE4]/60">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#F4B6C2] to-[#E8A0BF] flex items-center justify-center text-[#402735] shadow-xs">
              <Sparkles className="w-5 h-5 text-[#81515B]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#402735]">
                {mode === 'login' ? 'Welcome Back to Ranuu AI' : 'Create Your Ranuu Account'}
              </h2>
              <p className="text-xs text-[#8A687B] mt-0.5">
                {mode === 'login'
                  ? 'Sign in to access your saved conversations & studio frames'
                  : 'Join thousands of creators using intelligent blush companion AI'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex mt-4 p-1 bg-white rounded-2xl border border-[#F1DCE4]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-[#FFE8F1] text-[#C76D8A] shadow-xs'
                  : 'text-[#8A687B] hover:text-[#402735]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-[#FFE8F1] text-[#C76D8A] shadow-xs'
                  : 'text-[#8A687B] hover:text-[#402735]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#402735]">Your Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#8A687B] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Elena Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-xs text-[#402735] placeholder:text-[#8A687B] focus:outline-none focus:border-[#C76D8A]"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#402735]">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#8A687B] absolute left-3 pointer-events-none" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-xs text-[#402735] placeholder:text-[#8A687B] focus:outline-none focus:border-[#C76D8A]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#402735]">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to email')}
                  className="text-[11px] text-[#C76D8A] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#8A687B] absolute left-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-xs text-[#402735] placeholder:text-[#8A687B] focus:outline-none focus:border-[#C76D8A]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 text-[#8A687B] hover:text-[#402735]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#514346]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#C76D8A] rounded"
              />
              <span>Remember me</span>
            </label>
            <span className="text-[11px] text-[#8A687B]">Encrypted & Private</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#F4B6C2] via-[#E8A0BF] to-[#FEB4D4] text-[#402735] font-semibold text-xs shadow-sm hover:shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Ranuu' : 'Create Free Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Social Auth Dividers */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#F1DCE4]"></div>
            <span className="flex-shrink mx-3 text-[11px] text-[#8A687B] uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-[#F1DCE4]"></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#F1DCE4] bg-white hover:bg-[#FFF7FA] text-xs font-semibold text-[#402735] transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.9 6.4C.7 8.8 0 10.4 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#F1DCE4] bg-white hover:bg-[#FFF7FA] text-xs font-semibold text-[#402735] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.65-.8 1.09-1.92.97-3.04-.95.04-2.1.64-2.77 1.43-.59.68-1.11 1.79-.97 2.87 1.06.08 2.14-.54 2.77-1.26z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Quick Demo Login */}
          <div className="pt-2 border-t border-[#F1DCE4]/60 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs text-[#C76D8A] hover:text-[#81515B] font-semibold transition-colors"
            >
              ⚡ Quick Demo Login (Elena Vance)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
