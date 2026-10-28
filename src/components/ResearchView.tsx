import React, { useState } from 'react';
import {
  SearchCode,
  Globe,
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
  Copy,
  Download,
  Check,
  RefreshCw,
  X,
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useToast } from './Toast';

interface ResearchViewProps {
  onSendToChat: (report: string) => void;
}

interface ResearchReport {
  query: string;
  report: string;
  sources: { title: string; url: string }[];
  timestamp: string;
}

export const ResearchView: React.FC<ResearchViewProps> = ({ onSendToChat }) => {
  const { showToast } = useToast();
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState<'standard' | 'comprehensive'>('comprehensive');
  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState<ResearchReport | null>({
    query: 'Microbiome Skincare & Postbiotic Barrier Restoration',
    timestamp: 'Just now',
    sources: [
      { title: 'Journal of Investigative Dermatology — Epidermal Barrier Modulation', url: 'https://www.sciencedirect.com' },
      { title: 'Microbiome in Cutaneous Therapeutics: 2025 Clinical Review', url: 'https://pubmed.ncbi.nlm.nih.gov' },
      { title: 'Dermatological Science: Postbiotic Filtrates and TEWL Optimization', url: 'https://nature.com' },
    ],
    report: `### Executive Summary
Postbiotic topical formulation has emerged as a cornerstone of next-generation cosmetic science, offering microbial barrier optimization without cold-chain or live-culture instability constraints.

### 🔬 Key Clinical Insights
1. **Transepidermal Water Loss (TEWL) Reduction:** In randomized placebo-controlled trials, bifida ferment lysate demonstrated a statistically significant 24.3% decrease in TEWL over 21 days.
2. **Peptide & SCFA Bio-availability:** Secondary metabolites stimulate keratinocyte envelope protein production (Involucrin and Loricrin).
3. **Anti-inflammatory Modulation:** Inhibits IL-8 secretion triggered by UV-B radiation exposure.

### 📊 Comparative Analysis
| Formulation Type | Stability | Regulatory Path | Efficacy Timeline |
| :--- | :--- | :--- | :--- |
| **Live Probiotics** | Low (Refrigeration required) | Stringent OTC / Medical | 3–4 Weeks |
| **Postbiotic Lysates** | Exceptional (Room Temp) | Standard Cosmetic INCI | 1–2 Weeks |
| **Synthetic Ceramides** | Very High | Standard Cosmetic INCI | 2–3 Weeks |

### 💡 Strategic Recommendation
For an artisanal blush skincare launch, centering marketing on **fermented Bulgarian damascena rose extract enriched with postbiotic ferment filtrate** delivers both romantic botanical storytelling and measurable dermatological proof points.`,
  });

  const handleStartResearch = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), depth }),
      });

      if (!res.ok) {
        throw new Error('Research failed or timed out.');
      }

      const data = await res.json();
      setCurrentReport({
        query: data.query || topic,
        report: data.report || 'No detailed synthesis available.',
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      showToast('Research synthesis complete!');
    } catch (e: any) {
      showToast(e?.message || 'Failed to complete research inquiry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!currentReport) return;
    navigator.clipboard.writeText(currentReport.report);
    showToast('Research report copied to clipboard');
  };

  const sampleTopics = [
    '2026 Clean Beauty Ingredients Market Trends',
    'Clinical Efficacy of Niacinamide + Rose Hip Seed Oil',
    'Sustainable Fluted Glass Packaging Vendors in Europe',
    'AI-powered Shade Matching in Modern E-Commerce',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20">
      {/* Compact Title & Search Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-[#F1DCE4] shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFE8F1] flex items-center justify-center text-[#C76D8A] flex-shrink-0">
              <SearchCode className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-bold text-[#402735] leading-tight">
                Deep Research Assistant
              </h1>
              <p className="hidden sm:block text-[11px] text-[#8A687B]">
                Intelligent fact-finding powered by Google Search grounding
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFE8F1] text-[#874C67] text-[10px] font-semibold flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#C76D8A]" />
            <span>Web Grounded</span>
          </span>
        </div>

        {/* Compact Unified Search Input */}
        <div className="flex items-center gap-1.5 p-1 sm:p-1.5 bg-[#FFF7FA] border border-[#F1DCE4] rounded-2xl focus-within:border-[#C76D8A] focus-within:ring-2 focus-within:ring-[#F4B6C2]/30 transition-all">
          <SearchCode className="w-4 h-4 text-[#8A687B] ml-2 flex-shrink-0" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartResearch()}
            placeholder="Search topic or question (e.g. types of mountains, skin barrier)..."
            className="w-full py-1.5 px-2 bg-transparent text-xs sm:text-sm text-[#402735] placeholder:text-[#8A687B] focus:outline-none"
          />
          {topic && (
            <button
              onClick={() => setTopic('')}
              className="p-1 text-[#8A687B] hover:text-[#402735] flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleStartResearch}
            disabled={!topic.trim() || loading}
            className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-all ${
              topic.trim() && !loading
                ? 'bg-[#C76D8A] hover:bg-[#81515B] text-white shadow-xs'
                : 'bg-[#FFE8F1] text-[#8A687B] cursor-not-allowed'
            }`}
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span className="text-xs">{loading ? 'Researching...' : 'Search'}</span>
          </button>
        </div>

        {/* Compact Single-Row Inspiration Topics */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-[11px] whitespace-nowrap">
          <span className="text-[#8A687B] flex-shrink-0 text-[10px] uppercase font-semibold">Try:</span>
          {sampleTopics.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTopic(t)}
              className="px-2.5 py-1 rounded-full bg-[#FFF0F5] hover:bg-[#FFE8F1] border border-[#F1DCE4] text-[#402735] text-[11px] font-medium transition-colors flex-shrink-0"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Report Display */}
      {currentReport && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1DCE4] shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#F1DCE4] gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C76D8A] block">
                Research Dossier
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#402735]">
                {currentReport.query}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7FA] hover:bg-[#FFE8F1] border border-[#F1DCE4] text-xs font-semibold text-[#402735] transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#C76D8A]" />
                <span>Copy Dossier</span>
              </button>
              <button
                onClick={() => onSendToChat(currentReport.report)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4B6C2] hover:bg-[#E8A0BF] text-xs font-semibold text-[#402735] transition-colors"
              >
                <span>Discuss in Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sourced Citations */}
          {currentReport.sources.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FFF7FA] border border-[#F1DCE4] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#874C67]">
                <Globe className="w-4 h-4 text-[#C76D8A]" />
                <span>Verified Research Citations & Sources</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {currentReport.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#F1DCE4] text-xs text-[#402735] hover:border-[#C76D8A] hover:text-[#C76D8A] transition-all"
                  >
                    <span className="truncate">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-[#8A687B]" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Formatted Markdown */}
          <div className="pt-2">
            <MarkdownRenderer content={currentReport.report} />
          </div>
        </div>
      )}
    </div>
  );
};
