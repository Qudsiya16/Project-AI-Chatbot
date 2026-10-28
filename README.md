# Ranuu AI — Your Personal AI Assistant

An elegant, modern personal AI web application built with a signature blush-pink aesthetic, powered by Google GenAI free-tier models (`gemini-3.8-flash`, `gemini-3.1-flash-lite`, `gemini-4-argon`), live Google Search grounding, an AI Image Studio, and full client-side CRUD persistence with private browser local storage.

---

## ✨ Key Capabilities

1. **Blush Radiance Aesthetic:**
   - Custom palette: Blush Pink (`#F4B6C2`), Soft Rose (`#E8A0BF`), Dusty Rose Accent (`#C76D8A`), and Deep Plum Typography (`#402735`).
   - Frosted glassmorphism, responsive navigation drawers, and fluid typography in **Plus Jakarta Sans**.

2. **AI Chat & Streaming Intelligence:**
   - Real-time token streaming with cancelation (`AbortController`).
   - Multiline support (Enter to send, Shift+Enter for newline).
   - In-line prompt editing and regeneration.
   - Rich Markdown formatting with code syntax wrappers, one-click code copy, tables, blockquotes, and lists.
   - Message upvoting, downvoting, and bookmarks.

3. **Google Search Grounded Research:**
   - Real-time web citations and source links via Google Search grounding.
   - Structured research reports with Executive Summaries, Key Findings, and Comparative Matrices.
   - One-click transfer of research findings into active chat.

4. **AI Image Studio:**
   - Text-to-image generator with aspect ratios (`1:1`, `16:9`, `3:4`, `4:3`) and artistic styles (*Botanical Watercolor*, *Editorial Studio*, *Photorealistic*, *3D Render*, *Anime*).
   - Negative prompt support and high-resolution fullscreen lightbox.
   - One-click image download and prompt copy.

5. **Full LocalStorage CRUD & Data Privacy:**
   - **Create:** New chats, messages, custom prompt templates, saved images.
   - **Read:** Grouped chronologically (*Today*, *Yesterday*, *Previous 7 Days*), debounced global search.
   - **Update:** Rename conversations, edit previous prompts, pin favorites, custom AI instructions.
   - **Delete:** Individual messages, conversations, and clear history with confirmation safeguards.
   - **Backup:** Export/Import entire chat archives in structured JSON or clean Markdown.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API Key in `.env`:
```env
GEMINI_API_KEY="your_api_key_here"
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with the Express API and Vite middleware.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🛡️ Security
All AI model invocations occur server-side inside `server.ts` via `@google/genai`. API keys are never bundled into client scripts or stored in browser local storage.
