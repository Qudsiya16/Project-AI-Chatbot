import { Conversation, GeneratedImage, SavedPrompt, AppSettings } from '../types';

const CONVERSATIONS_KEY = 'ranuu_conversations_v1';
const ACTIVE_CONV_KEY = 'ranuu_active_conversation_id';
const IMAGES_KEY = 'ranuu_images_v1';
const PROMPTS_KEY = 'ranuu_prompts_v1';
const SETTINGS_KEY = 'ranuu_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Elena Vance',
  userEmail: 'akqhs2511@gmail.com',
  activeModel: 'gemini-3.8-flash',
  temperature: 0.7,
  fontSize: 'md',
  chatDensity: 'comfortable',
  customInstructions: 'You are Ranuu AI, a friendly, modern, and intelligent AI companion with a blush-pink aesthetic. Present answers with elegance, clear hierarchy, and practical insights.',
  enableWebSearch: true,
  enableStream: true,
};

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-creative-direction',
    title: 'Creative Direction & Visual Palette',
    category: 'Marketing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    isPinned: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Can you draft a launch strategy for an artisanal blush skincare collection named "Roseè Essence"? Include target personas and a launch timeline.',
        timestamp: '10:42 AM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `Bonjour Elena! I would be delighted to shape the world of **Roseè Essence**. Below is a graceful, multi-tier brand strategy infused with botanical minimalism and high-touch audience appeal.

### 🌸 1. Brand Identity & Value Proposition
Roseè Essence is crafted at the intersection of fermented Bulgarian damascena rose extract and prebiotic barrier support. It positions skincare not merely as maintenance, but as an intentional morning sanctuary ritual.

#### Target Personas
* **Aria, 24 — Eco-conscious Gen Z**
  Prioritizes refillable fluted glass packaging, carbon-neutral harvesting, and candid dermatological transparency on TikTok & Lemon8.
  *Core Hook: Zero-microplastic dew formula*
* **Clara, 33 — Luxury Minimalist**
  Values sensory luxury, tactile unboxing rituals, non-greasy day absorption, and quiet vanity prestige.
  *Core Hook: Clinical hydration in 3 drops*

### 🗓️ 4-Week Launch Trajectory
| Phase | Timeline | Key Deliverables | Primary Channel |
| :--- | :--- | :--- | :--- |
| **The Bloom Seeding** | Wk 1 – Wk 2 | Custom PR porcelain vials to 50 conscious tastemakers | Direct Gifting |
| **Petal Soft Drops** | Wk 3 | VIP early-access email list with 48h limited batch reservation | Klaviyo / SMS |
| **Grand Vernissage** | Wk 4 | Omnichannel public reveal + Interactive shade matching filter | IG Reels / Web |

