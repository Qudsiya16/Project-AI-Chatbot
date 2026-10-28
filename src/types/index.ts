export type TabMode = 'chat' | 'research' | 'studio' | 'prompts';

export interface SourceCitation {
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: SourceCitation[];
  bookmarked?: boolean;
  upvoted?: boolean;
  downvoted?: boolean;
  tokenCount?: number;
  modelUsed?: string;
}

export interface Conversation {
  id: string;
  title: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  messages: ChatMessage[];
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  timestamp: string;
  favorite?: boolean;
  provider?: string;
  seed?: number;
}

export interface SavedPrompt {
  id: string;
  title: string;
  category: 'Strategy' | 'Engineering' | 'Intelligence' | 'Visual Studio' | 'Personal';
  prompt: string;
  createdAt: string;
}

export interface AppSettings {
  userName: string;
  userEmail: string;
  activeModel: string;
  temperature: number;
  fontSize: 'sm' | 'md' | 'lg';
  chatDensity: 'compact' | 'comfortable';
  customInstructions: string;
  enableWebSearch: boolean;
  enableStream: boolean;
  hfToken?: string;
  pollenKey?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'Free Tier' | 'Pro Subscriber';
}
