"use client";

import {
  Bold,
  ChevronDown,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Snippet } from "@/features/writing/editor-actions";

interface FormatRibbonProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onInsert: (snippet: Snippet) => void;
  onClear: () => void;
}

function ToolButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className="shrink-0 rounded-xl"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function FormatRibbon({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onInsert,
  onClear,
}: FormatRibbonProps) {
  return (
    <div className="border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-11 w-full max-w-[760px] items-center gap-0.5 overflow-x-auto pr-3 pl-10">
        <ToolButton label="撤销 (Ctrl+Z)" disabled={!canUndo} onClick={onUndo}>
          <Undo2 />
        </ToolButton>
        <ToolButton label="重做 (Ctrl+Shift+Z)" disabled={!canRedo} onClick={onRedo}>
          <Redo2 />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolButton
          label="粗体 (Ctrl+B)"
          onClick={() => onInsert({ prefix: "**", suffix: "**", placeholder: "粗体文字" })}
        >
          <Bold />
        </ToolButton>
        <ToolButton
          label="斜体 (Ctrl+I)"
          onClick={() => onInsert({ prefix: "*", suffix: "*", placeholder: "斜体文字" })}
        >
          <Italic />
        </ToolButton>
        <ToolButton
          label="下划线 (Ctrl+U)"
          onClick={() => onInsert({ prefix: "++", suffix: "++", placeholder: "下划线文字" })}
        >
          <Underline />
        </ToolButton>
        <ToolButton
          label="删除线"
          onClick={() => onInsert({ prefix: "~~", suffix: "~~", placeholder: "删除线文字" })}
        >
          <Strikethrough />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="标题"
                aria-label="标题"
                className="w-9 shrink-0 gap-0 rounded-xl"
              />
            }
          >
            <Heading1 />
            <ChevronDown className="size-3 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {[
              { icon: Heading1, label: "一级标题", prefix: "# " },
              { icon: Heading2, label: "二级标题", prefix: "## " },
              { icon: Heading3, label: "三级标题", prefix: "### " },
              { icon: Heading4, label: "四级标题", prefix: "#### " },
            ].map((item) => (
              <DropdownMenuItem
                key={item.prefix}
                onClick={() =>
                  onInsert({
                    prefix: item.prefix,
                    suffix: "",
                    placeholder: "标题",
                    mode: "line",
                  })
                }
              >
                <item.icon />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="列表"
                aria-label="列表"
                className="w-9 shrink-0 gap-0 rounded-xl"
              />
            }
          >
            <List />
            <ChevronDown className="size-3 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() =>
                onInsert({ prefix: "- ", suffix: "", placeholder: "列表项", mode: "line" })
              }
            >
              <List />
              无序列表
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onInsert({ prefix: "1. ", suffix: "", placeholder: "列表项", mode: "line" })
              }
            >
              <ListOrdered />
              有序列表
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolButton
          label="引用"
          onClick={() =>
            onInsert({ prefix: "> ", suffix: "", placeholder: "引用文字", mode: "line" })
          }
        >
          <Quote />
        </ToolButton>
        <ToolButton
          label="代码块"
          onClick={() =>
            onInsert({
              prefix: "```\n",
              suffix: "\n```",
              placeholder: "代码",
              mode: "block",
            })
          }
        >
          <Code2 />
        </ToolButton>
        <ToolButton
          label="链接"
          onClick={() =>
            onInsert({
              prefix: "[",
              suffix: "](https://)",
              placeholder: "链接文字",
            })
          }
        >
          <Link />
        </ToolButton>
        <ToolButton
          label="分割线"
          onClick={() =>
            onInsert({ prefix: "\n---\n", suffix: "", placeholder: "", mode: "block" })
          }
        >
          <Minus />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolButton label="清空稿件" onClick={onClear}>
          <Eraser />
        </ToolButton>
      </div>
    </div>
  );
}
