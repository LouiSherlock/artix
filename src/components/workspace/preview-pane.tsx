"use client";

import { useMemo, useSyncExternalStore, type RefObject } from "react";
import DOMPurify from "dompurify";
import { FileCode2, PanelRightClose } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  articleCss,
  renderArticleBody,
  wrapArticle,
} from "@/features/publishing/html-document";
import type { SkillMetadata } from "@/features/skills/frontmatter";
import { cn } from "@/lib/utils";

interface PreviewPaneProps {
  markdown: string;
  themeId: string;
  linkFootnotes: boolean;
  skillMode: boolean;
  skillMetadata: SkillMetadata;
  className?: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
  onEditMetadata?: () => void;
  onHide?: () => void;
}

const subscribeMounted = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function PreviewPane({
  markdown,
  themeId,
  linkFootnotes,
  skillMode,
  skillMetadata,
  className,
  scrollRef,
  onEditMetadata,
  onHide,
}: PreviewPaneProps) {
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  const content = useMemo(() => {
    if (!mounted) return null;
    const body = renderArticleBody(markdown, { themeId, linkFootnotes });
    const clean = DOMPurify.sanitize(body, {
      USE_PROFILES: { html: true, mathMl: true, svg: true },
      ADD_ATTR: ["target"],
      FORBID_TAGS: ["style", "script", "iframe", "form", "object", "embed"],
    });
    const css = articleCss(themeId, false, isDark);
    return { html: wrapArticle(clean), css };
  }, [isDark, linkFootnotes, markdown, mounted, themeId]);

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 bg-background",
        className,
      )}
    >
      <div className="hidden h-11 shrink-0 items-center justify-between border-b border-border/60 bg-background/60 px-3 backdrop-blur lg:flex">
        <span className="text-xs font-medium text-muted-foreground">
          {skillMode ? "SKILL.md 预览" : "实时预览"}
        </span>
        <div className="flex items-center gap-1">
          {skillMode ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="编辑 SKILL 元数据"
                    onClick={onEditMetadata}
                    className="h-8 gap-1.5 px-2 text-xs"
                  />
                }
              >
                <FileCode2 />
                编辑元数据
              </TooltipTrigger>
              <TooltipContent>编辑 SKILL.md 元数据</TooltipContent>
            </Tooltip>
          ) : null}
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="隐藏预览"
                  onClick={onHide}
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <PanelRightClose />
            </TooltipTrigger>
            <TooltipContent>隐藏预览</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="md-preview-scroll min-h-0 flex-1 overflow-auto"
      >
        {content ? (
          <>
            {skillMode ? (
              <div className="border-b bg-muted/20 px-5 py-4 sm:px-8">
                <div className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  SKILL.md
                </div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {skillMetadata.name || "未命名技能"}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {skillMetadata.description || "请填写技能用途和适用场景。"}
                </p>
              </div>
            ) : null}
            <style dangerouslySetInnerHTML={{ __html: content.css }} />
            <div
              className="md-preview-content"
              dangerouslySetInnerHTML={{ __html: content.html }}
              onClick={(event) => {
                const target = event.target as HTMLElement;
                const link = target.closest("a");
                if (!link?.href) return;
                event.preventDefault();
                window.open(link.href, "_blank", "noopener,noreferrer");
              }}
            />
          </>
        ) : (
          <div className="h-96 animate-pulse bg-muted/40" />
        )}
      </div>
    </div>
  );
}
