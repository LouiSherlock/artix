import { linksToFootnotes, renderMarkdown } from "@/features/markdown/parser";
import { katexCss } from "@/features/markdown/katex-css";
import { nightCss, themeCss } from "@/features/typography/presets";

const inlineKatexCss = katexCss
  .replace(/@font-face\{[^}]*\}/g, "")
  .replace(/body\{counter-reset:[^}]*\}/g, "");

export interface RenderOptions {
  themeId: string;
  linkFootnotes?: boolean;
}

export function renderArticleBody(markdown: string, options: RenderOptions) {
  const html = renderMarkdown(markdown);
  return options.linkFootnotes ? linksToFootnotes(html) : html;
}

export function wrapArticle(html: string): string {
  return `<section id="artix">${html}</section>`;
}

export function articleCss(
  themeId: string,
  includeKatex = false,
  dark = false,
) {
  const css = `${themeCss(themeId)}${dark ? nightCss(themeId) : ""}`;
  return includeKatex ? `${css}\n${inlineKatexCss}` : css;
}

export async function inlineArticleStyles(html: string, css: string) {
  const juiceModule = await import("juice");
  const juice = juiceModule.default ?? juiceModule;
  return juice.inlineContent(html, css, {
    inlinePseudoElements: true,
    preserveImportant: true,
    removeStyleTags: true,
  });
}
