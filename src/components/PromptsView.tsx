import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Copy,
  Edit2,
  Trash2,
  ArrowRight,
  Sparkles,
  Search,
  Check,
  X,
} from 'lucide-react';
import { SavedPrompt } from '../types';
import { useToast } from './Toast';

interface PromptsViewProps {
  prompts: SavedPrompt[];
  onSavePrompt: (prompt: SavedPrompt) => void;
  onUpdatePrompt: (prompt: SavedPrompt) => void;
  onDeletePrompt: (id: string) => void;
  onUsePromptInChat: (text: string) => void;
}

export const PromptsView: React.FC<PromptsViewProps> = ({
  prompts,
  onSavePrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onUsePromptInChat,
}) => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SavedPrompt['category']>('Strategy');
  const [promptContent, setPromptContent] = useState('');

  const categories = ['All', 'Strategy', 'Engineering', 'Intelligence', 'Visual Studio', 'Personal'];

  const filteredPrompts = prompts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingPrompt(null);
    setTitle('');
    setCategory('Strategy');
    setPromptContent('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: SavedPrompt) => {
    setEditingPrompt(p);
    setTitle(p.title);
    setCategory(p.category);
    setPromptContent(p.prompt);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !promptContent.trim()) return;

    if (editingPrompt) {
      onUpdatePrompt({
        ...editingPrompt,
        title: title.trim(),
        category,
        prompt: promptContent.trim(),
      });
      showToast('Prompt updated successfully');
    } else {
      const newP: SavedPrompt = {
        id: 'prompt-' + Date.now(),
        title: title.trim(),
        category,
        prompt: promptContent.trim(),
        createdAt: new Date().toISOString(),
      };
      onSavePrompt(newP);
      showToast('New prompt added to library');
    }
    setIsModalOpen(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Prompt copied to clipboard');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#F1DCE4] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C76D8A]">
            <BookOpen className="w-4 h-4" />
            <span>Prompt Library & Templates</span>
          </div>
          <h1 className="text-base sm:text-2xl font-bold text-[#402735]">
            Custom Prompts & Formulas
          </h1>
          <p className="hidden sm:block text-xs sm:text-sm text-[#8A687B]">
            Save and reuse your highest-performing instructions for brand strategy, code generation, and research.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#F4B6C2] hover:bg-[#E8A0BF] text-[#402735] font-semibold text-xs shadow-xs hover:shadow active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Prompt</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Category Pills (horizontal scroll on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#FFE8F1] border border-[#C76D8A] text-[#C76D8A] font-semibold shadow-2xs'
                  : 'bg-white border border-[#F1DCE4] text-[#8A687B] hover:text-[#402735]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#8A687B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white border border-[#F1DCE4] text-xs text-[#402735] focus:outline-none focus:border-[#C76D8A]"
          />
        </div>
      </div>

      {/* Prompts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrompts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl p-5 border border-[#F1DCE4] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F5] border border-[#F1DCE4] text-[10px] font-bold text-[#874C67]">
                  {p.category}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(p.prompt)}
                    title="Copy prompt text"
                    className="p-1 rounded text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(p)}
                    title="Edit prompt"
                    className="p-1 rounded text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePrompt(p.id)}
                    title="Delete prompt"
                    className="p-1 rounded text-[#8A687B] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[#402735]">{p.title}</h3>
              <p className="text-xs text-[#514346] leading-relaxed bg-[#FFF7FA] p-3 rounded-2xl border border-[#F1DCE4]/60 whitespace-pre-wrap">
                {p.prompt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F1DCE4]/50">
              <span className="text-[10px] text-[#8A687B]">Added {new Date(p.createdAt).toLocaleDateString()}</span>
              <button
                onClick={() => onUsePromptInChat(p.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE8F1] hover:bg-[#F4B6C2] text-xs font-semibold text-[#402735] transition-colors shadow-2xs"
              >
                <span>Use in Chat</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#F1DCE4] space-y-2">
          <BookOpen className="w-10 h-10 text-[#E8A0BF] mx-auto" />
          <h3 className="text-sm font-semibold text-[#402735]">No prompts in this category</h3>
          <p className="text-xs text-[#8A687B]">Click "New Prompt" to craft a custom template.</p>
        </div>
      )}

      {/* Modal for Creating or Editing a Prompt */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#402735]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 border border-[#F1DCE4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1DCE4]">
              <h2 className="text-base font-bold text-[#402735]">
                {editingPrompt ? 'Edit Custom Prompt' : 'Create Custom Prompt'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#402735] mb-1">Prompt Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 🌸 Cosmetic Product Launch Strategy"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-[#402735] focus:outline-none focus:border-[#C76D8A]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#402735] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-[#402735] focus:outline-none focus:border-[#C76D8A]"
                >
                  <option value="Strategy">Strategy</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Intelligence">Intelligence</option>
                  <option value="Visual Studio">Visual Studio</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#402735] mb-1">Prompt Content</label>
                <textarea
                  rows={4}
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  placeholder="Write the full instructions or questions you want to ask..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF7FA] border border-[#F1DCE4] text-[#402735] focus:outline-none focus:border-[#C76D8A] resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#402735] hover:bg-[#FFE8F1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#C76D8A] hover:bg-[#81515B] text-white shadow-sm"
                >
                  {editingPrompt ? 'Update Prompt' : 'Save to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
