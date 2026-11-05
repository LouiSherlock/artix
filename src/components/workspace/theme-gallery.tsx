"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  THEMES,
  findTheme,
  nightCss,
  themeCss,
  type ThemeSpec,
} from "@/features/typography/presets";
import { cn } from "@/lib/utils";

interface ThemeGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeId: string;
  onSelect: (themeId: string) => void;
}

function previewDocument(theme: ThemeSpec, dark: boolean) {
  const css = `${themeCss(theme)}${dark ? nightCss(theme) : ""}`;
  const page = dark ? "#17181c" : "#ffffff";
  const foreground = dark
    ? "oklch(0.986 0.002 67.8)"
    : "oklch(0.147 0.004 49.3)";
  const sample = `<section id="artix">
  <h1>${theme.name}</h1>
  <p>${theme.tagline}。这是一段示例正文，包含 <strong>重点</strong>、<em>强调</em> 与 <a href="#">链接</a>。</p>
  <h2>二级标题</h2>
  <blockquote><p>引用一段值得记住的话。</p></blockquote>
  <p><code>inline code</code></p>
  <pre class="md-code"><code class="hljs"><span class="hljs-keyword">const</span> theme = <span class="hljs-string">"preview"</span>;</code></pre>
  <ul>
    <li>列表项一，展示主题的项目符号与间距</li>
    <li>列表项二，保持正文与强调色的一致</li>
  </ul>
  <table>
    <thead><tr><th>功能</th><th>状态</th></tr></thead>
    <tbody><tr><td>Markdown</td><td>已支持</td></tr><tr><td>公众号排版</td><td>已支持</td></tr></tbody>
  </table>
</section>`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
html, body { margin: 0; padding: 0; background: ${page}; }
${css}
html { --foreground: ${foreground}; }
* {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in oklch, var(--foreground) 18%, transparent) transparent;
}
*::-webkit-scrollbar { width: 6px; height: 6px; }
*::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: color-mix(in oklch, var(--foreground) 18%, transparent);
}
*::-webkit-scrollbar-track,
*::-webkit-scrollbar-corner { background: transparent; }
</style>
</head>
<body>${sample}</body>
</html>`;
}

export function ThemeGallery({
  open,
  onOpenChange,
  themeId,
  onSelect,
}: ThemeGalleryProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <ThemeGalleryBody
          themeId={themeId}
          onSelect={onSelect}
          onClose={() => onOpenChange(false)}
        />
      ) : null}
    </Dialog>
  );
}

function ThemeGalleryBody({
  themeId,
  onSelect,
  onClose,
}: {
  themeId: string;
  onSelect: (themeId: string) => void;
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState(themeId);
  const current = findTheme(themeId);
  const selected = findTheme(selectedId);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
      <DialogHeader className="shrink-0 border-b px-6 py-5 sm:px-8 sm:pt-8 sm:pb-6">
        <DialogTitle>文章主题</DialogTitle>
        <DialogDescription>
          选择左侧主题，在右侧查看实际排版效果，确认后应用到文章。
        </DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex min-h-0 flex-col gap-4 sm:flex-row">
          <div className="flex shrink-0 gap-1 overflow-x-auto pb-1 sm:max-h-[560px] sm:w-48 sm:flex-col sm:overflow-y-auto sm:pr-1 sm:pb-0">
            {THEMES.map((theme) => {
              const active = theme.id === selectedId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedId(theme.id)}
                  className={cn(
                    "relative flex shrink-0 items-center justify-between gap-2 rounded-xl border border-transparent px-3 py-2 text-left text-sm transition-colors sm:w-full",
                    active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="theme-selection"
                      className="absolute inset-0 rounded-xl border border-primary bg-primary/5"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}

                  <span className="relative z-10">{theme.name}</span>

                  <AnimatePresence initial={false}>
                    {active ? (
                      <motion.span
                        key="check"
                        className="relative z-10 shrink-0"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 520, damping: 28 }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                          className="size-3.5"
                        >
                          <motion.path
                            d="M20 6 9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.24, ease: "easeOut" }}
                          />
                        </svg>
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="h-[400px] overflow-hidden border bg-white sm:h-[600px] dark:bg-[#17181c]">
              <iframe
                key={`${selected.id}-${isDark ? "dark" : "light"}`}
                title={`${selected.name} 主题预览`}
                srcDoc={previewDocument(selected, isDark)}
                sandbox=""
                className="h-full w-full border-0"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-muted-foreground">
                当前：{current.name}
                {selectedId !== themeId ? ` → ${selected.name}` : ""}
              </span>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  取消
                </Button>
                <Button
                  onClick={() => {
                    onSelect(selectedId);
                    onClose();
                  }}
                >
                  应用主题
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
