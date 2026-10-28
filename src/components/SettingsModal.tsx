import React, { useState } from 'react';
import { X, Sparkles, Sliders, KeyRound, Download, Upload, Trash2, Command, ShieldCheck, Check } from 'lucide-react';
import { AppSettings, Conversation } from '../types';
import { useToast } from './Toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  conversations: Conversation[];
  onImportConversations: (imported: Conversation[]) => void;
  onClearAllHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  conversations,
  onImportConversations,
  onClearAllHistory,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'data' | 'shortcuts'>('general');
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(formData);
    showToast('Preferences saved successfully!');
    onClose();
  };

  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(conversations, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ranuu-ai-conversations-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported conversations as JSON');
    } catch (e) {
      showToast('Export failed', 'error');
    }
  };

  const handleExportMarkdown = () => {
    try {
      let mdContent = `# Ranuu AI Export\n*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;
      conversations.forEach((conv) => {
        mdContent += `## ${conv.title}\n*Category: ${conv.category || 'General'} | Updated: ${conv.updatedAt}*\n\n`;
        conv.messages.forEach((m) => {
          mdContent += `### ${m.role === 'user' ? 'You' : 'Ranuu AI'} (${m.timestamp})\n${m.content}\n\n`;
        });
        mdContent += `---\n\n`;
      });

      const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(mdContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ranuu-ai-conversations-${new Date().toISOString().split('T')[0]}.md`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported conversations as Markdown');
    } catch (e) {
      showToast('Markdown export failed', 'error');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].messages) {
          onImportConversations(parsed);
          showToast(`Successfully restored ${parsed.length} conversations!`);
          onClose();
        } else {
          showToast('Invalid JSON structure. Expecting conversation array.', 'error');
        }
      } catch (err) {
        showToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#402735]/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F1DCE4] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1DCE4] bg-[#FFF7FA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFE8F1] flex items-center justify-center text-[#C76D8A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#402735]">Settings & Preferences</h2>
              <p className="text-xs text-[#8A687B]">Personalize Ranuu AI's tone, models, and private storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#F1DCE4] px-6 bg-[#FFF7FA]/50 gap-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'general'
                ? 'border-[#C76D8A] text-[#C76D8A]'
                : 'border-transparent text-[#8A687B] hover:text-[#402735]'
            }`}
          >
            General & UI
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'ai'
                ? 'border-[#C76D8A] text-[#C76D8A]'
                : 'border-transparent text-[#8A687B] hover:text-[#402735]'
            }`}
          >
            Model & Persona
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'data'
                ? 'border-[#C76D8A] text-[#C76D8A]'
                : 'border-transparent text-[#8A687B] hover:text-[#402735]'
            }`}
          >
            Backup & Sync
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'shortcuts'
                ? 'border-[#C76D8A] text-[#C76D8A]'
                : 'border-transparent text-[#8A687B] hover:text-[#402735]'
            }`}
          >
            Shortcuts
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#402735] mb-1.5">Profile Display Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-xs text-[#402735] focus:outline-none focus:border-[#C76D8A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#402735] mb-1.5">Chat Font Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['sm', 'md', 'lg'] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, fontSize: size })}
                        className={`py-2 text-xs rounded-xl border text-center font-medium capitalize transition-all ${
                          formData.fontSize === size
                            ? 'bg-[#FFE8F1] border-[#C76D8A] text-[#C76D8A] font-semibold'
                            : 'bg-white border-[#F1DCE4] text-[#8A687B] hover:bg-[#FFF7FA]'
                        }`}
                      >
                        {size === 'sm' ? 'Compact' : size === 'md' ? 'Normal' : 'Large'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#402735] mb-1.5">Message Density</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['comfortable', 'compact'] as const).map((density) => (
                      <button
                        key={density}
                        type="button"
                        onClick={() => setFormData({ ...formData, chatDensity: density })}
                        className={`py-2 text-xs rounded-xl border text-center font-medium capitalize transition-all ${
                          formData.chatDensity === density
                            ? 'bg-[#FFE8F1] border-[#C76D8A] text-[#C76D8A] font-semibold'
                            : 'bg-white border-[#F1DCE4] text-[#8A687B] hover:bg-[#FFF7FA]'
                        }`}
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme description */}
              <div className="p-3.5 rounded-2xl bg-[#FFF7FA] border border-[#F1DCE4] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#402735]">Color Theme: Blush Radiance</span>
                  <p className="text-[11px] text-[#8A687B]">Primary #F4B6C2 · Secondary #E8A0BF · Accent #C76D8A</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#F4B6C2] border border-white shadow-xs"></span>
                  <span className="w-5 h-5 rounded-full bg-[#E8A0BF] border border-white shadow-xs"></span>
                  <span className="w-5 h-5 rounded-full bg-[#C76D8A] border border-white shadow-xs"></span>
                  <span className="w-5 h-5 rounded-full bg-[#402735] border border-white shadow-xs"></span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#402735] mb-1.5">Active AI Model</label>
                <div className="space-y-2">
                  {[
                    { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Recommended)', desc: 'Best-in-class speed and intelligence for conversations and code.' },
                    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', desc: 'Ultra-fast low latency responses for everyday queries.' },
                    { id: 'gemini-4-argon', name: 'Gemini 4 Argon', desc: 'Advanced reasoning, deep STEM, and complex multi-step analysis.' },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setFormData({ ...formData, activeModel: m.id })}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                        formData.activeModel === m.id
                          ? 'bg-[#FFF0F5] border-[#C76D8A]'
                          : 'bg-white border-[#F1DCE4] hover:bg-[#FFF7FA]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#402735]">{m.name}</div>
                        <div className="text-[11px] text-[#8A687B] mt-0.5">{m.desc}</div>
                      </div>
                      {formData.activeModel === m.id && (
                        <div className="w-4 h-4 rounded-full bg-[#C76D8A] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#402735] mb-1.5">Custom Persona & Instructions</label>
                <textarea
                  rows={3}
                  value={formData.customInstructions}
                  onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
                  placeholder="e.g. Speak with poetic warmth, prioritize botanical comparisons..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-xs text-[#402735] focus:outline-none focus:border-[#C76D8A] resize-none"
                />
                <p className="text-[11px] text-[#8A687B] mt-1">
                  Injected into every server-side prompt to tailor Ranuu AI's personality to your preferences.
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF7FA] border border-[#F1DCE4]">
                <div>
                  <div className="text-xs font-semibold text-[#402735]">Real-time Streaming</div>
                  <div className="text-[11px] text-[#8A687B]">Stream response tokens as they generate</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableStream}
                  onChange={(e) => setFormData({ ...formData, enableStream: e.target.checked })}
                  className="w-4 h-4 accent-[#C76D8A] rounded cursor-pointer"
                />
              </div>

              {/* Optional Image Generation API Keys */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#F1DCE4] space-y-3">
                <div>
                  <div className="text-xs font-semibold text-[#402735]">Image Generation API Keys (Optional)</div>
                  <div className="text-[11px] text-[#8A687B]">
                    By default, Ranuu AI uses the free FLUX.1 tier (1 image per 45s). You can enter an optional Hugging Face token or Pollen key for instant, unlimited generations.
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#402735] mb-1">Hugging Face Token (Free / Pro)</label>
                    <input
                      type="password"
                      value={formData.hfToken || ''}
                      onChange={(e) => setFormData({ ...formData, hfToken: e.target.value.trim() })}
                      placeholder="hf_..."
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-xs text-[#402735] focus:outline-none focus:border-[#C76D8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#402735] mb-1">Pollinations Pollen Key (Optional)</label>
                    <input
                      type="password"
                      value={formData.pollenKey || ''}
                      onChange={(e) => setFormData({ ...formData, pollenKey: e.target.value.trim() })}
                      placeholder="pk_..."
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-xs text-[#402735] focus:outline-none focus:border-[#C76D8A]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#FFF7FA] border border-[#F1DCE4] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#402735]">
                  <ShieldCheck className="w-4 h-4 text-[#C76D8A]" />
                  <span>Private Local Storage Notice</span>
                </div>
                <p className="text-[11px] text-[#8A687B] leading-relaxed">
                  All your conversations, custom prompts, and image generations are securely archived in your browser's private local storage. They are never sold or sent to 3rd-party trackers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white border border-[#F1DCE4] hover:bg-[#FFF7FA] text-[#402735] text-xs font-semibold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#C76D8A]" />
                  <span>Export JSON</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white border border-[#F1DCE4] hover:bg-[#FFF7FA] text-[#402735] text-xs font-semibold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#C76D8A]" />
                  <span>Export Markdown</span>
                </button>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#402735] mb-1.5">Import Conversations</label>
                <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-dashed border-[#E8A0BF] hover:bg-[#FFF7FA] cursor-pointer text-xs text-[#8A687B] font-medium transition-colors">
                  <Upload className="w-4 h-4 text-[#C76D8A]" />
                  <span>Click to choose valid exported .json file</span>
                  <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                </label>
              </div>

              <div className="pt-3 border-t border-[#F1DCE4]">
                <button
                  type="button"
                  onClick={onClearAllHistory}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#FFF0F0] hover:bg-[#FFDAD6] text-[#BA1A1A] text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Local Chat History</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <div className="text-xs text-[#8A687B] mb-2">Available keyboard shortcuts in Ranuu AI:</div>
              {[
                { key: 'Enter', action: 'Send message' },
                { key: 'Shift + Enter', action: 'Create new multiline row' },
                { key: 'Esc', action: 'Close dialogs and modals' },
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4]">
                  <span className="text-xs text-[#402735]">{s.action}</span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-white border border-[#F1DCE4] text-[11px] font-mono text-[#8A687B] shadow-xs">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#F1DCE4] bg-[#FFF7FA]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#402735] hover:bg-[#FFE8F1] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#C76D8A] hover:bg-[#81515B] text-white shadow-sm transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
