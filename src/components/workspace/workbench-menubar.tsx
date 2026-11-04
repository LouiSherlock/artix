"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  ClipboardCopy,
  Code2,
  Download,
  FileUp,
  ImageDown,
  Info,
  Link2,
  Loader2,
  Menu,
  Palette,
  PanelRight,
  PenLine,
  Redo2,
  RotateCcw,
  Table2,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ModeToggle } from "./mode-toggle";

interface WorkbenchMenubarProps {
  onOpenThemeGallery: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRestoreTemplate: () => void;
  onImportFile: (file: File) => void;
  onExportMarkdown: () => void;
  onExportLongImage: () => void;
  onCopyWechat: () => void;
  onCopyHtml: () => void;
  onOpenHelp: () => void;
  linkFootnotes: boolean;
  onLinkFootnotesChange: (value: boolean) => void;
  tableWrap: boolean;
  onTableWrapChange: (value: boolean) => void;
  previewVisible: boolean;
  onPreviewVisibleChange: (value: boolean) => void;
  busy: "none" | "copy" | "image";
}

function SheetSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="py-1">
      <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground">{title}</div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function SheetItem({
  icon: Icon,
  children,
  onClick,
  disabled,
  checked,
  spinning,
}: {
  icon: typeof Menu;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  checked?: boolean;
  spinning?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
    >
      {spinning ? (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <Icon className="size-4 shrink-0 text-muted-foreground" />
      )}
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      {checked ? <Check className="size-4 shrink-0 text-primary" /> : null}
    </button>
  );
}