\`\`\`typescript
// lib/campaigns/rosee-launch.ts
export const roseeLaunchCampaign = {
  id: "rosee-essence-v1",
  title: "Roseè Essence: The Morning Petal",
  discountTiers: [
    { code: "PETALVIP", discountPercent: 20, minSpend: 65.00 },
    { code: "DEWDUO", giftItemSku: "SKU-MIST-50ML", minSpend: 95.00 }
  ],
  urgencyBanner: {
    text: "Artisanal small batch: 420 units hand-bottled for launch.",
    badgeColor: "#C76D8A",
    autoExpireHours: 48
  }
} as const;
\`\`\``,
        timestamp: '10:43 AM',
        tokenCount: 680,
        modelUsed: 'gemini-3.8-flash',
        upvoted: true,
      },
      {
        id: 'msg-3',
        role: 'user',
        content: "Let's refine the Instagram caption sequence and add 3 aesthetic visual ideas.",
        timestamp: '10:44 AM',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `Here are 3 refined visual set-pieces accompanied by poetic micro-copy crafted for high conversion and aspirational saves:

### 📸 3 Refined Visual Concepts
1. **Concept 01: Dew on Rose Quartz**
   *Visual:* Frosted glass flacon resting over soft millennial pink raw mineral quartz, back-lit with crisp golden morning sunlight.
   *Caption Hook:* "Bottled at daybreak. Drink the glow before the city wakes."

2. **Concept 02: The Milk & Rose Swirl**
   *Visual:* High-speed macro capture of a single drop of blush emulsion dispersing inside pure oat-water milk.
   *Caption Hook:* "Weightless hydration that sinks in before your first breath out."

3. **Concept 03: Fluted Silk Reflection**
   *Visual:* Blush glass serum bottle nestled gently in pleated washed silk ribbon, draped across a Parisian marble mantle.
   *Caption Hook:* "Skincare designed to grace your morning vanity like fine jewelry."

💡 *Tip: Head over to Image Studio to render these exact aesthetic frames with Ranuu's Blush Harmonizer!*`,
        timestamp: '10:45 AM',
        tokenCount: 420,
        modelUsed: 'gemini-3.8-flash',
      },
    ],
  },
  {
    id: 'conv-microbiome',
    title: 'Microbiome Research Synthesis',
    category: 'Research',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    messages: [
      {
        id: 'mb-1',
        role: 'user',
        content: 'Summarize current clinical findings on topical postbiotics for epidermal barrier restoration.',
        timestamp: '08:15 AM',
      },
      {
        id: 'mb-2',
        role: 'assistant',
        content: `### Clinical Overview: Topical Postbiotics in Epidermal Restoration

Recent peer-reviewed trials highlight three primary therapeutic mechanisms:

1. **Short-Chain Fatty Acid (SCFA) Modulation:** Postbiotic ferment filtrates enhance local lipid bilayer synthesis, lowering transepidermal water loss (TEWL) by up to 28% across 14-day trials.
2. **Acid Mantle Stabilization:** Maintains skin surface pH within the optimal 4.7–5.5 range, discouraging opportunistic colonization.
3. **Keratinocyte Tight Junction Integrity:** Up-regulates Claudin-1 and Occludin gene expression in vitro.

#### Key Takeaway
Postbiotics provide predictable shelf-stable bio-actives without requiring live strain viability constraints.`,
        timestamp: '08:16 AM',
        tokenCount: 390,
      },
    ],
  },
  {
    id: 'conv-copywriting',
    title: 'Copywriting for Rose Launch',
    category: 'Marketing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    messages: [
      {
        id: 'cp-1',
        role: 'user',
        content: 'Write five tagline options for a hydrating mist.',
        timestamp: 'Yesterday',
      },
      {
        id: 'cp-2',
        role: 'assistant',
        content: `Here are 5 evocative taglines:
1. *Dawn in a droplet.*
2. *Hydration, whispered in petals.*
3. *Reset your radiance in three gentle mists.*
4. *The morning dew, bottled for your vanity.*
5. *Pure Bulgarian bloom. Zero weight.*`,
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: 'conv-floral-glass',
    title: 'Floral Glass Portraits Mood',
    category: 'Visual Studio',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    messages: [
      {
        id: 'fg-1',
        role: 'user',
        content: 'Generate visual prompt ideas for Victorian conservatory flower displays.',
        timestamp: 'Yesterday',
      },
      {
        id: 'fg-2',
        role: 'assistant',
        content: 'Check the Image Studio gallery! We created an ethereal Victorian glass greenhouse drenched in morning mist and blush climbing roses.',
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: 'conv-silk-sourcing',
    title: 'Sustainable Silk Sourcing',
    category: 'Research',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    messages: [
      {
        id: 'ss-1',
        role: 'user',
        content: 'Compare peace silk (Ahimsa) vs traditional mulberry silk for eco-packaging ribbon.',
        timestamp: '3 days ago',
      },
      {
        id: 'ss-2',
        role: 'assistant',
        content: `### Peace Silk (Ahimsa) vs. Mulberry Silk
* **Ethics:** Ahimsa silk permits the silkworm to emerge naturally from the cocoon before reeling.
* **Texture:** Slightly more textured, matte sheen with organic drape.
* **Brand Story:** Highly resonates with cruelty-free luxury positioning.`,
        timestamp: '3 days ago',
      },
    ],
  },
];

const SEED_PROMPTS: SavedPrompt[] = [
  {
    id: 'prompt-1',
    title: '🌸 Launch Strategy for Organic Beauty',
    category: 'Strategy',
    prompt: 'Create a 30-day go-to-market strategy for an organic blush cosmetics brand. Include VIP seeding, influencer tiers, and social proof milestones.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prompt-2',
    title: '💻 TypeScript API Route with Gemini Free-Tier',
    category: 'Engineering',
    prompt: 'Draft an Express / Next.js TypeScript route handler implementing Google GenAI streaming with error recovery and request cancellation.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prompt-3',
    title: '🔍 Deep Research: 2025 AI UX Trends',
    category: 'Intelligence',
    prompt: 'Synthesize emerging 2025 UX trends in personal AI companions: spatial interfaces, micro-haptics, calm technology, and translucent design systems.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prompt-4',
    title: '🎨 Generate Blush Aesthetic Wallpapers',
    category: 'Visual Studio',
    prompt: 'A sunlit minimalist desk with ceramic tea cup, pastel blush stationery, soft pink wild garden roses in fluted glass vase, natural bokeh, 8k.',
    createdAt: new Date().toISOString(),
  },
];

const SEED_IMAGES: GeneratedImage[] = [
  {
    id: 'img-greenhouse',
    imageUrl: '/assets/aistudio/Image_1_5e4945bb.jpeg',
    prompt: 'A magical Victorian glass greenhouse conservatory with climbing blush roses, morning golden mist, weathered stone pathway, and vintage garden lamp.',
    style: 'Botanical Watercolor',
    aspectRatio: '1:1',
    timestamp: '2 hours ago',
    favorite: true,
  },
  {
    id: 'img-desk',
    imageUrl: '/assets/aistudio/Image_2_3c063c6c.jpeg',
    prompt: 'Minimalist warm morning desk sanctuary with wood laptop stand, pastel blush mechanical keyboard, ceramic pink mug, fresh roses bouquet, warm sunlight.',
    style: 'Editorial Studio',
    aspectRatio: '16:9',
    timestamp: 'Yesterday',
    favorite: true,
  },
];

// Helper to safely load localStorage
export const loadConversations = (): Conversation[] => {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) {
      saveConversations(SEED_CONVERSATIONS);
      return SEED_CONVERSATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CONVERSATIONS;
  } catch (e) {
    console.error('Failed reading conversations from localStorage:', e);
    return SEED_CONVERSATIONS;
  }
};

export const saveConversations = (conversations: Conversation[]) => {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed saving conversations to localStorage:', e);
  }
};

