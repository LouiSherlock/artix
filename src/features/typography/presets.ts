export type HeadingOneStyle =
  | "rule"
  | "band"
  | "underline"
  | "plain"
  | "boxed"
  | "bar";
export type HeadingTwoStyle = "rule" | "bar" | "plain" | "label";

export interface ThemePalette {
  paper: string;
  text: string;
  heading: string;
  muted: string;
  accent: string;
  accentSoft: string;
  border: string;
  surface: string;
  codeBackground: string;
  codeText: string;
  codeBorder: string;
  quoteBackground: string;
  quoteText: string;
  tableHead: string;
}

export interface ThemeSpec {
  id: string;
  name: string;
  tagline: string;
  bodyFont: string;
  headingFont: string;
  radius: number;
  h1Style: HeadingOneStyle;
  h2Style: HeadingTwoStyle;
  codeTheme: "light" | "dark";
  palette: ThemePalette;
  nightAccent: string;
}

const systemSans =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const systemSerif =
  '"Songti SC", "Source Han Serif SC", "Noto Serif CJK SC", Georgia, "Times New Roman", serif';
const editorialSerif =
  'Georgia, "Times New Roman", "Songti SC", "Source Han Serif SC", serif';

export const THEMES: ThemeSpec[] = [
  {
    id: "ink",
    name: "墨影",
    tagline: "朱砂一点，留白成章",
    bodyFont: systemSans,
    headingFont: systemSerif,
    radius: 6,
    h1Style: "underline",
    h2Style: "rule",
    codeTheme: "light",
    nightAccent: "#f87171",
    palette: {
      paper: "#fffdf8",
      text: "#242424",
      heading: "#141414",
      muted: "#737373",
      accent: "#b91c1c",
      accentSoft: "#fdf0ee",
      border: "#e7e0d4",
      surface: "#faf5ec",
      codeBackground: "#f7f3ea",
      codeText: "#3f3a33",
      codeBorder: "#e7e0d4",
      quoteBackground: "#faf5ec",
      quoteText: "#514b42",
      tableHead: "#f6f0e5",
    },
  },
  {
    id: "pine",
    name: "松间",
    tagline: "松风入墨，清而不冷",
    bodyFont: systemSans,
    headingFont: systemSans,
    radius: 10,
    h1Style: "bar",
    h2Style: "bar",
    codeTheme: "light",
    nightAccent: "#5eead4",
    palette: {
      paper: "#fbfdfb",
      text: "#25322d",
      heading: "#123a2e",
      muted: "#6b7a72",
      accent: "#0f766e",
      accentSoft: "#e8f5f1",
      border: "#d9e8e1",
      surface: "#f2f8f5",
      codeBackground: "#f4f9f7",
      codeText: "#2f3e38",
      codeBorder: "#d9e8e1",
      quoteBackground: "#eef7f3",
      quoteText: "#41564e",
      tableHead: "#e8f3ee",
    },
  },
  {
    id: "tide",
    name: "潮汐",
    tagline: "海蓝作序，理性生长",
    bodyFont: systemSans,
    headingFont: systemSans,
    radius: 8,
    h1Style: "boxed",
    h2Style: "rule",
    codeTheme: "light",
    nightAccent: "#7dd3fc",
    palette: {
      paper: "#f8fbff",
      text: "#1e2f42",
      heading: "#0b2a4a",
      muted: "#67788c",
      accent: "#0369a1",
      accentSoft: "#e6f2fb",
      border: "#d6e5f2",
      surface: "#eef6fd",
      codeBackground: "#f2f8fe",
      codeText: "#243b53",
      codeBorder: "#d6e5f2",
      quoteBackground: "#eaf4fc",
      quoteText: "#3a526b",
      tableHead: "#e4f0fa",
    },
  },
  {
    id: "sand",
    name: "暖沙",
    tagline: "纸短情长，温润有度",
    bodyFont: editorialSerif,
    headingFont: editorialSerif,
    radius: 6,
    h1Style: "plain",
    h2Style: "label",
    codeTheme: "light",
    nightAccent: "#fcd34d",
    palette: {
      paper: "#fffaf2",
      text: "#3d3327",
      heading: "#2b2116",
      muted: "#8a7964",
      accent: "#b45309",
      accentSoft: "#fbefdf",
      border: "#eadcc8",
      surface: "#f9f0e2",
      codeBackground: "#f7efe2",
      codeText: "#493a2a",
      codeBorder: "#eadcc8",
      quoteBackground: "#f8efe1",
      quoteText: "#5c4a36",
      tableHead: "#f4e8d7",
    },
  },
  {
    id: "blossom",
    name: "樱雾",
    tagline: "轻粉含雾，柔软叙事",
    bodyFont: systemSans,
    headingFont: systemSerif,
    radius: 12,
    h1Style: "bar",
    h2Style: "bar",
    codeTheme: "light",
    nightAccent: "#f9a8d4",
    palette: {
      paper: "#fff9fb",
      text: "#3f2a33",
      heading: "#4a1d2f",
      muted: "#8f7380",
      accent: "#be185d",
      accentSoft: "#fdebf3",
      border: "#f0d6e1",
      surface: "#fdf0f5",
      codeBackground: "#fbf3f6",
      codeText: "#4c3540",
      codeBorder: "#f0d6e1",
      quoteBackground: "#fdeff5",
      quoteText: "#614350",
      tableHead: "#fbe8f0",
    },
  },
  {
    id: "violet",
    name: "紫藤",
    tagline: "紫气东来，沉静有力",
    bodyFont: systemSans,
    headingFont: systemSerif,
    radius: 8,
    h1Style: "rule",
    h2Style: "label",
    codeTheme: "light",
    nightAccent: "#c4b5fd",
    palette: {
      paper: "#fbf9ff",
      text: "#2f2a3f",
      heading: "#241b3d",
      muted: "#756e8a",
      accent: "#6d28d9",
      accentSoft: "#efe9fd",
      border: "#e2daf5",
      surface: "#f5f1fd",
      codeBackground: "#f7f4fe",
      codeText: "#3a3354",
      codeBorder: "#e2daf5",
      quoteBackground: "#f3eefc",
      quoteText: "#4d456b",
      tableHead: "#eee7fb",
    },
  },
  {
    id: "amber",
    name: "琥珀",
    tagline: "琥珀封存，深色讲述",
    bodyFont: systemSans,
    headingFont: systemSans,
    radius: 8,
    h1Style: "underline",
    h2Style: "bar",
    codeTheme: "dark",
    nightAccent: "#fbbf24",
    palette: {
      paper: "#fffdf5",
      text: "#332c1d",
      heading: "#1f1a10",
      muted: "#7d7157",
      accent: "#a16207",
      accentSoft: "#fbf2d9",
      border: "#e8ddc0",
      surface: "#f9f3e2",
      codeBackground: "#1f1c17",
      codeText: "#e8e1d2",
      codeBorder: "#3a3327",
      quoteBackground: "#f6efdc",
      quoteText: "#554a33",
      tableHead: "#f4ecd6",
    },
  },
  {
    id: "gazette",
    name: "报刊",
    tagline: "铅字排版，旧日新闻",
    bodyFont: editorialSerif,
    headingFont: editorialSerif,
    radius: 2,
    h1Style: "boxed",
    h2Style: "label",
    codeTheme: "light",
    nightAccent: "#fb7185",
    palette: {
      paper: "#fdfcf8",
      text: "#2a2924",
      heading: "#191813",
      muted: "#777366",
      accent: "#9f1239",
      accentSoft: "#f8e9ec",
      border: "#d9d5c8",
      surface: "#f5f3ec",
      codeBackground: "#f5f3ec",
      codeText: "#33322c",
      codeBorder: "#d9d5c8",
      quoteBackground: "#f2f0e8",
      quoteText: "#4b493f",
      tableHead: "#eeece3",
    },
  },
  {
    id: "plain",
    name: "素白",
    tagline: "不施粉黛，保留 Markdown 原样",
    bodyFont: systemSans,
    headingFont: systemSans,
    radius: 0,
    h1Style: "plain",
    h2Style: "plain",
    codeTheme: "light",
    nightAccent: "#9ca3af",
    palette: {
      paper: "#ffffff",
      text: "#000000",
      heading: "#000000",
      muted: "#666666",
      accent: "#000000",
      accentSoft: "#ffffff",
      border: "#dddddd",
      surface: "#ffffff",
      codeBackground: "#ffffff",
      codeText: "#000000",
      codeBorder: "#dddddd",
      quoteBackground: "#ffffff",
      quoteText: "#000000",
      tableHead: "#ffffff",
    },
  },
];

