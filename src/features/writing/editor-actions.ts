import type { EditorView } from "@codemirror/view";

export type SnippetMode = "wrap" | "line" | "block";

export interface Snippet {
  prefix: string;
  suffix: string;
  placeholder: string;
  mode?: SnippetMode;
}

export function applySnippet(view: EditorView, snippet: Snippet) {
  const { from, to } = view.state.selection.main;
  const selected = view.state.doc.sliceString(from, to);
  const content = selected || snippet.placeholder;
  const mode = snippet.mode ?? "wrap";

  if (mode === "line") {
    const line = view.state.doc.lineAt(from);
    const lineText = line.text;
    if (lineText.startsWith(snippet.prefix)) {
      view.dispatch({
        changes: { from: line.from, to: line.from + snippet.prefix.length, insert: "" },
      });
      return;
    }
    view.dispatch({
      changes: { from: line.from, insert: snippet.prefix + content },
      selection: {
        anchor: line.from + snippet.prefix.length,
        head: line.from + snippet.prefix.length + content.length,
      },
    });
    view.focus();
    return;
  }

  if (mode === "block") {
    const line = view.state.doc.lineAt(from);
    const before = line.text.trim() ? "\n" : "";
    const insert = `${before}${snippet.prefix}${content}${snippet.suffix}\n`;
    view.dispatch({
      changes: { from: line.to, insert },
      selection: {
        anchor: line.to + before.length + snippet.prefix.length,
        head: line.to + before.length + snippet.prefix.length + content.length,
      },
    });
    view.focus();
    return;
  }

  const insert = `${snippet.prefix}${content}${snippet.suffix}`;
  const start = from + snippet.prefix.length;
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: start, head: start + content.length },
  });
  view.focus();
}

export function replaceDocument(view: EditorView, value: string) {
  const current = view.state.doc.toString();
  if (current === value) return;
  view.dispatch({
    changes: { from: 0, to: current.length, insert: value },
  });
}
