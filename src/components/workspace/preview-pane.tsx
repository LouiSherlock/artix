"use client";

import { useMemo, useSyncExternalStore, type RefObject } from "react";
import DOMPurify from "dompurify";
import { PanelRightClose } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface PreviewPaneProps {
  markdown: string;
  themeId: string;
  linkFootnotes: boolean;
  className?: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
  onHide?: () => void;
}

const subscribeMounted = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function PreviewPane({
  markdown,
  themeId,
  linkFootnotes,
  className,
  scrollRef,
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
        <span className="text-xs font-medium text-muted-foreground">实时预览</span>
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

      <div
        ref={scrollRef}
        className="md-preview-scroll min-h-0 flex-1 overflow-auto"
      >
        {content ? (
          <>
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