export const DEFAULT_THEME_ID = "plain";

export function findTheme(id: string): ThemeSpec {
  return (
    THEMES.find((theme) => theme.id === id) ??
    THEMES.find((theme) => theme.id === DEFAULT_THEME_ID) ??
    THEMES[0]
  );
}

const lightTokens = `
#artix .hljs-comment, #artix .hljs-quote { color: #6e7781; font-style: italic; }
#artix .hljs-keyword, #artix .hljs-selector-tag, #artix .hljs-literal, #artix .hljs-doctag { color: #cf222e; }
#artix .hljs-string, #artix .hljs-regexp, #artix .hljs-symbol { color: #0a3069; }
#artix .hljs-number, #artix .hljs-attr, #artix .hljs-attribute, #artix .hljs-built_in, #artix .hljs-variable { color: #0550ae; }
#artix .hljs-title, #artix .hljs-title.function_, #artix .hljs-title.class_, #artix .hljs-function { color: #8250df; }
#artix .hljs-type, #artix .hljs-params, #artix .hljs-template-variable { color: #953800; }
#artix .hljs-tag, #artix .hljs-name, #artix .hljs-selector-id, #artix .hljs-selector-class { color: #116329; }
#artix .hljs-meta, #artix .hljs-section { color: #6e7781; }
#artix .hljs-addition { color: #116329; background: #dafbe1; }
#artix .hljs-deletion { color: #82071e; background: #ffebe9; }
`;

