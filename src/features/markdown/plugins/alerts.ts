import type { MarkdownIt, StateCore, Token } from "markdown-it";

type AlertKind = "note" | "tip" | "important" | "warning" | "caution";

interface AlertConfig {
  kind: AlertKind;
  label: string;
  icon: string;
}

const configs: Record<string, AlertConfig> = {
  NOTE: { kind: "note", label: "备注", icon: "ℹ️" },
  TIP: { kind: "tip", label: "提示", icon: "💡" },
  IMPORTANT: { kind: "important", label: "重要", icon: "📌" },
  WARNING: { kind: "warning", label: "警告", icon: "⚠️" },
  CAUTION: { kind: "caution", label: "危险", icon: "🚨" },
};

const alertPattern = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/i;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function readAlert(content: string) {
  const match = content.match(alertPattern);
  if (!match) return null;
  const config = configs[match[1].toUpperCase()];
  if (!config) return null;
  return { config, rest: content.slice(match[0].length) };
}

function findFirstBreak(children: Token[]): number {
  return children.findIndex(
    (token) => token.type === "softbreak" || token.type === "hardbreak",
  );
}

function transformTokens(state: StateCore) {
  const tokens = state.tokens;

  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].type !== "blockquote_open") continue;

    let closeIndex = -1;
    let depth = 1;
    for (let cursor = index + 1; cursor < tokens.length; cursor += 1) {
      if (tokens[cursor].type === "blockquote_open") depth += 1;
      if (tokens[cursor].type === "blockquote_close") {
        depth -= 1;
        if (depth === 0) {
          closeIndex = cursor;
          break;
        }
      }
    }
    if (closeIndex === -1) continue;

    let paragraphIndex = -1;
    let inlineIndex = -1;
    for (let cursor = index + 1; cursor < closeIndex; cursor += 1) {
      if (tokens[cursor].type === "paragraph_open" && paragraphIndex === -1) {
        paragraphIndex = cursor;
      }
      if (tokens[cursor].type === "inline" && tokens[cursor].content) {
        inlineIndex = cursor;
        break;
      }
    }
    if (inlineIndex === -1) continue;

    const inline = tokens[inlineIndex];
    const alert = readAlert(inline.content);
    if (!alert) continue;

    let title: string | undefined;
    let body = alert.rest;
    const trimmed = alert.rest.trim();
    if (trimmed) {
      const newlineIndex = alert.rest.indexOf("\n");
      if (newlineIndex === -1) {
        title = trimmed;
        body = "";
      } else {
        const firstLine = alert.rest.slice(0, newlineIndex).trim();
        if (firstLine) title = firstLine;
        body = alert.rest.slice(newlineIndex + 1);
      }
    }

    const open = tokens[index];
    open.type = "callout_open";
    open.tag = "section";
    open.attrSet("class", `callout callout-${alert.config.kind}`);

    tokens[closeIndex].type = "callout_close";
    tokens[closeIndex].tag = "section";
    inline.content = body;

    let inserted = false;
    for (let cursor = index + 1; cursor < closeIndex; cursor += 1) {
      if (tokens[cursor].type !== "paragraph_open") continue;

      const titleOpen = new state.Token("callout_title_open", "div", 1);
      titleOpen.attrSet("class", "callout-title");

      const titleContent = new state.Token("html_inline", "", 0);
      const label = title ? escapeHtml(title) : alert.config.label;
      titleContent.content = `<span class="callout-icon">${alert.config.icon}</span><span>${label}</span>`;

      const titleClose = new state.Token("callout_title_close", "div", -1);
      tokens.splice(cursor, 0, titleOpen, titleContent, titleClose);
      closeIndex += 3;
      inserted = true;
      break;
    }

    if (inline.children?.length) {
      if (!body.trim()) {
        inline.children = [];
        const offset = inserted ? 3 : 0;
        const paragraph = paragraphIndex + offset;
        if (paragraphIndex !== -1 && tokens[paragraph + 3]?.type === "paragraph_close") {
          tokens.splice(paragraph, 3);
        }
      } else if (title) {
        const breakIndex = findFirstBreak(inline.children);
        if (breakIndex !== -1) {
          inline.children.splice(0, breakIndex + 1);
        } else {
          const firstChild = inline.children[0];
          if (firstChild.type === "text") {
            const childAlert = readAlert(firstChild.content);
            if (childAlert) firstChild.content = childAlert.rest;
          }
        }
      } else {
        const firstChild = inline.children[0];
        if (firstChild.type === "text") {
          const childAlert = readAlert(firstChild.content);
          if (childAlert) firstChild.content = childAlert.rest;
        }
      }
    }
  }
}

export default function alertsPlugin(md: MarkdownIt) {
  md.core.ruler.push("alerts", transformTokens);

  md.renderer.rules.callout_open = (tokens: Token[], index: number) =>
    `<section class="${tokens[index].attrGet("class") || "callout"}">\n`;
  md.renderer.rules.callout_close = () => "</section>\n";
  md.renderer.rules.callout_title_open = (tokens: Token[], index: number) =>
    `<div class="${tokens[index].attrGet("class") || "callout-title"}">`;
  md.renderer.rules.callout_title_close = () => "</div>\n";
}
