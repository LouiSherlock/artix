"use client";

import { useEffect, useRef, useState } from "react";
import copy from "copy-to-clipboard";
import {
  Check,
  Code2,
  Copy,
  Link2,
  List,
  Quote,
  Sigma,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface SyntaxHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SyntaxRow = readonly [syntax: string, label: string];

const sections: Array<{
  title: string;
  description: string;
  icon: typeof Type;
  rows: SyntaxRow[];
}> = [
  {
    title: "文本格式",
    description: "行内强调、代码与注音",
    icon: Type,
    rows: [
      ["**粗体**", "粗体"],
      ["*斜体*", "斜体"],
      ["++下划线++", "下划线"],
      ["~~删除线~~", "删除线"],
      ["==高亮==", "高亮"],
      ["`行内代码`", "行内代码"],
      ["~下标~", "下标"],
      ["^上标^", "上标"],
      ["{汉字|hàn zì}", "注音"],
      [":smile:", "Emoji"],
      ["\\*按原样显示\\*", "转义字符"],
      ["第一行  \n第二行", "硬换行（行尾两个空格）"],
    ],
  },
  {
    title: "标题与列表",
    description: "六级标题、嵌套与外层引用",
    icon: List,
    rows: [
      ["# 一级标题", "一级标题"],
      ["## 二级标题", "二级标题"],
      ["### 三级标题", "三级标题"],
      ["#### 四级标题 / ##### 五级 / ###### 六级", "四级到六级"],
      ["- 列表项", "无序列表"],
      ["1. 列表项", "有序列表"],
      ["- 父项\n  - 子项", "嵌套列表"],
      ["- [x] 已完成\n- [ ] 待完成", "任务列表"],
      ["> 引用内容", "引用"],
      ["> 外层引用\n> > 行内嵌套", "嵌套引用"],
      ["术语\n: 定义内容", "定义列表"],
    ],
  },
  {
    title: "链接与图片",
    description: "链接、自动识别、图注与 HTML",
    icon: Link2,
    rows: [
      ["[链接文字](https://example.com)", "链接"],
      ['[链接文字](https://example.com "标题")', "带标题的链接"],
      ["https://example.com", "网址自动识别"],
      ["![图片说明](https://example.com/a.png)", "图片"],
      ['![图片说明](https://example.com/a.png "图注")', "带图注的图片"],
      ['<img src="https://example.com/a.png" width="320" />', "HTML 图片（可指定宽度）"],
    ],
  },
  {
    title: "表格与代码",
    description: "表格对齐、代码块与 HTML 块",
    icon: Code2,
    rows: [
      ["| 列 A | 列 B |\n| --- | --- |\n| 1 | 2 |", "表格"],
      ["| 左对齐 | 居中 | 右对齐 |\n| :--- | :---: | ---: |\n| 1 | 2 | 3 |", "表格对齐"],
      ['```ts\nconst hello = "world";\n```', "代码块（带高亮）"],
      ["```\n纯文本代码块\n```", "代码块（无语言）"],
      ['```mermaid\ngraph TD\n  A --> B\n```', "Mermaid（按代码块显示）"],
      ['<div style="text-align:center">居中内容</div>', "HTML 块"],
      ["---", "分割线"],
    ],
  },
  {
    title: "公式与扩展",
    description: "KaTeX、目录与自定义属性",
    icon: Sigma,
    rows: [
      ["$E = mc^2$", "行内公式"],
      ["$$\n\\int_0^1 x^2 \\, dx = \\frac{1}{3}\n$$", "块级公式"],
      ["[toc]", "目录（收录二、三级标题）"],
      ["段落文字{.lead}", "给元素加 class"],
      ["## 标题 {#intro}", "给标题指定 id"],
    ],
  },
  {
    title: "GitHub 提示块",
    description: "五种语气，均以引用块书写",
    icon: Quote,
    rows: [
      ["> [!NOTE]\n> 补充说明", "备注"],
      ["> [!TIP]\n> 小技巧", "提示"],
      ["> [!IMPORTANT]\n> 必须知道", "重要"],
      ["> [!WARNING]\n> 注意风险", "警告"],
      ["> [!CAUTION]\n> 危险操作", "危险"],
      ["> [!TIP] 自定义标题\n> 正文内容", "自定义标题"],
    ],
  },
];

const shortcutRows: SyntaxRow[] = [
  ["Ctrl/⌘ + Z", "撤销"],
  ["Ctrl/⌘ + Shift + Z", "重做"],
  ["Ctrl/⌘ + B", "粗体"],
  ["Ctrl/⌘ + I", "斜体"],
  ["Ctrl/⌘ + U", "下划线"],
];

export function SyntaxHelp({ open, onOpenChange }: SyntaxHelpProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(sections[0].title);
  const timerRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async (key: string, syntax: string, label: string) => {
    const copied = await copy(syntax, { format: "text/plain" });
    if (!copied) {
      toast.add({ title: "复制失败", type: "error" });
      return;
    }

    setCopiedKey(key);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => setCopiedKey(null), 1600);
    toast.add({
      title: `已复制：${label}`,
      type: "success",
      timeout: 1600,
    });
  };

  const jumpTo = (title: string) => {
    setActiveSection(title);
    const container = scrollRef.current;
    const target = sectionRefs.current[title];
    if (!container || !target) return;
    container.scrollTo({
      top: target.offsetTop - container.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 gap-2 border-b px-6 py-5 sm:px-8 sm:pt-8 sm:pb-6">
          <DialogTitle className="text-xl">Markdown 语法速查</DialogTitle>
          <DialogDescription className="max-w-2xl text-sm leading-6">
            支持 GFM、代码高亮、KaTeX 公式、任务列表、定义列表、注音、GitHub 提示块与目录。
            点击每条语法右侧的复制图标，即可把对应写法放入剪贴板。
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1">
          <nav className="hidden w-40 shrink-0 flex-col gap-1 overflow-y-auto border-r p-4 sm:flex">
            <div className="px-3 pb-1 text-[11px] font-medium text-muted-foreground">
              快速导航
            </div>
            {sections.map((section) => (
              <button
                key={section.title}
                type="button"
                onClick={() => jumpTo(section.title)}
                className={cn(
                  "rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  activeSection === section.title
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {section.title}
              </button>
            ))}
          </nav>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8"
          >
            <div className="space-y-6">
            {sections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <section
                  key={section.title}
                  ref={(node) => {
                    sectionRefs.current[section.title] = node;
                  }}
                  className="mb-8 last:mb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                      <SectionIcon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold">{section.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex flex-col gap-2">
                    {section.rows.map(([syntax, label], index) => {
                      const key = `${section.title}-${index}`;
                      const copied = copiedKey === key;

                      return (
                        <div
                          key={key}
                          className="group rounded-xl border border-border/60 bg-muted/50 p-3 transition-colors hover:bg-muted"
                        >
                          <div className="mb-1.5 flex items-start justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                              {label}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              className="-mt-1 -mr-1 shrink-0 text-muted-foreground hover:text-foreground"
                              title={`复制${label}`}
                              aria-label={`复制${label}`}
                              onClick={() => void handleCopy(key, syntax, label)}
                            >
                              {copied ? (
                                <Check className="text-emerald-500" />
                              ) : (
                                <Copy />
                              )}
                            </Button>
                          </div>
                          <code className="block whitespace-pre-wrap break-words font-mono text-[12px] leading-5 text-foreground">
                            {syntax}
                          </code>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
            </div>

            <section className="mt-6 rounded-2xl border bg-muted/30 p-5">
              <div className="mb-3 text-sm font-medium text-foreground">
                快捷键与发布选项
              </div>
              <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {shortcutRows.map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between border-b border-border/50 py-1.5 text-sm"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <kbd className="rounded-lg border bg-background px-2 py-0.5 font-mono text-[11px] text-foreground">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                发布相关：「视图 → 外链转脚注」把正文外链收进参考资料；「视图 → 表格自动换行」让长表格换行而不是横向溢出。复制到公众号时会自动内联主题样式。
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