const darkTokens = `
#artix .hljs-comment, #artix .hljs-quote { color: #8b949e; font-style: italic; }
#artix .hljs-keyword, #artix .hljs-selector-tag, #artix .hljs-literal, #artix .hljs-doctag { color: #ff7b72; }
#artix .hljs-string, #artix .hljs-regexp, #artix .hljs-symbol { color: #a5d6ff; }
#artix .hljs-number, #artix .hljs-attr, #artix .hljs-attribute, #artix .hljs-built_in, #artix .hljs-variable { color: #79c0ff; }
#artix .hljs-title, #artix .hljs-title.function_, #artix .hljs-title.class_, #artix .hljs-function { color: #d2a8ff; }
#artix .hljs-type, #artix .hljs-params, #artix .hljs-template-variable { color: #ffa657; }
#artix .hljs-tag, #artix .hljs-name, #artix .hljs-selector-id, #artix .hljs-selector-class { color: #7ee787; }
#artix .hljs-meta, #artix .hljs-section { color: #8b949e; }
#artix .hljs-addition { color: #aff5b4; background: #033a16; }
#artix .hljs-deletion { color: #ffdcd7; background: #67060c; }
`;

function headingOne(theme: ThemeSpec) {
  const { palette: p, radius } = theme;
  switch (theme.h1Style) {
    case "band":
      return `#artix h1 {
  margin: 8px 0 30px;
  padding: 20px 24px;
  background: ${p.accent};
  color: #ffffff;
  border-radius: ${radius}px;
  font-size: 28px;
  line-height: 1.38;
}`;
    case "rule":
      return `#artix h1 {
  margin: 8px 0 30px;
  padding-top: 18px;
  border-top: 3px solid ${p.accent};
  color: ${p.heading};
  font-size: 30px;
  line-height: 1.35;
}`;
    case "underline":
      return `#artix h1 {
  margin: 8px 0 30px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${p.accent};
  color: ${p.heading};
  font-size: 30px;
  line-height: 1.4;
}`;
    case "boxed":
      return `#artix h1 {
  margin: 8px 0 30px;
  padding: 20px 24px;
  border: 1px solid ${p.border};
  background: #ffffff;
  color: ${p.heading};
  border-radius: ${Math.max(radius, 4)}px;
  font-size: 28px;
  line-height: 1.4;
}`;
    case "bar":
      return `#artix h1 {
  margin: 8px 0 30px;
  padding-left: 16px;
  border-left: 6px solid ${p.accent};
  color: ${p.heading};
  font-size: 30px;
  line-height: 1.35;
}`;
    default:
      return `#artix h1 {
  margin: 8px 0 30px;
  color: ${p.heading};
  font-size: 31px;
  line-height: 1.35;
}`;
  }
}

