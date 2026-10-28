import React from 'react';
import { X, Sparkles, Shield, Cpu, Image, Search, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#402735]/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-[#F1DCE4] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1DCE4] bg-[#FFF7FA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFE8F1] flex items-center justify-center text-[#C76D8A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#402735]">About Ranuu AI & Guide</h2>
              <p className="text-xs text-[#8A687B]">Your feminine, intelligent personal AI companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#514346] leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#402735] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C76D8A]" />
              <span>Design System: Blush Radiance</span>
            </h3>
            <p>
              Ranuu AI is crafted around an intentional blush-pink aesthetic: Primary Blush Pink (<code>#F4B6C2</code>), Soft Rose (<code>#E8A0BF</code>), Dusty Rose Accent (<code>#C76D8A</code>), and Deep Plum Typography (<code>#402735</code>) for warm, serene contrast without harsh blacks.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#402735] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#C76D8A]" />
              <span>Free-Tier AI Integration</span>
            </h3>
            <p>
              Calls are handled securely through server-side proxy routes to safeguard API keys. Powered by Google GenAI models:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Gemini 3.8 Flash:</strong> General knowledge, creative copy, strategy, and rapid streaming.</li>
              <li><strong>Gemini 3.1 Flash Lite:</strong> Ultra-low latency responses.</li>
              <li><strong>Gemini 4 Argon:</strong> Complex STEM and deep reasoning capabilities.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#402735] flex items-center gap-2">
              <Search className="w-4 h-4 text-[#C76D8A]" />
              <span>Real-Time Web Search & Grounding</span>
            </h3>
            <p>
              When Web Search is enabled or in <strong>Research Mode</strong>, queries invoke real Google Search grounding tools to provide factual citations, verified URLs, and current market insights rather than hallucinations.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#402735] flex items-center gap-2">
              <Image className="w-4 h-4 text-[#C76D8A]" />
              <span>Image Studio</span>
            </h3>
            <p>
              Craft aesthetic renders across multiple aspect ratios (1:1, 16:9, 3:4, 4:3) and styles (Botanical Watercolor, Editorial Studio, 3D Render). Save frames to your local gallery, expand in full-screen lightbox, and download directly.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#402735] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C76D8A]" />
              <span>Privacy & Local Storage</span>
            </h3>
            <p>
              Your conversations, custom prompts, and image gallery reside in your browser's private localStorage. You can export complete backups in JSON or Markdown format at any time via Settings.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF7FA] border-t border-[#F1DCE4] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#C76D8A] hover:bg-[#81515B] text-white text-xs font-semibold"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
