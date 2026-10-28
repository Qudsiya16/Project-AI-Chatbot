import React, { useState } from 'react';
import { marked } from 'marked';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Extract code snippets to give them dedicated copy buttons and pretty framing
  const renderedHtml = React.useMemo(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    return marked.parse(content);
  }, [content]);

  // Hook copy code button listeners within rendered content
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const preBlocks = containerRef.current.querySelectorAll('pre');

    preBlocks.forEach((pre, index) => {
      // Check if header already added
      if (pre.parentNode && (pre.parentNode as HTMLElement).classList.contains('code-block-wrapper')) {
        return;
      }

      const codeElement = pre.querySelector('code');
      const rawCode = codeElement ? codeElement.innerText : pre.innerText;

      // Extract class like language-typescript
      const langClass = codeElement?.className || '';
      const langMatch = langClass.match(/language-(\w+)/);
      const language = langMatch ? langMatch[1] : 'code';

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper my-3 rounded-2xl overflow-hidden border border-[#514346]/20 bg-[#2B1421] text-[#FFECF3] shadow-md';

      const header = document.createElement('div');
      header.className = 'flex items-center justify-between px-4 py-2 bg-[#3A1F2E] border-b border-[#514346]/30 text-xs text-[#FFD8EA] font-mono font-medium';

      const langSpan = document.createElement('span');
      langSpan.textContent = language.toUpperCase();
      langSpan.className = 'text-[#F4B6C2] tracking-wider';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4E2B3E] hover:bg-[#663A50] text-[#FFECF3] transition-colors text-xs font-sans';
      copyBtn.innerHTML = `<span>Copy Code</span>`;

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(rawCode).then(() => {
          copyBtn.innerHTML = `<span>Copied!</span>`;
          copyBtn.classList.add('text-[#F4B6C2]');
          setTimeout(() => {
            copyBtn.innerHTML = `<span>Copy Code</span>`;
            copyBtn.classList.remove('text-[#F4B6C2]');
          }, 2000);
        });
      };

      header.appendChild(langSpan);
      header.appendChild(copyBtn);

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      pre.className = 'p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-[#FFD8EA] m-0';
    });
  }, [renderedHtml]);

  return (
    <div
      ref={containerRef}
      className="markdown-body text-[#402735] leading-relaxed space-y-3 prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-table:my-3"
      dangerouslySetInnerHTML={{ __html: renderedHtml as string }}
    />
  );
};