function headingTwo(theme: ThemeSpec) {
  const { palette: p } = theme;
  switch (theme.h2Style) {
    case "bar":
      return `#artix h2 {
  margin: 38px 0 16px;
  padding-left: 12px;
  border-left: 4px solid ${p.accent};
  color: ${p.heading};
  font-size: 22px;
  line-height: 1.45;
}`;
    case "label":
      return `#artix h2 {
  margin: 38px 0 14px;
  color: ${p.accent};
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.45;
}`;
    case "plain":
      return `#artix h2 {
  margin: 38px 0 16px;
  color: ${p.heading};
  font-size: 22px;
  line-height: 1.45;
}`;
    default:
      return `#artix h2 {
  margin: 38px 0 16px;
  padding-bottom: 9px;
  border-bottom: 1px solid ${p.border};
  color: ${p.heading};
  font-size: 22px;
  line-height: 1.45;
}`;
  }
}

function buildThemeCss(theme: ThemeSpec): string {
  const p = theme.palette;
  return `/* ${theme.name} · ${theme.tagline} */
#artix {
  display: block;
  max-width: 720px;
  margin: 0 auto;
  padding: 34px 30px 46px;
  background: #ffffff;
  color: ${p.text};
  font-family: ${theme.bodyFont};
  font-size: 16px;
  line-height: 1.82;
  letter-spacing: 0.01em;
  word-break: break-word;
  overflow-wrap: break-word;
}

#artix:empty { padding: 0; }

#artix p {
  margin: 0 0 17px;
  color: ${p.text};
  font-size: 16px;
  line-height: 1.82;
}

${headingOne(theme)}

#artix h1, #artix h2, #artix h3, #artix h4, #artix h5, #artix h6 {
  font-family: ${theme.headingFont};
  font-weight: 700;
  text-align: left;
}

${headingTwo(theme)}

#artix h3 {
  margin: 28px 0 12px;
  color: ${p.heading};
  font-size: 18px;
  line-height: 1.5;
}

#artix h4 {
  margin: 24px 0 10px;
  color: ${p.heading};
  font-size: 16px;
  line-height: 1.5;
}

#artix h5 {
  margin: 20px 0 8px;
  color: ${p.muted};
  font-size: 15px;
  line-height: 1.5;
}

#artix h6 {
  margin: 18px 0 8px;
  color: ${p.muted};
  font-size: 14px;
  letter-spacing: 0.04em;
  line-height: 1.5;
}

#artix ul, #artix ol {
  margin: 10px 0 18px;
  padding-left: 26px;
  color: ${p.text};
}

#artix ul { list-style-type: disc; }
#artix ul ul { list-style-type: circle; }
#artix ol { list-style-type: decimal; }
#artix li { margin: 6px 0; line-height: 1.8; }
#artix li > p { margin: 0; }

#artix blockquote {
  margin: 24px 0;
  padding: 16px 20px;
  border: none;
  border-left: 3px solid ${p.accent};
  border-radius: 0 ${theme.radius}px ${theme.radius}px 0;
  background: ${p.quoteBackground};
  color: ${p.quoteText};
}

#artix blockquote p {
  margin: 0 0 8px;
  color: ${p.quoteText};
  font-size: 15px;
  line-height: 1.78;
}

#artix blockquote p:last-child { margin-bottom: 0; }

#artix a {
  color: ${p.accent};
  text-decoration: none;
  border-bottom: 1px solid ${p.accent};
  font-weight: 500;
}

#artix strong { color: ${p.heading}; font-weight: 700; }
#artix em { color: ${p.text}; font-style: italic; }
#artix del { color: ${p.muted}; text-decoration: line-through; }
#artix u { text-decoration: underline; text-underline-offset: 0.18em; }

#artix mark {
  padding: 2px 5px;
  border-radius: 3px;
  background: ${p.accentSoft};
  color: ${p.heading};
}

#artix hr {
  height: 1px;
  margin: 32px 0;
  border: none;
  background: ${p.border};
}

#artix img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 22px auto;
  border-radius: ${theme.radius}px;
}

#artix figure { margin: 22px 0; }
#artix figcaption { margin-top: 8px; text-align: center; color: ${p.muted}; font-size: 13px; }

#artix p code, #artix li code, #artix td code, #artix th code {
  margin: 0 2px;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${p.accentSoft};
  color: ${p.accent};
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.88em;
}

#artix pre.md-code {
  margin: 20px 0;
  padding: 0;
  border: 1px solid ${p.codeBorder};
  border-radius: ${theme.radius}px;
  background: ${p.codeBackground};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

#artix pre.md-code code {
  display: block;
  min-width: max-content;
  padding: 18px 20px;
  border: none;
  background: transparent;
  color: ${p.codeText};
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 13px;
  line-height: 1.72;
  white-space: pre;
}

${theme.codeTheme === "dark" ? darkTokens : lightTokens}

#artix .table-shell {
  margin: 22px 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

#artix table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 15px;
  text-align: left;
}

#artix table tr { background: transparent; }
#artix table th {
  padding: 10px 12px;
  border-bottom: 2px solid ${p.accent};
  background: ${p.tableHead};
  color: ${p.heading};
  font-weight: 700;
  white-space: nowrap;
}
#artix table td {
  padding: 10px 12px;
  border-bottom: 1px solid ${p.border};
  color: ${p.text};
}

#artix .callout {
  margin: 24px 0;
  padding: 16px 18px;
  border: 1px solid ${p.border};
  border-left-width: 4px;
  border-radius: ${theme.radius}px;
  background: ${p.surface};
}

#artix .callout-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: ${p.heading};
  font-weight: 700;
}

#artix .callout-icon { margin-right: 8px; }
#artix .callout-note { border-left-color: #2563eb; }
#artix .callout-tip { border-left-color: ${p.accent}; }
#artix .callout-important { border-left-color: #7c3aed; }
#artix .callout-warning { border-left-color: #d97706; }
#artix .callout-caution { border-left-color: #dc2626; }

#artix .task-list-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-left: -1.2em;
  list-style: none;
}

#artix .task-list-item input[type="checkbox"] {
  margin-top: 6px;
  pointer-events: none;
}

#artix .footnote-word { color: ${p.accent}; font-weight: 500; }
#artix .footnote-ref { color: ${p.accent}; font-weight: 600; }
#artix .footnotes-sep:before {
  display: block;
  margin: 34px 0 14px;
  content: "参考资料";
  color: ${p.heading};
  font-size: 18px;
  font-weight: 700;
}
#artix .footnote-item { display: flex; gap: 6px; }
#artix .footnote-num { color: ${p.muted}; font-size: 13px; }
#artix .footnote-item p { display: inline; margin: 0; color: ${p.muted}; font-size: 14px; line-height: 1.8; }

#artix .block-equation {
  display: block;
  margin: 20px 0;
  overflow-x: auto;
  text-align: center;
}

#artix .inline-equation { max-width: 100%; }
#artix .block-equation > .katex-display { margin: 0; }
#artix .imageflow-layer1 { margin: 20px 0; }
#artix .imageflow-layer2 { overflow-x: auto; white-space: nowrap; }
#artix .imageflow-layer3 { display: inline-block; width: 80%; margin-right: 10px; white-space: normal; vertical-align: top; }
#artix .imageflow-img { width: 100%; height: auto; max-height: 300px; object-fit: contain; }

#artix .table-of-contents { margin: 20px 0; padding: 16px 20px; border: 1px solid ${p.border}; background: ${p.surface}; border-radius: ${theme.radius}px; }
#artix .table-of-contents a { border: none; }
`;
}

