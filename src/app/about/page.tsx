import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCopy,
  Code2,
  ImageDown,
  LayoutTemplate,
  Lock,
  MonitorSmartphone,
} from "lucide-react";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于",
  description:
    "墨排是一个本地优先的 Markdown 排版工具：浏览器内编辑与实时预览，9 套文章主题，一键复制到微信公众号。无需登录，草稿只存在你的浏览器里。",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "article",
    url: "/about",
    title: "关于 · 墨排",
    description:
      "本地优先的 Markdown 排版工具：实时预览、9 套主题、一键复制到微信公众号，草稿不离开浏览器。",
  },
};

const principles = [
  {
    icon: Lock,
    title: "草稿不离开浏览器",
    body: "文章只写进 localStorage，没有账号、没有云端、没有分享链接。关掉页面之前它就在那里，关掉之后也还在。",
  },
  {
    icon: MonitorSmartphone,
    title: "打开就能用",
    body: "不需要注册，不需要授权，不弹引导。第一次打开看到的就是编辑器，第二秒就能开始写字。",
  },
  {
    icon: ClipboardCopy,
    title: "预览即承诺",
    body: "预览里看到的样式，就是粘进公众号之后得到的样式。复制时会把这套 CSS 逐条内联到元素上，不依赖任何变量。",
  },
];

const capabilities = [
  { icon: LayoutTemplate, label: "9 套文章主题", hint: "墨影、松间、潮汐、暖沙、樱雾、紫藤、琥珀、报刊、素白" },
  { icon: Code2, label: "技术文章友好", hint: "代码高亮、表格、KaTeX 公式、任务列表、GitHub 提示块" },
  { icon: ClipboardCopy, label: "复制到公众号", hint: "CSS 内联，粘贴即成型" },
  { icon: ImageDown, label: "导出长图", hint: "固定 375px 宽，适合图片消息" },
];

const steps = [
  "把 Markdown 粘进左侧稿面，或直接在稿面里写。",
  "在「主题」里挑一套样式，右侧实时预览会跟着变。",
  "点「文件 → 复制到公众号」，去后台粘贴即可。",
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-5 py-10 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-xl px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        回到工作台
      </Link>

      <header className="mt-8">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          {site.tagline}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          关于墨排
        </h1>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          墨排是一个本地优先的 Markdown
          排版工具。它只做一件事：把你写好的 Markdown，变成可以直接粘进微信公众号后台的成稿。
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">为什么需要它</h2>
        <div className="mt-3 space-y-3 text-[15px] leading-8 text-muted-foreground">
          <p>
            公众号后台的编辑器不适合写技术文章：代码块、表格、公式、脚注都不好处理，排版靠手点。
            而用现成的 Markdown 编辑器写，复制过去的样式又常在微信里走样——行距、字重、引用块的边线，总有一两处对不上。
          </p>
          <p>
            墨排把这两步接起来：左边照常写 Markdown，右边就是最终的成稿样式，
            复制时把样式内联进每一个元素，不依赖 class，也不依赖 CSS 变量。
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">三条底线</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 bg-card p-4"
            >
              <item.icon className="size-4 text-primary" />
              <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">它能做什么</h2>
        <div className="mt-4 flex flex-col">
          {capabilities.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 border-b border-border/60 py-3 last:border-b-0"
            >
              <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="mt-0.5 text-xs leading-6 text-muted-foreground">
                  {item.hint}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">三分钟上手</h2>
        <ol className="mt-4 flex flex-col gap-2">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 text-sm leading-7"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                {index + 1}
              </span>
              <span className="min-w-0">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-14 border-t border-border/60 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          开始排版
          <ArrowLeft className="size-4 rotate-180" />
        </Link>
        <p className="mt-4 text-xs text-muted-foreground">
          墨排 · Markdown 排版 · 本地优先，无需登录
        </p>
      </footer>
    </main>
  );
}
