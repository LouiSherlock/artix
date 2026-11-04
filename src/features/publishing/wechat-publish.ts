import { copyRichHtml } from "./clipboard";
import { normalizeForWechat } from "./dom-normalizer";
import {
  articleCss,
  inlineArticleStyles,
  renderArticleBody,
  wrapArticle,
} from "./html-document";
import { convertMathToSvg } from "./wechat-math";

export interface PublishOptions {
  themeId: string;
  linkFootnotes: boolean;
  tableWrap: boolean;
}

export interface MountOptions extends PublishOptions {
  width: number;
  inline: boolean;
  visible?: boolean;
  dark?: boolean;
  /** 把公式转成自包含 SVG，公众号编辑器会清洗 KaTeX 依赖的布局样式。 */
  mathSvg?: boolean;
}

export async function mountArticle(
  markdown: string,
  options: MountOptions,
): Promise<HTMLDivElement> {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-100000px";
  host.style.top = "0";
  host.style.zIndex = "-1";
  host.style.width = `${options.width}px`;
  host.style.background = options.dark ? "#17181c" : "#ffffff";
  host.style.color = options.dark ? "#d8dbe2" : "#000000";
  host.style.colorScheme = options.dark ? "dark" : "light";
  host.style.pointerEvents = "none";
  if (!options.visible) host.style.opacity = "0";
  document.body.appendChild(host);

  try {
    const body = renderArticleBody(markdown, {
      themeId: options.themeId,
      linkFootnotes: options.linkFootnotes,
    });
    const wrapped = wrapArticle(body);
    const css = articleCss(options.themeId, true, options.dark);
    host.innerHTML = options.inline
      ? await inlineArticleStyles(wrapped, css)
      : wrapped;

    if (options.inline && options.mathSvg) {
      const math = await convertMathToSvg(host);
      if (math.skipped) {
        console.warn("[artix] MathJax 未能加载，公式将继续使用 KaTeX 输出。");
      } else if (math.failed > 0) {
        console.warn(
          `[artix] ${math.failed}/${math.total} 个公式未能转成 SVG，已退回 LaTeX 原文。`,
        );
      }
    }

    normalizeForWechat(host, { tableWrap: options.tableWrap });
    return host;
  } catch (error) {
    host.remove();
    throw error;
  }
}

export async function publishToWechat(
  markdown: string,
  options: PublishOptions,
): Promise<void> {
  const host = await mountArticle(markdown, {
    ...options,
    width: 760,
    inline: true,
    mathSvg: true,
  });

  try {
    const copied = await copyRichHtml(host);
    if (!copied) {
      throw new Error("浏览器拒绝了剪贴板写入，请检查站点权限或改用 HTTPS。");
    }
  } finally {
    host.remove();
  }
}

export function copyHtmlSource(markdown: string, linkFootnotes: boolean): string {
  const body = renderArticleBody(markdown, {
    themeId: "ink",
    linkFootnotes,
  });
  const host = document.createElement("div");
  host.innerHTML = body;

  host.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => {
    const emoji = document.createElement("span");
    emoji.textContent = input.checked ? "✅ " : "⬜ ";
    input.replaceWith(emoji);
  });

  host.querySelectorAll<HTMLElement>("*").forEach((element) => {
    Array.from(element.attributes)
      .filter(
        (attribute) =>
          attribute.name.startsWith("data-") ||
          attribute.name.startsWith("on") ||
          attribute.name === "id",
      )
      .forEach((attribute) => element.removeAttribute(attribute.name));
  });

  return host.innerHTML;
}
