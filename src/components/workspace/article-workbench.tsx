"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, FileCode2, PanelRightOpen, PenLine } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import {
  INITIAL_TEMPLATE,
  useArticleStore,
} from "@/features/library/article-store";
import { useArticleHydrated } from "@/features/library/use-article-hydrated";
import {
  EMPTY_SKILL_METADATA,
  parseSkillDocument,
  serializeSkillDocument,
  validateSkillMetadata,
} from "@/features/skills/frontmatter";
import { exportMarkdown, defaultExportName, readMarkdownFile } from "@/features/publishing/markdown-file";
import { exportLongImage } from "@/features/publishing/long-image";
import { copyPlainText } from "@/features/publishing/clipboard";
import { copyHtmlSource, publishToWechat } from "@/features/publishing/wechat-publish";
import { useDocumentHistory, useObservableValue } from "@/features/writing/use-document-history";
import { countCharacters, countLines } from "@/features/writing/text-metrics";
import { DEFAULT_THEME_ID } from "@/features/typography/presets";
import { DraftLoader } from "./draft-loader";
import type { WritingCanvasHandle } from "./writing-canvas";
import { ExportNameDialog } from "./export-name-dialog";
import { FormatRibbon } from "./format-ribbon";
import { PreviewPane } from "./preview-pane";
import { SkillMetadataDialog } from "./skill-metadata-dialog";
import { SyntaxHelp } from "./syntax-help";
import { ThemeGallery } from "./theme-gallery";
import { WorkbenchMenubar } from "./workbench-menubar";
import { cn } from "@/lib/utils";

const WritingCanvas = dynamic(
  () =>
    import("./writing-canvas").then((module) => module.WritingCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        正在准备编辑器…
      </div>
    ),
  },
);

type MobilePane = "write" | "preview";
type BusyState = "none" | "copy" | "image";

export function ArticleWorkbench() {
  const hydrated = useArticleHydrated();

  if (!hydrated) {
    return <DraftLoader />;
  }

  return <WorkbenchSurface />;
}

