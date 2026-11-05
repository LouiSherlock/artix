"use client";

import {
  useEffect,
  useRef,
} from "react";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {
  HighlightStyle,
  bracketMatching,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { searchKeymap } from "@codemirror/search";
import { EditorState, Prec } from "@codemirror/state";
import {
  EditorView,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  placeholder,
  rectangularSelection,
} from "@codemirror/view";
import { tags } from "@lezer/highlight";

import { applySnippet, type Snippet } from "@/features/writing/editor-actions";
import { slashCommandSource } from "@/features/writing/slash-commands";
import type { DocumentHistory } from "@/features/writing/document-history";

export interface WritingCanvasHandle {
  insert: (snippet: Snippet) => void;
  undo: () => void;
  redo: () => void;
  focus: () => void;
}

interface WritingCanvasProps {
  value: string;
  history: DocumentHistory;
  onChange: (value: string) => void;
  onScrollRatio?: (ratio: number) => void;
  onApi?: (api: WritingCanvasHandle | null) => void;
}

const markdownHighlight = HighlightStyle.define([
  { tag: tags.heading1, color: "var(--md-syntax-heading)", fontWeight: "700" },
  { tag: tags.heading2, color: "var(--md-syntax-heading)", fontWeight: "700" },
  { tag: tags.heading3, color: "var(--md-syntax-heading)", fontWeight: "600" },
  { tag: tags.heading4, color: "var(--md-syntax-heading)", fontWeight: "600" },
  { tag: tags.heading5, color: "var(--md-syntax-heading)", fontWeight: "600" },
  { tag: tags.heading6, color: "var(--md-syntax-heading)", fontWeight: "600" },
  { tag: tags.strong, fontWeight: "700", color: "var(--md-syntax-strong)" },
  { tag: tags.emphasis, fontStyle: "italic", color: "var(--md-syntax-emphasis)" },
  { tag: tags.strikethrough, textDecoration: "line-through", color: "var(--md-syntax-meta)" },
  { tag: tags.link, color: "var(--md-syntax-link)" },
  { tag: tags.url, color: "var(--md-syntax-link)" },
  { tag: tags.monospace, color: "var(--md-syntax-code)" },
  { tag: tags.quote, color: "var(--md-syntax-meta)", fontStyle: "italic" },
  { tag: tags.list, color: "var(--md-syntax-meta)" },
  { tag: tags.contentSeparator, color: "var(--md-syntax-meta)" },
  { tag: tags.comment, color: "var(--md-syntax-meta)", fontStyle: "italic" },
  { tag: tags.meta, color: "var(--md-syntax-meta)" },
]);

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "transparent",
    color: "var(--foreground)",
    fontSize: "14px",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily:
      'var(--font-geist-mono), var(--font-alibaba), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    lineHeight: "1.85",
  },
  ".cm-content": {
    padding: "26px 0 120px",
    minHeight: "100%",
    caretColor: "var(--primary)",
  },
  ".cm-line": {
    padding: "0 24px",
  },
  ".cm-gutters": {
    paddingLeft: "8px",
    minWidth: "2.5rem",
    border: "none",
    backgroundColor: "transparent",
    color: "var(--muted-foreground)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "var(--foreground)",
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in oklch, var(--muted) 55%, transparent)",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    {
      backgroundColor: "color-mix(in oklch, var(--primary) 24%, transparent)",
    },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--primary)",
  },
  ".cm-tooltip": {
    border: "1px solid var(--border)",
    borderRadius: "12px",
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
    overflow: "hidden",
  },
  // 斜杠命令面板
  ".cm-tooltip.cm-tooltip-autocomplete": {
    padding: "6px",
    borderRadius: "14px",
    boxShadow: "var(--overlay-shadow)",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul": {
    maxHeight: "min(60vh, 20rem)",
    minWidth: "268px",
    padding: "0",
    fontFamily: "var(--font-sans)",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    lineHeight: "1.5",
    color: "var(--foreground)",
  },
  ".cm-tooltip-autocomplete .cm-completionLabel": {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    letterSpacing: "-0.01em",
  },
  ".cm-tooltip-autocomplete .cm-completionMatchedText": {
    color: "var(--primary)",
    fontWeight: "600",
    textDecoration: "none",
  },
  ".cm-tooltip-autocomplete .cm-completionDetail": {
    marginLeft: "auto",
    paddingLeft: "18px",
    color: "var(--muted-foreground)",
    fontSize: "11.5px",
    fontStyle: "normal",
    whiteSpace: "nowrap",
  },
  ".cm-tooltip.cm-tooltip-autocomplete ul completion-section": {
    display: "block",
    borderBottom: "none",
    marginBottom: "12px",
    padding: "12px 12px 0",
    color: "var(--muted-foreground)",
    fontSize: "10.5px",
    fontWeight: "600",
    letterSpacing: "0.12em",
    opacity: 1,
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li:hover": {
    backgroundColor: "color-mix(in oklch, var(--foreground) 6%, transparent)",
  },
  // 覆盖基础主题里高饱和的选中色，跟随当前主题主色
  ".cm-tooltip.cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "color-mix(in oklch, var(--primary) 10%, transparent)",
    color: "var(--foreground)",
  },
});

