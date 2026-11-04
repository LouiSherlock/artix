"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_THEME_ID } from "@/features/typography/presets";

export const INITIAL_TEMPLATE = `# 把排版做成一次可复现的构建

> 这是墨排的示例文稿，把编辑器支持的大部分写法都放进了一篇文章里。你可以全选删掉，直接写自己的内容。

## 先定主题，再写正文

主题决定了字号、行距与强调色。写完再挑主题，往往要把整篇重新看一遍；所以第一件事是打开「主题」，选一套最接近目标的样式。

[toc]

## 手调排版为什么不可持续

公众号后台的编辑器是所见即所得的，但它不保存你的**意图**。改一次字号，所有段落的相对关系都要重看一遍。

1. 样式与内容混在一起，改一处要看十处
2. 没有版本概念，昨天的版式今天找不回来
3. 几个人维护几种写法，合并时全靠肉眼

> [!TIP]
> 把版式收敛成几套主题，比每次从零调整省事得多。

## 三条约束

| 约束 | 做法 | 代价 |
| --- | --- | --- |
| 不依赖样式表 | 复制时逐条内联 | 体积变大 |
| 不依赖 CSS 变量 | 颜色写死 | 换主题要重新渲染 |
| 不改动结构 | 只调整 CSS | 复杂布局做不了 |

### 内联那一步

复制时，主题 CSS 会逐条写进元素的 \`style\` 属性，所以粘进微信之后不依赖任何外部样式。参考 [CommonMark 规范](https://commonmark.org)。

\`\`\`ts
const html = await inlineArticleStyles(body, css);
await copy(html);
\`\`\`

行内公式照常写 $E = mc^2$，块级公式单独占一行：

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

## 发布前的检查清单

- [x] 主题已选定
- [x] 预览与成稿一致
- [ ] 复制到后台，肉眼比对一次
- [ ] 用手机再看一眼

> [!WARNING]
> 图片宽度是唯一需要人工确认的东西：过宽的图在手机上会被裁掉。

## 几个容易忽略的细节

术语可以成对定义：

定义列表
: 把术语和解释并排排列的写法

强调不止一种：**加粗**给结论，*斜体*给语气，==高亮==给要扫到的词，++下划线++留给真正的重点，~~删除线~~表示这条已经改过。

下标、上标与注音同样能用：H~2~O、x^2^、{汉字|hàn zì}。

---

写完之后先别急着复制。把预览拉回最上面，从头读一遍——版式问题通常藏在第三段之后。
`;

export interface ArticleState {
  markdown: string;
  themeId: string;
  linkFootnotes: boolean;
  tableWrap: boolean;
  previewVisible: boolean;
  setMarkdown: (markdown: string) => void;
  setTheme: (themeId: string) => void;
  setLinkFootnotes: (enabled: boolean) => void;
  setTableWrap: (enabled: boolean) => void;
  setPreviewVisible: (visible: boolean) => void;
}

export const useArticleStore = create<ArticleState>()(
  persist(
    (set) => ({
      markdown: INITIAL_TEMPLATE,
      themeId: DEFAULT_THEME_ID,
      linkFootnotes: false,
      tableWrap: false,
      previewVisible: true,
      setMarkdown: (markdown) => set({ markdown }),
      setTheme: (themeId) => set({ themeId }),
      setLinkFootnotes: (linkFootnotes) => set({ linkFootnotes }),
      setTableWrap: (tableWrap) => set({ tableWrap }),
      setPreviewVisible: (previewVisible) => set({ previewVisible }),
    }),
    {
      name: "md-article.workbench.v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        markdown: state.markdown,
        themeId: state.themeId,
        linkFootnotes: state.linkFootnotes,
        tableWrap: state.tableWrap,
        previewVisible: state.previewVisible,
      }),
    },
  ),
);

export function rehydrateArticleStore() {
  return useArticleStore.persist.rehydrate();
}