function WorkbenchSurface() {
  const markdown = useArticleStore((state) => state.markdown);
  const themeId = useArticleStore((state) => state.themeId);
  const linkFootnotes = useArticleStore((state) => state.linkFootnotes);
  const tableWrap = useArticleStore((state) => state.tableWrap);
  const setMarkdown = useArticleStore((state) => state.setMarkdown);
  const setTheme = useArticleStore((state) => state.setTheme);
  const setLinkFootnotes = useArticleStore((state) => state.setLinkFootnotes);
  const setTableWrap = useArticleStore((state) => state.setTableWrap);
  const previewVisible = useArticleStore((state) => state.previewVisible);
  const setPreviewVisible = useArticleStore((state) => state.setPreviewVisible);
  const skillMode = useArticleStore((state) => state.skillMode);
  const setSkillMode = useArticleStore((state) => state.setSkillMode);
  const skillMetadata = useArticleStore((state) => state.skillMetadata);
  const setSkillMetadata = useArticleStore((state) => state.setSkillMetadata);

  const history = useDocumentHistory(markdown);
  const canUndo = useObservableValue(history.canUndo$, false);
  const canRedo = useObservableValue(history.canRedo$, false);

  const editorApiRef = useRef<WritingCanvasHandle | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const busyRef = useRef(false);

  const [mobilePane, setMobilePane] = useState<MobilePane>("write");
  const pane: MobilePane = previewVisible ? mobilePane : "write";
  const [themeOpen, setThemeOpen] = useState(false);
  const [skillMetadataOpen, setSkillMetadataOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [busy, setBusy] = useState<BusyState>("none");
  const [resetOpen, setResetOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [exportDialog, setExportDialog] = useState<{
    kind: "markdown" | "image";
    defaultName: string;
  } | null>(null);

  useEffect(() => {
    // Warm the CSS inliner so the copy action can finish inside the user gesture.
    const timer = window.setTimeout(() => {
      void import("juice");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const wordCount = countCharacters(markdown);
  const lineCount = countLines(markdown);
  const skillValidationErrors = validateSkillMetadata(skillMetadata);

  const syncPreviewScroll = (ratio: number) => {
    const container = previewScrollRef.current;
    if (!container) return;
    const max = container.scrollHeight - container.clientHeight;
    if (max <= 0) return;
    container.scrollTop = ratio * max;
  };

  const runTask = async (
    kind: Exclude<BusyState, "none">,
    task: () => Promise<void>,
    successTitle: string,
    errorTitle: string,
  ) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(kind);
    const loadingId = toast.add({
      title: kind === "copy" ? "正在生成微信排版…" : "正在生成长图…",
      type: "loading",
      timeout: 0,
    });
    try {
      await task();
      toast.close(loadingId);
      toast.add({ title: successTitle, type: "success", timeout: 3000 });
    } catch (error) {
      toast.close(loadingId);
      toast.add({
        title: errorTitle,
        description: error instanceof Error ? error.message : String(error),
        type: "error",
        timeout: 6000,
      });
    } finally {
      busyRef.current = false;
      setBusy("none");
    }
  };

  const handleUndo = () => editorApiRef.current?.undo();
  const handleRedo = () => editorApiRef.current?.redo();

  const handleCopyWechat = () =>
    runTask(
      "copy",
      () =>
        publishToWechat(markdown, {
          themeId,
          linkFootnotes,
          tableWrap,
        }),
      "已复制，可以直接粘贴到微信公众号",
      "复制到公众号失败",
    );

  const handleExportLongImage = (fileName?: string) =>
    runTask(
      "image",
      () =>
        exportLongImage(markdown, {
          themeId,
          linkFootnotes,
          tableWrap,
          fileName,
        }),
      "长图已导出",
      "导出长图失败",
    );

  const openExportDialog = (kind: "markdown" | "image") => {
    const extension = kind === "markdown" ? "md" : "png";
    setExportDialog({
      kind,
      defaultName:
        kind === "markdown" && skillMode
          ? "SKILL.md"
          : defaultExportName(markdown, extension),
    });
  };

  const handleConfirmExport = (fileName: string) => {
    if (!exportDialog) return;
    if (exportDialog.kind === "markdown") {
      const document = skillMode
        ? serializeSkillDocument(skillMetadata, markdown)
        : markdown;
      exportMarkdown(document, fileName);
      toast.add({
        title: skillMode ? "SKILL.md 已导出" : "Markdown 已导出",
        type: "success",
        timeout: 2500,
      });
      return;
    }
    void handleExportLongImage(fileName);
  };

  const handleCopyHtml = async () => {
    const html = copyHtmlSource(markdown, linkFootnotes);
    const copied = await copyPlainText(html);
    if (copied) {
      toast.add({ title: "已复制 HTML", type: "success", timeout: 2500 });
    } else {
      toast.add({ title: "复制 HTML 失败", type: "error" });
    }
  };

  const handleSkillModeChange = (enabled: boolean) => {
    setSkillMode(enabled);
    if (enabled && (!skillMetadata.name || !skillMetadata.description)) {
      setSkillMetadataOpen(true);
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await readMarkdownFile(file);
      if (file.name.toLowerCase() === "skill.md") {
        const parsed = parseSkillDocument(text);
        setMarkdown(parsed?.body ?? text);
        setSkillMetadata(parsed?.metadata ?? EMPTY_SKILL_METADATA);
        setSkillMode(true);
        toast.add({ title: "SKILL.md 已导入", type: "success", timeout: 2500 });
      } else {
        setMarkdown(text);
        setSkillMode(false);
        setSkillMetadata(EMPTY_SKILL_METADATA);
        toast.add({ title: "Markdown 已导入", type: "success", timeout: 2500 });
      }
      setMobilePane("write");
    } catch (error) {
      toast.add({
        title: "导入失败",
        description: error instanceof Error ? error.message : String(error),
        type: "error",
      });
    }
  };

  const handleRestoreTemplate = () => {
    setMarkdown(INITIAL_TEMPLATE);
    setSkillMode(false);
    setSkillMetadata(EMPTY_SKILL_METADATA);
    setMobilePane("write");
    setResetOpen(false);
    toast.add({ title: "已恢复初始模板", type: "success", timeout: 2500 });
  };

  const handleClearDraft = () => {
    setMarkdown("");
    setClearOpen(false);
    requestAnimationFrame(() => editorApiRef.current?.focus());
    toast.add({ title: "已清空稿件", type: "success", timeout: 2500 });
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <WorkbenchMenubar
        onOpenThemeGallery={() => setThemeOpen(true)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRestoreTemplate={() => setResetOpen(true)}
        onImportFile={handleImportFile}
        onExportMarkdown={() => openExportDialog("markdown")}
        onExportLongImage={() => openExportDialog("image")}
        onCopyWechat={handleCopyWechat}
        onCopyHtml={handleCopyHtml}
        onOpenHelp={() => setHelpOpen(true)}
        linkFootnotes={linkFootnotes}
        onLinkFootnotesChange={setLinkFootnotes}
        tableWrap={tableWrap}
        onTableWrapChange={setTableWrap}
        previewVisible={previewVisible}
        onPreviewVisibleChange={setPreviewVisible}
        skillMode={skillMode}
        onSkillModeChange={handleSkillModeChange}
        onEditSkillMetadata={() => setSkillMetadataOpen(true)}
        busy={busy}
      />

      <div className="flex items-center gap-2 border-b bg-background px-3 py-1.5 lg:hidden">
        {previewVisible ? (
          <Tabs
            value={mobilePane}
            onValueChange={(value) => {
              const next = value as MobilePane;
              setMobilePane(next);
              if (next === "write") {
                requestAnimationFrame(() => editorApiRef.current?.focus());
              }
            }}
            className="min-w-0 flex-1"
          >
            <TabsList className="h-8 w-full">
              <TabsTrigger value="write">
                <PenLine />
                编辑
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye />
                预览
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <span className="min-w-0 flex-1 text-xs font-medium text-muted-foreground">
            {skillMode ? "SKILL.md" : "Markdown"}
          </span>
        )}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-hidden bg-muted/40 p-3 lg:flex-row lg:justify-center">
        <section
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 bg-background lg:max-w-[760px]",
            pane === "preview" && "hidden lg:flex",
          )}
        >
          <FormatRibbon
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onInsert={(snippet) => editorApiRef.current?.insert(snippet)}
            onClear={() => setClearOpen(true)}
          />

          <div className="min-h-0 flex-1">
            <WritingCanvas
              value={markdown}
              history={history}
              onChange={setMarkdown}
              onScrollRatio={syncPreviewScroll}
              onApi={(api) => {
                editorApiRef.current = api;
              }}
            />
          </div>

          <div className="flex h-8 shrink-0 items-center border-t bg-background">
            <div className="mx-auto flex h-full w-full max-w-[760px] items-center justify-between pr-3 pl-10 text-[11px] text-muted-foreground">
              <span>
                {wordCount} 字 · {lineCount} 行
              </span>
              <span className="flex items-center gap-1.5">
                {skillMode ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSkillMetadataOpen(true)}
                    className="h-7 gap-1 px-2 text-[11px]"
                  >
                    <FileCode2 className="size-3.5" />
                    {skillValidationErrors.length > 0
                      ? `${skillValidationErrors.length} 项待完善`
                      : "SKILL 元数据"}
                  </Button>
                ) : null}
                <span className="size-1.5 rounded-full bg-emerald-500" />
                已保存到浏览器
              </span>
            </div>
          </div>
        </section>

        <div
          className={cn(
            "flex min-h-0 w-full min-w-0 overflow-hidden transition-[width,max-width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex-none",
            previewVisible
              ? "opacity-100 lg:w-[calc(100%-480px)] lg:max-w-[720px]"
              : "opacity-0 lg:w-0 lg:max-w-0",
            pane === "write" && "hidden lg:flex",
          )}
        >
          <PreviewPane
            markdown={markdown}
            themeId={skillMode ? DEFAULT_THEME_ID : themeId}
            linkFootnotes={linkFootnotes}
            skillMode={skillMode}
            skillMetadata={skillMetadata}
            scrollRef={previewScrollRef}
            onHide={() => setPreviewVisible(false)}
          />
        </div>

        <AnimatePresence>
          {previewVisible ? null : (
            <motion.div
              key="preview-toggle"
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-4 right-4 z-10"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewVisible(true)}
                className="gap-1.5 bg-background shadow-md"
              >
                <PanelRightOpen />
                显示预览
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ThemeGallery
        open={themeOpen}
        onOpenChange={setThemeOpen}
        themeId={themeId}
        onSelect={setTheme}
      />
      {skillMetadataOpen ? (
        <SkillMetadataDialog
          metadata={skillMetadata}
          onOpenChange={setSkillMetadataOpen}
          onSave={setSkillMetadata}
        />
      ) : null}
      <SyntaxHelp open={helpOpen} onOpenChange={setHelpOpen} />

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>清空当前稿件？</AlertDialogTitle>
            <AlertDialogDescription>
              稿面内容会全部删除，只留下一个空文档。清空后可以按 Ctrl+Z 撤销，但关掉页面就找不回来了。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleClearDraft}>
              清空
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>恢复示例内容？</AlertDialogTitle>
            <AlertDialogDescription>
              当前文章的所有修改将全部丢失，并恢复为初始模板。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleRestoreTemplate}>
              确定恢复
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {exportDialog ? (
        <ExportNameDialog
          key={`${exportDialog.kind}-${exportDialog.defaultName}`}
          title={exportDialog.kind === "markdown" ? "导出 Markdown" : "导出长图"}
          description="确认或修改文件名，浏览器会下载到本地。"
          extension={exportDialog.kind === "markdown" ? "md" : "png"}
          defaultName={exportDialog.defaultName}
          onConfirm={handleConfirmExport}
          onClose={() => setExportDialog(null)}
        />
      ) : null}
    </div>
  );
}
