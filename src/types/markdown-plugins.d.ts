declare module "markdown-it-attrs" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt, options?: Record<string, unknown>) => void;
  export default plugin;
}

declare module "markdown-it-deflist" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt) => void;
  export default plugin;
}

declare module "markdown-it-emoji" {
  import type MarkdownIt from "markdown-it";
  export const full: (md: MarkdownIt) => void;
}

declare module "markdown-it-implicit-figures" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt, options?: Record<string, unknown>) => void;
  export default plugin;
}

declare module "markdown-it-mark" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt) => void;
  export default plugin;
}

declare module "markdown-it-ruby" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt) => void;
  export default plugin;
}

declare module "markdown-it-sub" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt) => void;
  export default plugin;
}

declare module "markdown-it-sup" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt) => void;
  export default plugin;
}

declare module "markdown-it-task-lists" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt, options?: Record<string, unknown>) => void;
  export default plugin;
}

declare module "markdown-it-table-of-contents" {
  import type MarkdownIt from "markdown-it";
  const plugin: (md: MarkdownIt, options?: Record<string, unknown>) => void;
  export default plugin;
}