export function WorkbenchMenubar({
  onOpenThemeGallery,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRestoreTemplate,
  onImportFile,
  onExportMarkdown,
  onExportLongImage,
  onCopyWechat,
  onCopyHtml,
  onOpenHelp,
  linkFootnotes,
  onLinkFootnotesChange,
  tableWrap,
  onTableWrapChange,
  previewVisible,
  onPreviewVisibleChange,
  busy,
}: WorkbenchMenubarProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const act = (fn: () => void) => () => {
    setMenuOpen(false);
    fn();
  };

  return (
    <header className="sticky top-0 z-40 flex h-12 w-full items-center gap-2 border-b bg-background/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 lg:px-6 2xl:px-8">
      <div className="flex min-w-0 items-center gap-2 pr-2 sm:gap-2.5 sm:pr-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <PenLine className="size-4" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight">墨排</h1>
      </div>

      <Menubar className="hidden h-9 min-w-0 flex-1 justify-start gap-1 rounded-none border-0 bg-transparent px-0 sm:flex">
        <MenubarMenu>
          <MenubarTrigger className="whitespace-nowrap px-2.5 sm:px-3">文件</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => fileRef.current?.click()}>
              <FileUp />
              导入 Markdown
            </MenubarItem>
            <MenubarItem onClick={onExportMarkdown}>
              <Download />
              导出 Markdown
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={onCopyWechat} disabled={busy === "copy"}>
              {busy === "copy" ? <Loader2 className="animate-spin" /> : <ClipboardCopy />}
              复制到公众号
            </MenubarItem>
            <MenubarItem onClick={onCopyHtml}>
              <Code2 />
              复制 HTML
            </MenubarItem>
            <MenubarItem onClick={onExportLongImage} disabled={busy === "image"}>
              {busy === "image" ? <Loader2 className="animate-spin" /> : <ImageDown />}
              导出长图
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="whitespace-nowrap px-2.5 sm:px-3">编辑</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onUndo} disabled={!canUndo}>
              <Undo2 />
              撤销
              <MenubarShortcut>Ctrl Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onRedo} disabled={!canRedo}>
              <Redo2 />
              重做
              <MenubarShortcut>Ctrl Shift Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={onRestoreTemplate}>
              <RotateCcw />
              恢复示例
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenThemeGallery}
          className="hidden h-8 whitespace-nowrap rounded-2xl px-2.5 text-sm font-medium sm:inline-flex sm:px-3"
        >
          主题
        </Button>

        <MenubarMenu>
          <MenubarTrigger className="whitespace-nowrap px-2.5 sm:px-3">视图</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarLabel>界面</MenubarLabel>
              <MenubarCheckboxItem
                checked={previewVisible}
                onCheckedChange={(value) => onPreviewVisibleChange(Boolean(value))}
              >
                显示预览
              </MenubarCheckboxItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarLabel>发布选项</MenubarLabel>
              <MenubarCheckboxItem
                checked={linkFootnotes}
                onCheckedChange={(value) => onLinkFootnotesChange(Boolean(value))}
              >
                外链转脚注
              </MenubarCheckboxItem>
              <MenubarCheckboxItem
                checked={tableWrap}
                onCheckedChange={(value) => onTableWrapChange(Boolean(value))}
              >
                表格自动换行
              </MenubarCheckboxItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="whitespace-nowrap px-2.5 sm:px-3">帮助</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onOpenHelp}>
              <BookOpen />
              语法速查
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem render={<Link href="/about" />}>
              <Info />
              关于墨排
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="菜单"
              onClick={() => setMenuOpen(true)}
              className="ml-auto text-muted-foreground hover:text-foreground sm:hidden"
            />
          }
        >
          <Menu />
        </TooltipTrigger>
        <TooltipContent>菜单</TooltipContent>
      </Tooltip>

      <ModeToggle />

      <input
        ref={fileRef}
        type="file"
        accept=".md,.markdown,text/markdown,text/plain"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onImportFile(file);
          event.target.value = "";
        }}
      />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl pb-3">
          <SheetHeader className="px-5 pt-5 pb-1">
            <SheetTitle>菜单</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
            <SheetSection title="主题">
              <SheetItem icon={Palette} onClick={act(onOpenThemeGallery)}>
                选择文章主题
              </SheetItem>
            </SheetSection>

            <SheetSection title="文件">
              <SheetItem
                icon={FileUp}
                onClick={() => {
                  setMenuOpen(false);
                  fileRef.current?.click();
                }}
              >
                导入 Markdown
              </SheetItem>
              <SheetItem icon={Download} onClick={act(onExportMarkdown)}>
                导出 Markdown
              </SheetItem>
              <SheetItem
                icon={ClipboardCopy}
                spinning={busy === "copy"}
                onClick={act(onCopyWechat)}
              >
                复制到公众号
              </SheetItem>
              <SheetItem icon={Code2} onClick={act(onCopyHtml)}>
                复制 HTML
              </SheetItem>
              <SheetItem
                icon={ImageDown}
                spinning={busy === "image"}
                onClick={act(onExportLongImage)}
              >
                导出长图
              </SheetItem>
            </SheetSection>

            <SheetSection title="编辑">
              <SheetItem icon={Undo2} disabled={!canUndo} onClick={act(onUndo)}>
                撤销
              </SheetItem>
              <SheetItem icon={Redo2} disabled={!canRedo} onClick={act(onRedo)}>
                重做
              </SheetItem>
              <SheetItem icon={RotateCcw} onClick={act(onRestoreTemplate)}>
                恢复示例
              </SheetItem>
            </SheetSection>

            <SheetSection title="视图">
              <SheetItem
                icon={PanelRight}
                checked={previewVisible}
                onClick={act(() => onPreviewVisibleChange(!previewVisible))}
              >
                显示预览
              </SheetItem>
              <SheetItem
                icon={Link2}
                checked={linkFootnotes}
                onClick={act(() => onLinkFootnotesChange(!linkFootnotes))}
              >
                外链转脚注
              </SheetItem>
              <SheetItem
                icon={Table2}
                checked={tableWrap}
                onClick={act(() => onTableWrapChange(!tableWrap))}
              >
                表格自动换行
              </SheetItem>
            </SheetSection>

            <SheetSection title="帮助">
              <SheetItem icon={BookOpen} onClick={act(onOpenHelp)}>
                语法速查
              </SheetItem>
              <SheetItem
                icon={Info}
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/about");
                }}
              >
                关于墨排
              </SheetItem>
            </SheetSection>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
