import katex from "katex";
import type { MarkdownIt, StateBlock, StateInline, Token } from "markdown-it";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeAttribute = (value: string) =>
  escapeHtml(value).replace(/'/g, "&#39;");

function canOpen(state: StateInline, position: number) {
  const next =
    position + 1 <= state.posMax ? state.src.charCodeAt(position + 1) : -1;
  return next !== 0x20 && next !== 0x09;
}

function canClose(state: StateInline, position: number) {
  const previous = position > 0 ? state.src.charCodeAt(position - 1) : -1;
  const next =
    position + 1 <= state.posMax ? state.src.charCodeAt(position + 1) : -1;
  return !(
    previous === 0x20 ||
    previous === 0x09 ||
    (next >= 0x30 && next <= 0x39)
  );
}

function inlineMath(state: StateInline, silent: boolean): boolean {
  if (state.src[state.pos] !== "$") return false;

  if (!canOpen(state, state.pos)) {
    if (!silent) state.pending += "$";
    state.pos += 1;
    return true;
  }

  const start = state.pos + 1;
  let match = start;
  while ((match = state.src.indexOf("$", match)) !== -1) {
    let escapeCursor = match - 1;
    while (state.src[escapeCursor] === "\\") escapeCursor -= 1;
    if ((match - escapeCursor) % 2 === 1) break;
    match += 1;
  }

  if (match === -1) {
    if (!silent) state.pending += "$";
    state.pos = start;
    return true;
  }

  if (match - start === 0) {
    if (!silent) state.pending += "$$";
    state.pos = start + 1;
    return true;
  }

  if (!canClose(state, match)) {
    if (!silent) state.pending += "$";
    state.pos = start;
    return true;
  }

  if (!silent) {
    const token = state.push("math_inline", "math", 0);
    token.markup = "$";
    token.content = state.src.slice(start, match);
  }

  state.pos = match + 1;
  return true;
}

function blockMath(
  state: StateBlock,
  start: number,
  end: number,
  silent: boolean,
): boolean {
  let position = state.bMarks[start] + state.tShift[start];
  const max = state.eMarks[start];

  if (position + 2 > max) return false;
  if (state.src.slice(position, position + 2) !== "$$") return false;

  position += 2;
  let firstLine = state.src.slice(position, max);
  let found = false;
  let line = start;

  if (silent) return true;
  if (firstLine.trim().slice(-2) === "$$") {
    firstLine = firstLine.trim().slice(0, -2);
    found = true;
  }

  let lastLine = "";
  while (!found) {
    line += 1;
    if (line >= end) break;

    position = state.bMarks[line] + state.tShift[line];
    const lineMax = state.eMarks[line];

    if (position < lineMax && state.tShift[line] < state.blkIndent) break;

    if (state.src.slice(position, lineMax).trim().slice(-2) === "$$") {
      const lastPosition = state.src.slice(0, lineMax).lastIndexOf("$$");
      lastLine = state.src.slice(position, lastPosition);
      found = true;
    }
  }

  state.line = line + 1;
  const token = state.push("math_block", "math", 0);
  token.block = true;
  token.content =
    (firstLine && firstLine.trim() ? `${firstLine}\n` : "") +
    state.getLines(start + 1, line, state.tShift[start], true) +
    (lastLine && lastLine.trim() ? lastLine : "");
  token.map = [start, state.line];
  token.markup = "$$";
  return true;
}

function renderMath(source: string, display: boolean): string {
  try {
    const rendered = katex.renderToString(source, {
      displayMode: display,
      throwOnError: false,
      strict: "ignore",
    });
    const tag = display ? "section" : "span";
    const className = display ? "block-equation" : "inline-equation";
    return `<${tag} class="${className}" data-latex="${escapeAttribute(source)}">${rendered}</${tag}>`;
  } catch {
    const tag = display ? "section" : "span";
    const className = display ? "block-equation" : "inline-equation";
    return `<${tag} class="${className}" data-latex="${escapeAttribute(source)}">${escapeHtml(source)}</${tag}>`;
  }
}

export default function mathPlugin(md: MarkdownIt) {
  md.inline.ruler.after("escape", "math_inline", inlineMath);
  md.block.ruler.after("blockquote", "math_block", blockMath, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });

  md.renderer.rules.math_inline = (tokens: Token[], index: number) =>
    renderMath(tokens[index].content, false);
  md.renderer.rules.math_block = (tokens: Token[], index: number) =>
    `${renderMath(tokens[index].content, true)}\n`;
}
