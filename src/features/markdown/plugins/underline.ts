import type { MarkdownIt, StateInline } from "markdown-it";

const marker = "+".charCodeAt(0);

const isWhitespace = (value: string | undefined) => !value || /\s/.test(value);

function underlineInline(state: StateInline, silent: boolean): boolean {
  const start = state.pos;

  if (state.src.charCodeAt(start) !== marker) return false;
  if (start + 1 >= state.posMax) return false;
  if (state.src.charCodeAt(start + 1) !== marker) return false;
  if (start + 2 < state.posMax && state.src.charCodeAt(start + 2) === marker) {
    return false;
  }
  if (start > 0 && state.src.charCodeAt(start - 1) === 0x5c) return false;
  if (isWhitespace(state.src.charAt(start + 2))) return false;
  if (silent) return false;

  let cursor = start + 2;
  while (cursor + 1 < state.posMax) {
    const isClosing =
      state.src.charCodeAt(cursor) === marker &&
      state.src.charCodeAt(cursor + 1) === marker;

    if (!isClosing) {
      cursor += 1;
      continue;
    }

    if (cursor > 0 && state.src.charCodeAt(cursor - 1) === 0x5c) {
      cursor += 1;
      continue;
    }
    if (isWhitespace(state.src.charAt(cursor - 1))) {
      cursor += 1;
      continue;
    }

    const content = state.src.slice(start + 2, cursor);
    if (!content) return false;

    state.pos = cursor + 2;
    state.push("underline_open", "u", 1).markup = "++";

    const nested: StateInline["tokens"] = [];
    state.md.inline.parse(content, state.md, state.env, nested);
    state.tokens.push(...nested);

    state.push("underline_close", "u", -1).markup = "++";
    return true;
  }

  return false;
}

export default function underlinePlugin(md: MarkdownIt) {
  md.inline.ruler.before("emphasis", "underline", underlineInline);
}