export const loadActiveConversationId = (): string => {
  try {
    const active = localStorage.getItem(ACTIVE_CONV_KEY);
    if (active) return active;
  } catch (e) {}
  return 'conv-creative-direction';
};

export const saveActiveConversationId = (id: string) => {
  try {
    localStorage.setItem(ACTIVE_CONV_KEY, id);
  } catch (e) {}
};

export const loadImages = (): GeneratedImage[] => {
  try {
    const raw = localStorage.getItem(IMAGES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const saveImages = (images: GeneratedImage[]) => {
  try {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  } catch (e) {
    // If quota exceeded due to base64 images, keep the most recent 8 images
    try {
      localStorage.setItem(IMAGES_KEY, JSON.stringify(images.slice(0, 8)));
    } catch (e2) {
      console.warn('LocalStorage quota limit reached for images.');
    }
  }
};

export const loadPrompts = (): SavedPrompt[] => {
  try {
    const raw = localStorage.getItem(PROMPTS_KEY);
    if (!raw) {
      savePrompts(SEED_PROMPTS);
      return SEED_PROMPTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_PROMPTS;
  } catch (e) {
    return SEED_PROMPTS;
  }
};

export const savePrompts = (prompts: SavedPrompt[]) => {
  try {
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  } catch (e) {}
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
};

import { UserProfile } from '../types';

const USER_KEY = 'ranuu_auth_user_v1';

export const DEFAULT_USER: UserProfile = {
  id: 'user-elena-vance',
  name: 'Elena Vance',
  email: 'akqhs2511@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  plan: 'Free Tier',
};

export const loadCurrentUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      saveCurrentUser(DEFAULT_USER);
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USER;
  }
};

export const saveCurrentUser = (user: UserProfile | null) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {}
};
