import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2,
  Download,
  Copy,
  Trash2,
  Sparkles,
  Maximize2,
  X,
  Heart,
  RefreshCw,
  Sliders,
  Layers,
  Palette,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Edit3,
  ExternalLink,
  Key,
} from 'lucide-react';
import { GeneratedImage, AppSettings } from '../types';
import { useToast } from './Toast';

interface ImageStudioViewProps {
  images: GeneratedImage[];
  onSaveNewImage: (img: GeneratedImage) => void;
  onDeleteImage: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  initialPrompt?: string;
  settings?: AppSettings;
  onOpenSettings?: () => void;
}

export const ImageStudioView: React.FC<ImageStudioViewProps> = ({
  images,
  onSaveNewImage,
  onDeleteImage,
  onToggleFavorite,
  initialPrompt = '',
  settings,
  onOpenSettings,
}) => {
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '3:4' | '4:3' | '9:16'>('1:1');
  const [style, setStyle] = useState('Realistic');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [generationSeconds, setGenerationSeconds] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const [latestResult, setLatestResult] = useState<GeneratedImage | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GeneratedImage | null>(null);
  const [filterFavorites, setFilterFavorites] = useState(false);

  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      if (promptInputRef.current) {
        promptInputRef.current.focus();
      }
    }
  }, [initialPrompt]);

  // Generation timer and progress stage updates
  useEffect(() => {
    if (isGenerating) {
      setGenerationSeconds(0);
      setProgressStage('Interpreting prompt description...');
      timerRef.current = setInterval(() => {
        setGenerationSeconds((prev) => {
          const next = prev + 1;
          if (next === 3) setProgressStage('Dispatching to FLUX.1 neural engine...');
          if (next === 7) setProgressStage('Denoising pixels & rendering lighting...');
          if (next === 12) setProgressStage('Finalizing high-res textures & details...');
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGenerating]);

  // Retry countdown timer
  useEffect(() => {
    if (retryCountdown && retryCountdown > 0) {
      const cd = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000);
      return () => clearTimeout(cd);
    } else if (retryCountdown === 0) {
      setRetryCountdown(null);
    }
  }, [retryCountdown]);

  const styleOptions = [
    { id: 'Realistic', label: '📸 Realistic / Photo', desc: '8k photorealistic, natural lighting, crisp fine details' },
    { id: 'Anime', label: '🎀 Anime & Cartoon', desc: 'Japanese animation aesthetic, clean lines, vibrant colors' },
    { id: '3D', label: '💎 3D Character & Render', desc: 'Pixar / Octane render, subsurface scattering, tactile 3D' },
    { id: 'Illustration', label: '🎨 Art Illustration', desc: 'Hand-drawn textures, concept art, artistic pastel tones' },
    { id: 'Cinematic', label: '🎞️ Cinematic 35mm', desc: 'Film still, dramatic atmospheric lighting, anamorphic lens' },
    { id: 'Product Photography', label: '✨ Product Photography', desc: 'Studio lightbox, luxury commercial reflections' },
    { id: 'Botanical Watercolor', label: '🌸 Botanical Watercolor', desc: 'Soft pastel washes, floral petals, delicate ink' },
    { id: 'Editorial Studio', label: '🏛️ Editorial Studio', desc: 'Warm minimalist desk sanctuary, soft daylight' },
  ];

  const aspectRatios = [
    { id: '1:1', label: '1:1 Square', icon: '■', desc: '768 × 768' },
    { id: '16:9', label: '16:9 Widescreen', icon: '▬', desc: '1024 × 576' },
    { id: '3:4', label: '3:4 Portrait', icon: '▮', desc: '768 × 1024' },
    { id: '4:3', label: '4:3 Landscape', icon: '▭', desc: '1024 × 768' },
    { id: '9:16', label: '9:16 Story', icon: '▯', desc: '576 × 1024' },
  ];

  const samplePrompts = [
    'A fluffy white cat wearing pink sunglasses in a flower garden, 3D cartoon style.',
    'A pair of futuristic blush-pink platform sneakers on a premium studio background.',
    'A photorealistic sunset over a mountain lake, golden hour reflection, crystal clear water.',
    'A magical Victorian glass greenhouse conservatory with climbing blush roses and golden mist.',
    'A Parisian minimalist vanity with perfume flacon on pink marble, morning sunlight caustics.',
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const targetPrompt = (customPrompt || prompt).trim();
    if (!targetPrompt || isGenerating) return;

    setIsGenerating(true);
    setLastError(null);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (settings?.hfToken) headers['x-hf-token'] = settings.hfToken;
    if (settings?.pollenKey) headers['x-pollen-key'] = settings.pollenKey;

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: targetPrompt,
          aspectRatio,
          style,
          negativePrompt: negativePrompt.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image. Please try again.');
      }

      if (!data.imageUrl) {
        throw new Error('No image was returned from the AI model.');
      }

      const newImg: GeneratedImage = {
        id: 'img-' + Date.now(),
        imageUrl: data.imageUrl,
        prompt: targetPrompt,
        style,
        aspectRatio,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider || 'FLUX.1 Schnell Engine',
        seed: data.seed,
      };

      // Set as the prominent latest result preview
      setLatestResult(newImg);

      // Save into the archive history
      onSaveNewImage(newImg);

      showToast('Image generated successfully with AI!');
    } catch (e: any) {
      const errorMsg = e?.message || 'Error creating image with the AI engine.';
      setLastError(errorMsg);
      if (errorMsg.includes('rate limit') || errorMsg.includes('45s') || errorMsg.includes('limit reached')) {
        setRetryCountdown(15);
      }
      showToast(errorMsg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a');
    a.href = img.imageUrl;
    a.download = `ranuu-ai-${img.id}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Download started');
  };

  const handleCopyPrompt = (p: string) => {
    navigator.clipboard.writeText(p);
    showToast('Prompt copied to clipboard');
  };

  const handleEditPrompt = (p: string) => {
    setPrompt(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
    showToast('Prompt loaded into editor');
  };

  const displayedImages = filterFavorites
    ? images.filter((img) => img.favorite)
    : images;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-28">
      {/* Studio Header & Generator Panel */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#F1DCE4] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1DCE4]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-[#F4B6C2] to-[#E8A0BF] flex items-center justify-center text-[#402735] shadow-xs flex-shrink-0">
              <Wand2 className="w-4 h-4 text-[#7A3E53]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-lg font-bold text-[#402735] leading-tight">
                  Ranuu AI Image Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#FFE8F1] text-[#874C67] text-[10px] font-bold uppercase tracking-wider">
                  FLUX.1 Engine
                </span>
              </div>
              <p className="text-xs text-[#8A687B]">
                Real prompt-based AI image generation — describe any subject, style, or composition
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                showAdvanced
                  ? 'bg-[#FFE8F1] border-[#C76D8A] text-[#C76D8A]'
                  : 'bg-[#FFF7FA] border-[#F1DCE4] text-[#8A687B] hover:text-[#402735]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              ref={promptInputRef}
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your desired image in detail (e.g. A cute pink kitten wearing a tiny golden crown, sitting in a magical garden, cinematic lighting, 3D style)..."
              className="w-full p-3.5 sm:p-4 rounded-2xl bg-[#FFF7FA] border border-[#F1DCE4] text-xs sm:text-sm text-[#402735] placeholder:text-[#8A687B] focus:outline-none focus:border-[#C76D8A] focus:ring-2 focus:ring-[#F4B6C2]/30 resize-none leading-relaxed transition-all"
            />
            {prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute top-3 right-3 text-[#8A687B] hover:text-[#402735] p-1 rounded-full bg-white/70"
                title="Clear prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Prompt Ideas Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-[11px] whitespace-nowrap">
            <span className="text-[#8A687B] flex-shrink-0 text-[10px] uppercase font-bold tracking-wider">
              Ideas:
            </span>
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sample)}
                className="px-2.5 py-1 rounded-full bg-[#FFF0F5] hover:bg-[#FFE8F1] border border-[#F1DCE4] text-[#402735] text-[11px] font-medium transition-colors flex-shrink-0"
              >
                {sample.substring(0, 36)}...
              </button>
            ))}
          </div>

          {/* Style Presets Grid */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#402735] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#C76D8A]" />
                <span>Style Preset</span>
              </span>
              <span className="text-[10px] text-[#8A687B]">Selected: {style}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStyle(opt.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    style === opt.id
                      ? 'bg-[#FFE8F1] border-[#C76D8A] text-[#402735] shadow-xs'
                      : 'bg-white border-[#F1DCE4] text-[#8A687B] hover:bg-[#FFF7FA]'
                  }`}
                >
                  <span className="text-xs font-semibold block">{opt.label}</span>
                  <span className="text-[10px] text-[#8A687B] mt-0.5 line-clamp-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Generate Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#402735]">Aspect Ratio:</span>
              <div className="flex items-center bg-[#FFF7FA] border border-[#F1DCE4] rounded-full p-0.5">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id as any)}
                    title={`${ratio.label} (${ratio.desc})`}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                      aspectRatio === ratio.id
                        ? 'bg-white text-[#402735] font-semibold shadow-2xs'
                        : 'text-[#8A687B] hover:text-[#402735]'
                    }`}
                  >
                    <span className="text-[10px] text-[#C76D8A]">{ratio.icon}</span>
                    <span>{ratio.label.split(' ')[0]}</span>
                    <span className="hidden md:inline text-[10px] text-[#8A687B]">
                      {ratio.label.split(' ')[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={!prompt.trim() || isGenerating}
              className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                prompt.trim() && !isGenerating
                  ? 'bg-gradient-to-r from-[#F4B6C2] to-[#E8A0BF] hover:opacity-95 text-[#402735] shadow-sm hover:shadow active:scale-95 cursor-pointer'
                  : 'bg-[#FFF0F5] text-[#8A687B] cursor-not-allowed border border-[#F1DCE4]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C76D8A]" />
                  <span>Generating AI Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#8A3756]" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>

          {/* Advanced Collapsible Settings */}
          {showAdvanced && (
            <div className="p-4 rounded-2xl bg-[#FFF7FA] border border-[#F1DCE4] space-y-3 animate-in fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#402735]">
                  Negative Prompt (Exclude unwanted elements)
                </span>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g. text, watermarks, blurry, low resolution, distorted, extra limbs, grain..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#F1DCE4] text-xs text-[#402735] focus:outline-none focus:border-[#C76D8A]"
                />
              </div>

              {onOpenSettings && (
                <div className="flex items-center justify-between pt-2 border-t border-[#F1DCE4]/60 text-xs">
                  <div className="flex items-center gap-1.5 text-[#8A687B]">
                    <Key className="w-3.5 h-3.5 text-[#C76D8A]" />
                    <span>Want unlimited fast generations? Configure a free Hugging Face token or Pollen key</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="px-2.5 py-1 rounded-full bg-white border border-[#F1DCE4] text-[#402735] font-semibold text-[11px] hover:bg-[#FFE8F1]"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Generation Progress Indicator */}
      {isGenerating && (
        <div className="bg-white rounded-3xl p-6 border border-[#C76D8A] shadow-md animate-in fade-in space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE8F1] flex items-center justify-center text-[#C76D8A] animate-pulse">
                <Sparkles className="w-5 h-5 text-[#C76D8A]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#402735]">
                  Creating AI Image: {style}
                </h3>
                <p className="text-xs text-[#8A687B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C76D8A] animate-ping" />
                  <span>{progressStage}</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#C76D8A] px-2.5 py-1 rounded-full bg-[#FFF0F5]">
              {generationSeconds}s elapsed
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-[#FFF0F5] h-2 rounded-full overflow-hidden border border-[#F1DCE4]">
            <div
              className="h-full bg-gradient-to-r from-[#F4B6C2] via-[#E8A0BF] to-[#C76D8A] rounded-full transition-all duration-500 ease-out animate-pulse"
              style={{
                width: `${Math.min(95, Math.max(10, generationSeconds * 12))}%`,
              }}
            />
          </div>

          <div className="text-[11px] text-[#8A687B] flex items-center justify-between">
            <span>Interpreting prompt with FLUX neural diffusion...</span>
            <span>Ratio {aspectRatio}</span>
          </div>
        </div>
      )}

      {/* Error & Rate Limit Banner */}
      {lastError && !isGenerating && (
        <div className="bg-[#FFF0F5] rounded-3xl p-5 border border-[#F1DCE4] shadow-xs space-y-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#BA1A1A] flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-bold text-[#402735]">
                Image Generation Notice
              </h3>
              <p className="text-xs text-[#8A687B] leading-relaxed">
                {lastError}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1DCE4]">
            <div className="text-xs text-[#8A687B]">
              {retryCountdown ? (
                <span className="font-semibold text-[#C76D8A]">
                  Rate limit cooldown: Retry ready in {retryCountdown}s
                </span>
              ) : (
                <span>You can retry the generation now.</span>
              )}
            </div>
            <button
              onClick={() => handleGenerate()}
              disabled={Boolean(retryCountdown && retryCountdown > 0)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                retryCountdown && retryCountdown > 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#F4B6C2] text-[#402735] hover:bg-[#E8A0BF] shadow-xs'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* Dedicated Newly Generated Result Preview Section */}
      {latestResult && !isGenerating && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#F4B6C2] shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1DCE4]">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C76D8A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C76D8A]"></span>
              </span>
              <h2 className="text-sm sm:text-base font-bold text-[#402735]">
                Newly Generated Result
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#FFE8F1] text-[#874C67] text-[10px] font-bold">
                {latestResult.provider || 'FLUX.1 Engine'}
              </span>
            </div>
            <span className="text-[11px] text-[#8A687B]">
              {latestResult.timestamp}
            </span>
          </div>

          {/* Large Image Preview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-7 flex justify-center">
              <div
                className="relative rounded-2xl overflow-hidden bg-[#2B1421] cursor-pointer group shadow-sm max-h-[460px] w-full flex items-center justify-center"
                onClick={() => setLightboxImage(latestResult)}
              >
                <img
                  src={latestResult.imageUrl}
                  alt={latestResult.prompt}
                  className="max-h-[460px] w-full object-contain group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#402735]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4" />
                    <span>View Fullscreen</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Result Details & Action Buttons */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#FFE8F1] text-[#874C67] text-xs font-semibold">
                    {latestResult.style}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF0F5] border border-[#F1DCE4] text-[#8A687B] text-xs">
                    Ratio {latestResult.aspectRatio}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF7FA] border border-[#F1DCE4] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A687B] block">
                    Generation Prompt:
                  </span>
                  <p className="text-xs text-[#402735] font-medium leading-relaxed">
                    {latestResult.prompt}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#F1DCE4]/60">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownload(latestResult)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#F4B6C2] hover:bg-[#E8A0BF] text-[#402735] font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PNG</span>
                  </button>

                  <button
                    onClick={() => handleGenerate(latestResult.prompt)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FFE8F1] text-[#402735] font-semibold text-xs border border-[#F1DCE4] shadow-xs transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-[#C76D8A]" />
                    <span>Regenerate</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditPrompt(latestResult.prompt)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF7FA] hover:bg-[#FFE8F1] text-[#402735] text-xs font-medium border border-[#F1DCE4] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#8A687B]" />
                    <span>Edit Prompt</span>
                  </button>
                  <button
                    onClick={() => onToggleFavorite(latestResult.id)}
                    className="p-2 rounded-xl bg-[#FFF7FA] hover:bg-[#FFE8F1] border border-[#F1DCE4] text-[#402735] transition-colors"
                    title="Save to favorites"
                  >
                    <Heart className={`w-4 h-4 ${latestResult.favorite ? 'fill-[#C76D8A] text-[#C76D8A]' : 'text-[#8A687B]'}`} />
                  </button>
                  <button
                    onClick={() => handleCopyPrompt(latestResult.prompt)}
                    className="p-2 rounded-xl bg-[#FFF7FA] hover:bg-[#FFE8F1] border border-[#F1DCE4] text-[#402735] transition-colors"
                    title="Copy prompt text"
                  >
                    <Copy className="w-4 h-4 text-[#8A687B]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Separate Gallery of Previously Generated Images */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[#402735]">
              Generation History & Archive ({displayedImages.length})
            </h2>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#FFE8F1] text-[#874C67] text-[10px] font-semibold">
              Saved in localStorage
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                filterFavorites
                  ? 'bg-[#FFE8F1] border-[#C76D8A] text-[#C76D8A]'
                  : 'bg-white border-[#F1DCE4] text-[#8A687B] hover:text-[#402735]'
              }`}
            >
              <Heart className={`w-3 h-3 ${filterFavorites ? 'fill-[#C76D8A]' : ''}`} />
              <span>Favorites Only</span>
            </button>
          </div>
        </div>

        {displayedImages.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#F1DCE4] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] flex items-center justify-center text-[#E8A0BF] mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#402735]">
              {filterFavorites ? 'No favorite images yet' : 'No images generated yet'}
            </h3>
            <p className="text-xs text-[#8A687B] max-w-sm mx-auto">
              {filterFavorites
                ? 'Click the heart icon on any generated image to add it to your favorites list.'
                : 'Enter a creative prompt in the studio box above to generate your first AI artwork.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedImages.map((img) => (
              <div
                key={img.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-[#F1DCE4] shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Container */}
                <div
                  className="relative overflow-hidden cursor-pointer bg-[#2B1421] aspect-square flex items-center justify-center"
                  onClick={() => setLightboxImage(img)}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.prompt}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#402735]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <span className="text-white text-[11px] font-medium flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Fullscreen</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(img.id);
                      }}
                      className="p-1.5 rounded-full bg-white/40 backdrop-blur-md text-white hover:bg-white hover:text-[#C76D8A] transition-colors"
                      title={img.favorite ? 'Unfavorite' : 'Favorite'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${img.favorite ? 'fill-[#C76D8A] text-[#C76D8A]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-2.5">
                  <p className="text-xs text-[#402735] line-clamp-2 leading-relaxed font-medium">
                    {img.prompt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F1DCE4]/60 text-[11px] text-[#8A687B]">
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF0F5] font-semibold text-[#874C67] truncate max-w-[130px]">
                      {img.style}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditPrompt(img.prompt)}
                        title="Use prompt again"
                        className="p-1.5 rounded-lg text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyPrompt(img.prompt)}
                        title="Copy prompt"
                        className="p-1.5 rounded-lg text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownload(img)}
                        title="Download image"
                        className="p-1.5 rounded-lg text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteImage(img.id)}
                        title="Delete from archive"
                        className="p-1.5 rounded-lg text-[#8A687B] hover:text-[#BA1A1A] hover:bg-[#FFDAD6] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Fullscreen View */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#402735]/85 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#F1DCE4] flex flex-col max-h-[92vh]"
          >
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#F1DCE4] bg-[#FFF7FA]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#402735]">{lightboxImage.style}</span>
                <span className="text-xs text-[#8A687B]">· Ratio {lightboxImage.aspectRatio}</span>
                {lightboxImage.provider && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#FFE8F1] text-[10px] font-semibold text-[#874C67]">
                    {lightboxImage.provider}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(lightboxImage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#F1DCE4] text-xs font-semibold text-[#402735] hover:bg-[#FFE8F1]"
                >
                  <Download className="w-3.5 h-3.5 text-[#C76D8A]" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-1.5 rounded-full text-[#8A687B] hover:text-[#402735] hover:bg-[#FFE8F1]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#2B1421] flex items-center justify-center p-3 sm:p-6 min-h-[300px]">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.prompt}
                className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="p-4 bg-white border-t border-[#F1DCE4] flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#402735] font-medium leading-relaxed flex-1 min-w-[200px]">
                {lightboxImage.prompt}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleEditPrompt(lightboxImage.prompt);
                    setLightboxImage(null);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF7FA] border border-[#F1DCE4] text-xs font-semibold text-[#402735] hover:bg-[#FFE8F1]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#C76D8A]" />
                  <span>Use Prompt</span>
                </button>
                <button
                  onClick={() => handleCopyPrompt(lightboxImage.prompt)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFE8F1] text-xs font-semibold text-[#C76D8A] hover:bg-[#F4B6C2]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