const plainCss = `/* 素白 · 不施粉黛，保留 Markdown 原样 */
#artix {
  display: block;
  max-width: 720px;
  margin: 0 auto;
  padding: 34px 30px 46px;
  background: #ffffff;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  font-size: 16px;
  line-height: 1.75;
  word-break: break-word;
  overflow-wrap: break-word;
}

#artix:empty { padding: 0; }

#artix h1, #artix h2, #artix h3, #artix h4, #artix h5, #artix h6 {
  margin: 24px 0 12px;
  color: #000000;
  font-weight: 700;
  line-height: 1.4;
}

#artix h1 { font-size: 28px; }
#artix h2 { font-size: 22px; }
#artix h3 { font-size: 18px; }
#artix h4 { font-size: 16px; }
#artix h5 { font-size: 15px; }
#artix h6 { font-size: 14px; }

#artix p { margin: 0 0 16px; }
#artix ul, #artix ol { margin: 0 0 16px; padding-left: 26px; }
#artix li { margin: 4px 0; }

#artix blockquote {
  margin: 20px 0;
  padding: 8px 16px;
  border-left: 3px solid #d4d4d4;
  color: #444444;
}

#artix a { color: #1d4ed8; text-decoration: underline; }
#artix img { max-width: 100%; height: auto; }
#artix hr { margin: 28px 0; border: none; border-top: 1px solid #d4d4d4; }

#artix p code, #artix li code, #artix td code, #artix th code {
  padding: 1px 5px;
  border-radius: 3px;
  background: #f2f2f2;
  color: #1a1a1a;
  font-family: "SFMono-Regular", Consolas, Menlo, monospace;
  font-size: 0.9em;
  word-break: break-word;
}

#artix pre, #artix pre.md-code {
  margin: 18px 0;
  padding: 12px 14px;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  background: #fafafa;
  overflow-x: auto;
}

#artix pre code, #artix pre.md-code code {
  display: block;
  padding: 0;
  border: none;
  background: transparent;
  color: #1a1a1a;
  font-family: "SFMono-Regular", Consolas, Menlo, monospace;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

#artix .table-shell { margin: 18px 0; max-width: 100%; }

#artix table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  text-align: left;
}

#artix table th, #artix table td {
  padding: 8px 10px;
  border: 1px solid #d4d4d4;
  vertical-align: top;
  word-break: break-word;
  overflow-wrap: break-word;
}

#artix table th { background: #f5f5f5; font-weight: 600; white-space: normal; }

#artix .callout {
  margin: 18px 0;
  padding: 12px 14px;
  border: 1px solid #d4d4d4;
  border-left-width: 4px;
}

#artix .callout-title { margin-bottom: 6px; font-weight: 700; }
#artix .footnote-word, #artix .footnote-ref { color: #1d4ed8; }
`;

