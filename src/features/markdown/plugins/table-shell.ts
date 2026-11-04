import type { MarkdownIt, StateCore, Token } from "markdown-it";

function wrapTables(state: StateCore) {
  const next: Token[] = [];

  for (const token of state.tokens) {
    if (token.type === "table_open") {
      const open = new state.Token("html_inline", "", 0);
      open.content = '<section class="table-shell">';
      next.push(open, token);
      continue;
    }

    if (token.type === "table_close") {
      const close = new state.Token("html_inline", "", 0);
      close.content = "</section>";
      next.push(token, close);
      continue;
    }

    next.push(token);
  }

  state.tokens = next;
}

export default function tableShellPlugin(md: MarkdownIt) {
  md.core.ruler.push("table-shell", wrapTables);
}
