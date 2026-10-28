import React, { useState, useEffect, useRef } from 'react';
import {
  Conversation,
  ChatMessage,
  GeneratedImage,
  SavedPrompt,
  AppSettings,
  TabMode,
  UserProfile,
} from './types';
import {
  loadConversations,
  saveConversations,
  loadActiveConversationId,
  saveActiveConversationId,
  loadImages,
  saveImages,
  loadPrompts,
  savePrompts,
  loadSettings,
  saveSettings,
  loadCurrentUser,
  saveCurrentUser,
  DEFAULT_SETTINGS,
} from './lib/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { ResearchView } from './components/ResearchView';
import { ImageStudioView } from './components/ImageStudioView';
import { PromptsView } from './components/PromptsView';
import { SettingsModal } from './components/SettingsModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { HelpModal } from './components/HelpModal';
import { AuthModal } from './components/AuthModal';
import { ToastProvider, useToast } from './components/Toast';

function AppContent() {
  const { showToast } = useToast();

  // Storage states
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>(loadActiveConversationId);
  const [images, setImages] = useState<GeneratedImage[]>(loadImages);
  const [prompts, setPrompts] = useState<SavedPrompt[]>(loadPrompts);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(loadCurrentUser);

  // UI state
  const [activeTab, setActiveTab] = useState<TabMode>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [studioPrompt, setStudioPrompt] = useState('');

  // Confirmation dialog state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    saveActiveConversationId(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    saveImages(images);
  }, [images]);

  useEffect(() => {
    savePrompts(prompts);
  }, [prompts]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Current active conversation
  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0] || {
      id: 'default',
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

  // --- CRUD Operations on Conversations ---

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: 'conv-' + Date.now(),
      title: 'New Conversation',
      category: 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveTab('chat');
    showToast('Started a fresh conversation');
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c
      )
    );
    showToast('Conversation renamed');
  };

  const handleTogglePinConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      )
    );
  };

  const handleDeleteConversation = (id: string) => {
    const target = conversations.find((c) => c.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Conversation?',
      description: `Are you sure you want to delete "${target?.title || 'this chat'}"? This action cannot be undone.`,
      onConfirm: () => {
        setConversations((prev) => {
          const updated = prev.filter((c) => c.id !== id);
          if (activeConversationId === id) {
            setActiveConversationId(updated[0]?.id || '');
          }
          return updated;
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Conversation deleted');
      },
    });
  };

  const handleClearConversation = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Conversation Messages?',
      description: 'This will remove all messages from the current conversation.',
      onConfirm: () => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId ? { ...c, messages: [] } : c
          )
        );
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Chat session cleared');
      },
    });
  };

  const handleClearAllHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Local History?',
      description: 'This will purge all conversations from your browser localStorage. Be sure to export your backups first!',
      onConfirm: () => {
        const fresh: Conversation = {
          id: 'conv-' + Date.now(),
          title: 'Welcome to Ranuu AI',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        setConversations([fresh]);
        setActiveConversationId(fresh.id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setIsSettingsOpen(false);
        showToast('All local chat history reset');
      },
    });
  };

  // --- Message Interactions & Streaming ---

  const handleSendMessage = async (text: string, enableSearch: boolean) => {
    if (isGenerating) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Auto-update conversation title if it's the first message
    const isFirstMessage = activeConversation.messages.length === 0;
    const updatedTitle = isFirstMessage
      ? text.length > 36 ? text.substring(0, 36) + '...' : text
      : activeConversation.title;

    const updatedMessages = [...activeConversation.messages, userMsg];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              title: updatedTitle,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages,
            }
          : c
      )
    );

    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Create placeholder assistant message
    const assistantMsgId = 'msg-ai-' + Date.now();
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: settings.activeModel,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, assistantMsg] }
          : c
      )
    );

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages,
          model: settings.activeModel,
          systemInstruction: settings.customInstructions,
          temperature: settings.temperature,
          enableSearch,
          stream: settings.enableStream,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      if (settings.enableStream && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let sources: any[] = [];
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Retain the last incomplete fragment in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                accumulatedText = parsed.error;
              } else if (parsed.text) {
                accumulatedText += parsed.text;
              }
              if (parsed.sources && parsed.sources.length > 0) {
                sources = parsed.sources;
              }

              // Update assistant message state
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === activeConversationId
                    ? {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantMsgId
                            ? {
                                ...m,
                                content: accumulatedText,
                                sources: sources.length > 0 ? sources : m.sources,
                                tokenCount: Math.max(1, Math.round(accumulatedText.length / 4)),
                              }
                            : m
                        ),
                      }
                    : c
                )
              );
            } catch (parseErr) {
              // Non-JSON SSE line or partial
            }
          }
        }

        // Final check: if text is empty after stream finishes
        if (!accumulatedText.trim()) {
          accumulatedText = 'I received your inquiry. Please click regenerate to reload this response.';
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            content: accumulatedText,
                            tokenCount: Math.max(1, Math.round(accumulatedText.length / 4)),
                          }
                        : m
                    ),
                  }
                : c
            )
          );
        }
      } else {
        const result = await response.json();
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: result.content, sources: result.sources }
                      : m
                  ),
                }
              : c
          )
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        showToast('Generation cancelled');
      } else {
        const fallbackNotice = `\n\n*(Note: ${err.message || 'Error communicating with AI service. You can retry with the regenerate button.'})*`;
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content:
                            m.content ||
                            'I encountered a temporary connection issue. Please check your network or try regenerating with the refresh button below.' +
                              fallbackNotice,
                        }
                      : m
                  ),
                }
              : c
          )
        );
        showToast(err.message || 'Generation error', 'error');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  const handleRegenerateResponse = () => {
    const msgs = activeConversation.messages;
    if (msgs.length === 0) return;

    // Find the last user message
    let lastUserIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;
    const lastUserText = msgs[lastUserIndex].content;

    // Truncate messages up to the user message
    const trimmed = msgs.slice(0, lastUserIndex);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId ? { ...c, messages: trimmed } : c
      )
    );

    handleSendMessage(lastUserText, settings.enableWebSearch);
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    const msgs = activeConversation.messages;
    const index = msgs.findIndex((m) => m.id === messageId);
    if (index === -1) return;

    // Slice messages up to this point and resend
    const trimmed = msgs.slice(0, index);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId ? { ...c, messages: trimmed } : c
      )
    );

    handleSendMessage(newText, settings.enableWebSearch);
  };

  const handleDeleteMessage = (messageId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) }
          : c
      )
    );
    showToast('Message deleted');
  };

  const handleToggleBookmark = (messageId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, bookmarked: !m.bookmarked } : m
              ),
            }
          : c
      )
    );
    showToast('Bookmark updated');
  };

  const handleToggleVote = (messageId: string, type: 'up' | 'down') => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: c.messages.map((m) => {
                if (m.id !== messageId) return m;
                if (type === 'up') {
                  return { ...m, upvoted: !m.upvoted, downvoted: false };
                } else {
                  return { ...m, downvoted: !m.downvoted, upvoted: false };
                }
              }),
            }
          : c
      )
    );
  };

  // --- Image Studio CRUD ---
  const handleSaveNewImage = (img: GeneratedImage) => {
    setImages((prev) => [img, ...prev]);
  };

  const handleDeleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    showToast('Image removed from gallery');
  };

  const handleToggleImageFavorite = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, favorite: !img.favorite } : img
      )
    );
  };

  // --- Prompts CRUD ---
  const handleSavePrompt = (newPrompt: SavedPrompt) => {
    setPrompts((prev) => [newPrompt, ...prev]);
  };

  const handleUpdatePrompt = (updated: SavedPrompt) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    showToast('Prompt removed from library');
  };

  const handleUsePromptInChat = (text: string) => {
    setActiveTab('chat');
    handleSendMessage(text, settings.enableWebSearch);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    showToast('Signed out of Ranuu AI');
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    setSettings((prev) => ({
      ...prev,
      userName: user.name,
      userEmail: user.email,
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFF7FA]">
      {/* Sidebar (Collapsible via top button on desktop and mobile) */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={handleNewChat}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onTogglePinConversation={handleTogglePinConversation}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        settings={settings}
        currentUser={currentUser}
        onOpenAuth={(m = 'login') => {
          setAuthMode(m);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-200 ${
        isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
      }`}>
        {/* Header with Top Toggle Button and Auth */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          activeConversationTitle={activeConversation.title}
          settings={settings}
          onChangeModel={(m) => setSettings({ ...settings, activeModel: m })}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          currentUser={currentUser}
          onOpenAuth={(m = 'login') => {
            setAuthMode(m);
            setIsAuthOpen(true);
          }}
          onLogout={handleLogout}
        />

        {/* Dynamic Tab Views */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'chat' && (
            <ChatView
              conversation={activeConversation}
              onSendMessage={handleSendMessage}
              onRegenerateResponse={handleRegenerateResponse}
              onEditMessage={handleEditMessage}
              onClearConversation={handleClearConversation}
              onRenameConversation={(newTitle) =>
                handleRenameConversation(activeConversation.id, newTitle)
              }
              onDeleteMessage={handleDeleteMessage}
              onToggleBookmark={handleToggleBookmark}
              onToggleVote={handleToggleVote}
              isGenerating={isGenerating}
              onStopGeneration={handleStopGeneration}
              settings={settings}
              onSwitchTab={setActiveTab}
              onPopulateStudioPrompt={(p) => setStudioPrompt(p)}
            />
          )}

          {activeTab === 'research' && (
            <ResearchView
              onSendToChat={(report) => {
                setActiveTab('chat');
                handleSendMessage(`Synthesize the following research dossier into strategic action steps:\n\n${report}`, false);
              }}
            />
          )}

          {activeTab === 'studio' && (
            <ImageStudioView
              images={images}
              onSaveNewImage={handleSaveNewImage}
              onDeleteImage={handleDeleteImage}
              onToggleFavorite={handleToggleImageFavorite}
              initialPrompt={studioPrompt}
              settings={settings}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'prompts' && (
            <PromptsView
              prompts={prompts}
              onSavePrompt={handleSavePrompt}
              onUpdatePrompt={handleUpdatePrompt}
              onDeletePrompt={handleDeletePrompt}
              onUsePromptInChat={handleUsePromptInChat}
            />
          )}
        </main>
      </div>

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        conversations={conversations}
        onImportConversations={(imported) => {
          setConversations(imported);
          if (imported.length > 0) setActiveConversationId(imported[0].id);
        }}
        onClearAllHistory={handleClearAllHistory}
      />

      {/* Help & Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
