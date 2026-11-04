import MarkdownIt from "markdown-it";
import type { MarkdownIt as MarkdownItInstance } from "markdown-it";
import attrs from "markdown-it-attrs";
import deflist from "markdown-it-deflist";
import { full as emoji } from "markdown-it-emoji";
import implicitFigures from "markdown-it-implicit-figures";
import mark from "markdown-it-mark";
import ruby from "markdown-it-ruby";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import taskLists from "markdown-it-task-lists";
import tableOfContents from "markdown-it-table-of-contents";

import { highlightCode } from "./highlight";
import alertsPlugin from "./plugins/alerts";
import mathPlugin from "./plugins/math";
import tableShellPlugin from "./plugins/table-shell";
import underlinePlugin from "./plugins/underline";

export interface MarkdownOptions {
  includeSourcePositions?: boolean;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function createParser(options: MarkdownOptions = {}) {
  const parser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
    highlight(source, language) {
      const normalized = language.trim().toLowerCase();

      if (normalized === "mermaid") {
        return `<pre class="md-code md-mermaid"><code class="hljs language-mermaid">${escapeHtml(source)}</code></pre>`;
      }

      const highlighted = highlightCode(source, normalized || "bash");
      if (highlighted) {
        return `<pre class="md-code"><code class="hljs">${highlighted}</code></pre>`;
      }

      return `<pre class="md-code"><code class="hljs">${escapeHtml(source)}</code></pre>`;
    },
  });

  parser
    .use(attrs, {
      allowedAttributes: ["class", "id", /^data-[\w-]+$/],
    })
    .use(underlinePlugin)
    .use(tableShellPlugin)
    .use(mathPlugin)
    .use(tableOfContents, {
      transformLink: () => "",
      includeLevel: [2, 3],
      markerPattern: /^\[toc\]/im,
    })
    .use(ruby)
    .use(implicitFigures, { figcaption: true })
    .use(deflist)
    .use(mark)
    .use(sub)
    .use(sup)
    .use(emoji)
    .use(alertsPlugin)
    .use(taskLists, {
      enabled: true,
      label: true,
      labelAfter: true,
    });

  if (options.includeSourcePositions) {
    parser.core.ruler.push("source-position", (state) => {
      const lineStarts: number[] = [0];
      for (let line = 0; line < state.src.length; line += 1) {
        if (state.src[line] === "\n") lineStarts.push(line + 1);
      }

      const toLine = (offset: number) => {
        let low = 0;
        let high = lineStarts.length - 1;
        while (low < high) {
          const middle = Math.ceil((low + high) / 2);
          if (lineStarts[middle] <= offset) low = middle;
          else high = middle - 1;
        }
        return low;
      };

      for (const token of state.tokens) {
        if (!token.map) continue;
        const startOffset = lineStarts[token.map[0]] ?? 0;
        const endLine = Math.min(token.map[1] - 1, lineStarts.length - 1);
        const endOffset = lineStarts[Math.max(0, endLine)] ?? startOffset;
        token.attrSet("data-src-start", String(toLine(startOffset)));
        token.attrSet("data-src-end", String(toLine(endOffset)));
      }
    });
  }

  return parser;
}

let sharedParser: MarkdownItInstance | null = null;

export function getMarkdownParser(): MarkdownItInstance {
  sharedParser ??= createParser();
  return sharedParser;
}

export function renderMarkdown(markdown: string): string {
  return getMarkdownParser().render(markdown);
}

export function renderMarkdownWithSource(markdown: string): string {
  return createParser({ includeSourcePositions: true }).render(markdown);
}

const externalLinkPattern = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;

export function linksToFootnotes(html: string): string {
  const links: Array<{ text: string; url: string }> = [];
  let counter = 1;

  const result = html.replace(
    externalLinkPattern,
    (match, url: string, text: string) => {
      if (url.includes("mp.weixin.qq.com")) return match;
      if (url.startsWith("#")) return match;
      if (!url || url === "url") return text;

      const cleaned = text.trim() || url;
      links.push({ text: cleaned, url });
      return `<span class="footnote-word">${cleaned}</span><sup class="footnote-ref">[${counter++}]</sup>`;
    },
  );

  if (links.length === 0) return result;

  const items = links
    .map(
      (link, index) =>
        `<div class="footnote-item"><span class="footnote-num">[${index + 1}]</span><p>${link.text}<br/>${link.url}</p></div>`,
    )
    .join("");

  return `${result}<h3 class="footnotes-sep"></h3>\n<section class="footnotes">\n${items}\n</section>`;
}