export function WritingCanvas({
  value,
  history,
  onChange,
  onScrollRatio,
  onApi,
}: WritingCanvasProps) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange);
    const historyRef = useRef(history);
    const onApiRef = useRef(onApi);
    const onScrollRatioRef = useRef(onScrollRatio);
    const suppressRef = useRef(false);

    useEffect(() => {
      onChangeRef.current = onChange;
      historyRef.current = history;
      onApiRef.current = onApi;
      onScrollRatioRef.current = onScrollRatio;
    }, [history, onApi, onChange, onScrollRatio]);

    const applyHistoryResult = (next: string | null) => {
      const view = viewRef.current;
      if (!view || next === null) return;
      suppressRef.current = true;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: next },
      });
      suppressRef.current = false;
      onChangeRef.current(next);
    };

    const runHistory = (direction: "undo" | "redo") => {
      const result =
        direction === "undo"
          ? historyRef.current.undo()
          : historyRef.current.redo();
      applyHistoryResult(result);
    };

    useEffect(() => {
      if (!hostRef.current) return;

      const historyKeymap = Prec.high(
        keymap.of([
          {
            key: "Mod-z",
            run: () => {
              runHistory("undo");
              return true;
            },
          },
          {
            key: "Mod-Shift-z",
            run: () => {
              runHistory("redo");
              return true;
            },
          },
          {
            key: "Mod-y",
            run: () => {
              runHistory("redo");
              return true;
            },
          },
          {
            key: "Mod-b",
            run: (view) => {
              applySnippet(view, {
                prefix: "**",
                suffix: "**",
                placeholder: "粗体文字",
              });
              return true;
            },
          },
          {
            key: "Mod-i",
            run: (view) => {
              applySnippet(view, {
                prefix: "*",
                suffix: "*",
                placeholder: "斜体文字",
              });
              return true;
            },
          },
          {
            key: "Mod-u",
            run: (view) => {
              applySnippet(view, {
                prefix: "++",
                suffix: "++",
                placeholder: "下划线文字",
              });
              return true;
            },
          },
        ]),
      );

      const markdownSupport = markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        addKeymap: true,
      });

      const state = EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          drawSelection(),
          dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion({ icons: false }),
          rectangularSelection(),
          highlightActiveLine(),
          EditorView.lineWrapping,
          placeholder("开始书写你的文章…"),
          markdownSupport,
          markdownSupport.language.data.of({
            autocomplete: slashCommandSource,
          }),
          syntaxHighlighting(markdownHighlight),
          editorTheme,
          historyKeymap,
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...completionKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return;
            const next = update.state.doc.toString();
            if (suppressRef.current) return;
            onChangeRef.current(next);
            historyRef.current.record(next);
          }),
        ],
      });

      const view = new EditorView({ state, parent: hostRef.current });
      viewRef.current = view;

      let scrollFrame = 0;
      const handleScroll = () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;
          const max = view.scrollDOM.scrollHeight - view.scrollDOM.clientHeight;
          onScrollRatioRef.current?.(
            max > 0 ? view.scrollDOM.scrollTop / max : 0,
          );
        });
      };
      view.scrollDOM.addEventListener("scroll", handleScroll, { passive: true });

      onApiRef.current?.({
        insert: (snippet) => {
          applySnippet(view, snippet);
        },
        undo: () => runHistory("undo"),
        redo: () => runHistory("redo"),
        focus: () => view.focus(),
      });

      return () => {
        view.scrollDOM.removeEventListener("scroll", handleScroll);
        if (scrollFrame) cancelAnimationFrame(scrollFrame);
        onApiRef.current?.(null);
        view.destroy();
        viewRef.current = null;
      };
      // The editor is intentionally created once; value changes sync below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const view = viewRef.current;
      if (!view) return;
      if (view.state.doc.toString() === value) return;
      suppressRef.current = true;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
      suppressRef.current = false;
      historyRef.current.record(value);
    }, [value]);

    return <div ref={hostRef} className="h-full min-h-0 w-full" />;
}
