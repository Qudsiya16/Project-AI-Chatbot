import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Square,
  Globe,
  Paperclip,
  Mic,
  Copy,
  Check,
  RotateCcw,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Trash2,
  FileDown,
  Search,
  ExternalLink,
  ArrowRight,
  Wand2,
  Smile,
  AlertCircle,
  X,
  MessageSquare,
  SearchCode,
  Image as ImageIcon,
} from 'lucide-react';
import { Conversation, ChatMessage, AppSettings, TabMode } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useToast } from './Toast';

interface ChatViewProps {
  conversation: Conversation;
  onSendMessage: (text: string, enableSearch: boolean) => void;
  onRegenerateResponse: () => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onClearConversation: () => void;
  onRenameConversation: (newTitle: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onToggleBookmark: (messageId: string) => void;
  onToggleVote: (messageId: string, type: 'up' | 'down') => void;
  isGenerating: boolean;
  onStopGeneration: () => void;
  settings: AppSettings;
  onSwitchTab: (tab: TabMode) => void;
  onPopulateStudioPrompt?: (prompt: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  onSendMessage,
  onRegenerateResponse,
  onEditMessage,
  onClearConversation,
  onRenameConversation,
  onDeleteMessage,
  onToggleBookmark,
  onToggleVote,
  isGenerating,
  onStopGeneration,
  settings,
  onSwitchTab,
  onPopulateStudioPrompt,
}) => {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(settings.enableWebSearch);
  const [composerMode, setComposerMode] = useState<'chat' | 'research' | 'image'>('chat');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(conversation.title);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [searchInChatQuery, setSearchInChatQuery] = useState('');
  const [showSearchInChat, setShowSearchInChat] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, isGenerating]);

  // Keep title input in sync
  useEffect(() => {
    setTitleInput(conversation.title);
  }, [conversation.title]);

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    const text = inputText.trim();
    setInputText('');

    if (composerMode === 'research') {
      onSwitchTab('research');
      return;
    }

    if (composerMode === 'image') {
      if (onPopulateStudioPrompt) onPopulateStudioPrompt(text);
      onSwitchTab('studio');
      return;
    }

    onSendMessage(text, webSearchEnabled);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const handleExportMarkdown = () => {
    let md = `# ${conversation.title}\n*Exported from Ranuu AI on ${new Date().toLocaleDateString()}*\n\n`;
    conversation.messages.forEach((m) => {
      md += `### ${m.role === 'user' ? 'You' : 'Ranuu AI'} (${m.timestamp})\n${m.content}\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    showToast('Conversation exported as Markdown');
  };

  const starterPrompts = [
    {
      category: 'Strategy',
      tag: '🌸 Launch Strategy for Organic Beauty',
      icon: 'spa',
      prompt: 'Can you draft a comprehensive launch strategy for an artisanal blush skincare collection named "Roseè Essence"? Include target personas and a launch timeline.',
    },
    {
      category: 'Engineering',
      tag: '💻 TypeScript API Route with Gemini Free-Tier',
      icon: 'code',
      prompt: 'Write an Express / Next.js TypeScript server route calling Gemini 3.8 Flash using @google/genai with streaming SSE and error handling.',
    },
    {
      category: 'Intelligence',
      tag: '🔍 Deep Research: 2025 AI UX Trends',
      icon: 'search',
      prompt: 'Synthesize the top emerging 2025 UX trends for feminine and calm personal AI assistants, focusing on micro-interactions and tactile palettes.',
    },
    {
      category: 'Visual Studio',
      tag: '🎨 Generate Blush Aesthetic Wallpapers',
      icon: 'palette',
      prompt: 'Design 3 poetic visual concepts with color palettes and camera angles for a luxurious blush cosmetic vanity shoot.',
    },
  ];

  // Filter messages if search active
  const displayedMessages = showSearchInChat && searchInChatQuery.trim()
    ? conversation.messages.filter((m) => m.content.toLowerCase().includes(searchInChatQuery.toLowerCase()))
    : conversation.messages;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 flex flex-col space-y-6 pb-28">
      {/* Top Action Context Bar (Compact on Mobile) */}
      <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl border border-[#F1DCE4] p-2.5 sm:p-3.5 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="w-2 h-2 rounded-full bg-[#E8A0BF] animate-pulse flex-shrink-0"></span>

          {isEditingTitle ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (titleInput.trim()) onRenameConversation(titleInput.trim());
                setIsEditingTitle(false);
              }}
              className="flex items-center gap-1 flex-1 max-w-sm"
            >
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full bg-[#FFF7FA] border border-[#C76D8A] rounded-lg px-2 py-0.5 text-xs text-[#402735] font-semibold focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 rounded-md bg-[#FFE8F1] text-[#C76D8A] hover:bg-[#F4B6C2]"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="font-semibold text-xs sm:text-sm text-[#402735] truncate max-w-[140px] sm:max-w-xs">
                {conversation.title}
              </h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                title="Rename title"
                className="p-1 rounded text-[#8A687B] hover:text-[#402735] hover:bg-[#FFF0F5] transition-colors flex-shrink-0"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}

          <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-[#FFF0F5] border border-[#F1DCE4] text-[#874C67] text-[10px] font-semibold flex-shrink-0">
            {conversation.category || 'Marketing'}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Active Model Pill (Desktop only to prevent mobile clutter) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF0F5] border border-[#F1DCE4] text-[#402735] text-xs shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#C76D8A]" />
            <span className="font-semibold text-[11px]">{settings.activeModel}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleExportMarkdown}
              title="Export conversation"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-[#FFF7FA] hover:bg-[#FFE8F1] border border-[#F1DCE4] text-[#402735] text-xs font-medium transition-all flex items-center gap-1"
            >
              <FileDown className="w-3.5 h-3.5 text-[#8A687B]" />
              <span className="hidden md:inline">Export</span>
            </button>

            <button
              onClick={() => setShowSearchInChat(!showSearchInChat)}
              title="Search messages in chat"
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl border text-xs font-medium transition-all flex items-center gap-1 ${
                showSearchInChat
                  ? 'bg-[#FFE8F1] border-[#C76D8A] text-[#C76D8A]'
                  : 'bg-[#FFF7FA] border-[#F1DCE4] text-[#402735] hover:bg-[#FFE8F1]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
            </button>

            <button
              onClick={onClearConversation}
              title="Clear all messages in this chat"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-[#FFF7FA] hover:bg-[#FFDAD6] border border-[#F1DCE4] text-[#8A687B] hover:text-[#BA1A1A] text-xs font-medium transition-all flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* In-chat compact search bar */}
      {showSearchInChat && (
        <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-white rounded-xl border border-[#C76D8A] shadow-xs animate-in fade-in">
          <Search className="w-3.5 h-3.5 text-[#8A687B] ml-1 flex-shrink-0" />
          <input
            type="text"
            placeholder="Type to filter messages..."
            value={searchInChatQuery}
            onChange={(e) => setSearchInChatQuery(e.target.value)}
            className="w-full text-xs text-[#402735] focus:outline-none bg-transparent"
            autoFocus
          />
          {searchInChatQuery && (
            <button onClick={() => setSearchInChatQuery('')} className="text-[11px] text-[#8A687B] px-1 hover:text-[#402735]">
              Clear
            </button>
          )}
          <button
            onClick={() => setShowSearchInChat(false)}
            className="p-1 text-[#8A687B] hover:text-[#402735]"
            title="Close search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chat Messages Stream */}
      <div className="flex flex-col space-y-6">
        {displayedMessages.map((msg, index) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end w-full group">
                <div className="max-w-2xl bg-[#F4B6C2] text-[#402735] rounded-3xl rounded-tr-sm px-5 py-3.5 shadow-xs border border-[#E8A0BF]/40">
                  {editingMessageId === msg.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full bg-white/90 p-2 rounded-xl text-xs text-[#402735] border border-[#C76D8A] focus:outline-none resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="px-2.5 py-1 rounded-full text-[11px] bg-white/80 text-[#402735]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (editingContent.trim()) {
                              onEditMessage(msg.id, editingContent.trim());
                            }
                            setEditingMessageId(null);
                          }}
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#402735] text-white"
                        >
                          Resend
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
                        {msg.content}
                      </p>
                      <div className="flex justify-end items-center gap-2 mt-1.5 text-[11px] text-[#402735]/70 font-medium">
                        <button
                          onClick={() => {
                            setEditingMessageId(msg.id);
                            setEditingContent(msg.content);
                          }}
                          title="Edit & Resend"
                          className="opacity-0 group-hover:opacity-100 hover:text-[#402735] p-0.5"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <span>{msg.timestamp}</span>
                        <span>✓✓</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          }

          // Assistant message
          return (
            <div key={msg.id} className="flex items-start gap-3 sm:gap-4 w-full">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FEB4D4] to-[#F4B6C2] flex items-center justify-center text-[#7B425D] shadow-xs flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-[#81515B]" />
              </div>

              <div className="flex-1 max-w-4xl bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#F1DCE4] space-y-4">
                {/* Assistant Card Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#F1DCE4]/60">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm sm:text-base text-[#402735]">
                      Ranuu Intelligence
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FFE8F1] text-[#853853] text-[10px] font-semibold uppercase tracking-wider">
                      Curated Synthesis
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8A687B]">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Main Markdown Body */}
                <MarkdownRenderer content={msg.content} />

                {/* Grounding Sources (if web search was used) */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="p-3 rounded-2xl bg-[#FFF7FA] border border-[#F1DCE4] space-y-2 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#874C67]">
                      <Globe className="w-3.5 h-3.5 text-[#C76D8A]" />
                      <span>Verified Web Sources & Citations</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#F1DCE4] text-[11px] text-[#402735] hover:text-[#C76D8A] hover:border-[#C76D8A] transition-colors shadow-2xs"
                        >
                          <span className="truncate max-w-[200px]">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Studio Deep Link Callout Banner if discussing aesthetic/visual concepts */}
                {msg.content.toLowerCase().includes('visual concept') || msg.content.toLowerCase().includes('image studio') ? (
                  <div className="bg-[#FFE8F1]/70 p-4 rounded-2xl border border-[#F1DCE4] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#C76D8A] shadow-xs">
                        <Wand2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#402735] block">
                          Generate in Image Studio
                        </span>
                        <p className="text-[11px] text-[#8A687B]">
                          Turn these visual concepts into high-fidelity AI render frames.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onSwitchTab('studio')}
                      className="px-3.5 py-1.5 rounded-full bg-[#F4B6C2] hover:bg-[#E8A0BF] text-[#402735] font-semibold text-xs transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>Open Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}

                {/* Assistant Footer Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#F1DCE4]/40 gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyText(msg.content)}
                      title="Copy response"
                      className="p-1.5 rounded-lg text-[#8A687B] hover:text-[#402735] hover:bg-[#FFF0F5] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {index === conversation.messages.length - 1 && (
                      <button
                        onClick={onRegenerateResponse}
                        title="Regenerate response"
                        className="p-1.5 rounded-lg text-[#8A687B] hover:text-[#402735] hover:bg-[#FFF0F5] transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="w-px h-3.5 bg-[#F1DCE4] mx-1" />
                    <button
                      onClick={() => onToggleVote(msg.id, 'up')}
                      title="Helpful response"
                      className={`p-1.5 rounded-lg transition-colors ${
                        msg.upvoted
                          ? 'text-[#C76D8A] bg-[#FFE8F1]'
                          : 'text-[#8A687B] hover:text-[#C76D8A] hover:bg-[#FFF0F5]'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleVote(msg.id, 'down')}
                      title="Not helpful"
                      className={`p-1.5 rounded-lg transition-colors ${
                        msg.downvoted
                          ? 'text-[#BA1A1A] bg-[#FFDAD6]'
                          : 'text-[#8A687B] hover:text-[#BA1A1A] hover:bg-[#FFF0F5]'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleBookmark(msg.id)}
                      title={msg.bookmarked ? 'Saved to Bookmarks' : 'Bookmark message'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        msg.bookmarked
                          ? 'text-[#C76D8A] bg-[#FFE8F1]'
                          : 'text-[#8A687B] hover:text-[#C76D8A] hover:bg-[#FFF0F5]'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${msg.bookmarked ? 'fill-[#C76D8A]' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] text-[#8A687B]">
                    <span className="hidden sm:inline">Token cost: ~{msg.tokenCount || Math.round(msg.content.length / 4)}</span>
                    <span className="sm:hidden text-[10px]">~{msg.tokenCount || Math.round(msg.content.length / 4)} tok</span>
                    <button
                      onClick={() => handleCopyText(msg.content)}
                      title="Share or copy this message segment"
                      className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#FFF7FA] hover:bg-[#FFE8F1] text-[#402735] border border-[#F1DCE4] transition-colors"
                    >
                      <Share2 className="w-3 h-3 text-[#8A687B]" />
                      <span className="hidden sm:inline">Share Segment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Generating Animation */}
        {isGenerating && (
          <div className="flex items-start gap-3 sm:gap-4 w-full animate-in fade-in">
            <div className="w-9 h-9 rounded-2xl bg-[#FEB4D4] flex items-center justify-center text-[#7B425D] shadow-xs flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4 text-[#81515B]" />
            </div>
            <div className="max-w-2xl bg-white rounded-3xl p-5 shadow-xs border border-[#F1DCE4] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C76D8A] animate-ping"></span>
              <span className="text-xs font-medium text-[#8A687B]">
                Ranuu is thinking and generating insights...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries Cards (when few messages or user wants inspiration) */}
      {conversation.messages.length <= 4 && (
        <div className="space-y-2.5 pt-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A687B]">
              Suggested Quick Inquiries
            </span>
            <span className="text-[11px] text-[#C76D8A]">Click prompt to populate composer</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {starterPrompts.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(s.prompt);
                  textareaRef.current?.focus();
                }}
                className="text-left p-3.5 rounded-2xl bg-white hover:bg-[#FFF0F5] border border-[#F1DCE4] shadow-2xs transition-all group flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C76D8A]"></span>
                  <span className="text-[11px] font-bold text-[#874C67]">{s.category}</span>
                </div>
                <span className="text-xs font-semibold text-[#402735] group-hover:text-[#81515B] transition-colors leading-snug">
                  {s.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Message Composer Bar */}
      <div className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-30 px-2 sm:px-6 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="glass-composer rounded-2xl sm:rounded-3xl p-2 sm:p-3.5 flex flex-col space-y-1.5 sm:space-y-2 shadow-lg">
            {/* Top row: Search toggle, Mode tabs, Attachments with icons */}
            <div className="flex items-center justify-between gap-1 sm:gap-2 pb-0.5">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Web Search Icon Button */}
                <button
                  type="button"
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  title={`Web Search: ${webSearchEnabled ? 'ON' : 'OFF'}`}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    webSearchEnabled
                      ? 'bg-[#FEB4D4] text-[#7B425D] font-semibold shadow-2xs'
                      : 'bg-[#FFF0F5] text-[#8A687B] hover:text-[#402735]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className={`w-1.5 h-1.5 rounded-full ${webSearchEnabled ? 'bg-[#7B425D]' : 'bg-[#C7B2BD]'}`} />
                  <span className="hidden sm:inline text-[11px]">Web Search</span>
                </button>

                {/* Mode Switcher with Icons */}
                <div className="flex items-center bg-[#FFF0F5] border border-[#F1DCE4] rounded-full p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setComposerMode('chat')}
                    title="Chat Mode"
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full transition-all ${
                      composerMode === 'chat'
                        ? 'bg-white text-[#402735] font-semibold shadow-2xs'
                        : 'text-[#8A687B] hover:text-[#402735]'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerMode('research')}
                    title="Deep Research Mode"
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full transition-all ${
                      composerMode === 'research'
                        ? 'bg-white text-[#402735] font-semibold shadow-2xs'
                        : 'text-[#8A687B] hover:text-[#402735]'
                    }`}
                  >
                    <SearchCode className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Research</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerMode('image')}
                    title="AI Image Studio"
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full transition-all ${
                      composerMode === 'image'
                        ? 'bg-white text-[#402735] font-semibold shadow-2xs'
                        : 'text-[#8A687B] hover:text-[#402735]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Studio</span>
                  </button>
                </div>
              </div>

              {/* Attach / Mic actions */}
              <div className="flex items-center gap-0.5 sm:gap-1 text-[#8A687B]">
                <button
                  type="button"
                  title="Attach file (Text or Image)"
                  onClick={() => showToast('Attachment ready. You can ask queries referencing any topics.')}
                  className="p-1 sm:p-1.5 rounded-full hover:bg-[#FFE8F1] hover:text-[#402735] transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  title="Voice dictation"
                  onClick={() => showToast('Voice dictation active in supported browsers')}
                  className="p-1 sm:p-1.5 rounded-full hover:bg-[#FFE8F1] hover:text-[#402735] transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Input Textarea & Send button */}
            <div className="flex items-end gap-1.5 sm:gap-2.5">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={
                  composerMode === 'research'
                    ? 'Enter deep research topic (press Enter to run)...'
                    : composerMode === 'image'
                    ? 'Describe image to generate (e.g. blush rose vanity)...'
                    : 'Ask Ranuu anything... (Shift+Enter for new line)'
                }
                className="w-full bg-transparent resize-none text-[#402735] placeholder:text-[#8A687B] text-xs sm:text-sm focus:outline-none leading-relaxed p-1 min-h-[38px] sm:min-h-[44px]"
              />

              {isGenerating ? (
                <button
                  type="button"
                  onClick={onStopGeneration}
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-[#BA1A1A] hover:bg-[#93000A] text-white flex items-center justify-center shadow-md active:scale-95 transition-all flex-shrink-0"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md transition-all flex-shrink-0 ${
                    inputText.trim()
                      ? 'bg-gradient-to-br from-[#F4B6C2] to-[#FEB4D4] text-[#74454F] hover:opacity-95 active:scale-95'
                      : 'bg-[#FFF0F5] text-[#8A687B] cursor-not-allowed border border-[#F1DCE4]'
                  }`}
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Footer sync indicator */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#8A687B] pt-0.5">
              <span className="hidden sm:inline">Enter to send · Shift+Enter for new line</span>
              <span className="sm:hidden text-[9px]">Enter to send</span>
              <div className="flex items-center gap-1 text-[#874C67]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C76D8A]"></span>
                <span className="text-[10px]">Private · Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