const plainNightCss = `/* 素白 · night preview */
#artix {
  background: #17181c;
  color: #d8dbe2;
}
#artix p, #artix li, #artix td, #artix em, #artix ul, #artix ol { color: #d8dbe2; }
#artix h1, #artix h2, #artix h3, #artix h4, #artix h5, #artix h6, #artix strong { color: #f5f6f8; }
#artix a { color: #93b4f8; }
#artix blockquote { border-left-color: #3a3d46; color: #c9cdd6; }
#artix hr { border-top-color: #343741; }
#artix pre, #artix pre.md-code { background: #101116; border-color: #343741; }
#artix pre code, #artix pre.md-code code { color: #e6e8ee; }
#artix p code, #artix li code, #artix td code, #artix th code { background: #262931; color: #e6e8ee; }
#artix table th, #artix table td { border-color: #343741; }
#artix table th { background: #21232a; color: #f5f6f8; }
#artix .callout { border-color: #343741; }
#artix .footnote-word, #artix .footnote-ref { color: #93b4f8; }
`;

const cssCache = new Map<string, string>();

export function themeCss(themeOrId: ThemeSpec | string): string {
  const theme = typeof themeOrId === "string" ? findTheme(themeOrId) : themeOrId;
  if (theme.id === "plain") return plainCss;
  const cached = cssCache.get(theme.id);
  if (cached) return cached;
  const css = buildThemeCss(theme);
  cssCache.set(theme.id, css);
  return css;
}

export function nightCss(themeOrId: ThemeSpec | string): string {
  const theme = typeof themeOrId === "string" ? findTheme(themeOrId) : themeOrId;
  if (theme.id === "plain") return plainNightCss;
  const accent = theme.nightAccent;
  return `/* ${theme.name} · night preview */
#artix {
  background: #17181c;
  color: #d8dbe2;
}
#artix p, #artix li, #artix table td, #artix em { color: #d8dbe2; }
#artix ul, #artix ol { color: #d8dbe2; }
#artix h1, #artix h2, #artix h3, #artix h4, #artix h5, #artix h6, #artix strong { color: #f5f6f8; }
#artix del { color: #9ca3af; }
#artix h1 { border-color: ${accent}; background-color: transparent; }
#artix h2 { border-color: #3a3d46; }
#artix blockquote, #artix .callout, #artix .table-of-contents { background: #21232a; border-color: #343741; }
#artix blockquote p, #artix .callout-title { color: #cfd3dc; }
#artix a, #artix .footnote-word, #artix .footnote-ref { color: ${accent}; border-color: ${accent}; }
#artix hr, #artix table td { border-color: #343741; }
#artix hr { background: #343741; }
#artix table th { background: #21232a; border-color: ${accent}; color: #f5f6f8; }
#artix table tr:nth-child(2n) { background: #1c1e23; }
#artix pre.md-code { background: #101116; border-color: #343741; }
#artix pre.md-code code { background: transparent; color: #e6e8ee; }
#artix p code, #artix li code, #artix td code, #artix th code { background: #262931; color: ${accent}; }
#artix mark { background: #3a3320; color: #f5e6b8; }
#artix figcaption, #artix .footnote-num, #artix .footnote-item p, #artix .imageflow-caption { color: #9ca3af; }
#artix .footnotes-sep:before { color: #f5f6f8; }
#artix .md-code .hljs-comment { color: #8b949e; }
#artix .md-code .hljs-keyword, #artix .md-code .hljs-selector-tag, #artix .md-code .hljs-literal { color: #ff7b72; }
#artix .md-code .hljs-string, #artix .md-code .hljs-regexp, #artix .md-code .hljs-symbol { color: #a5d6ff; }
#artix .md-code .hljs-number, #artix .md-code .hljs-attr, #artix .md-code .hljs-built_in, #artix .md-code .hljs-variable { color: #79c0ff; }
#artix .md-code .hljs-title, #artix .md-code .hljs-function { color: #d2a8ff; }
#artix .md-code .hljs-type, #artix .md-code .hljs-params { color: #ffa657; }
#artix .md-code .hljs-tag, #artix .md-code .hljs-name { color: #7ee787; }
`;
}
