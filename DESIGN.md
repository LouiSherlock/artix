---
name: 墨排
description: 本地优先的 Markdown 排版工作台
colors:
  primary: "oklch(0.525 0.223 3.958)"
  primary-dark: "oklch(0.459 0.187 3.815)"
  primary-foreground: "oklch(0.971 0.014 343.198)"
  background: "oklch(1 0 0)"
  background-dark: "oklch(0.145 0.008 326)"
  foreground: "oklch(0.145 0.008 326)"
  muted: "oklch(0.96 0.003 325.6)"
  muted-dark: "oklch(0.263 0.024 320.12)"
  muted-foreground: "oklch(0.542 0.034 322.5)"
  muted-foreground-dark: "oklch(0.711 0.019 323.02)"
  border: "oklch(0.922 0.005 325.62)"
  border-dark: "oklch(1 0 0 / 10%)"
  card-dark: "oklch(0.212 0.019 322.12)"
  ring: "oklch(0.711 0.019 323.02)"
  destructive: "oklch(0.577 0.245 27.325)"
  syntax-heading: "#6d28d9"
  syntax-strong: "#111827"
  syntax-emphasis: "#0f766e"
  syntax-link: "#1d4ed8"
  syntax-code: "#b45309"
  syntax-meta: "#6b7280"
typography:
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
  mono:
    fontFamily: "\"Geist Mono\", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.85
  article:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.82
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  4xl: "26px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.4xl}"
    height: "36px"
    padding: "0 12px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.4xl}"
    height: "36px"
    padding: "0 12px"
  button-ghost-icon:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    size: "32px"
  button-destructive:
    backgroundColor: "color-mix(in oklch, oklch(0.577 0.245 27.325) 10%, transparent)"
    textColor: "{colors.destructive}"
    typography: "{typography.body}"
    rounded: "{rounded.4xl}"
    height: "36px"
    padding: "0 12px"
  menubar-trigger:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 8px"
  theme-option-selected:
    backgroundColor: "color-mix(in oklch, oklch(0.525 0.223 3.958) 5%, transparent)"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "8px 12px"
  input:
    backgroundColor: "color-mix(in oklch, oklch(0.922 0.005 325.62) 50%, transparent)"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.3xl}"
    height: "36px"
    padding: "0 12px"
  paper-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "0px"
    padding: "0px"
  dialog:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.4xl}"
    padding: "24px"
---

# Design System: 墨排

## Overview

**Creative North Star: "校对台"**

这是一张校对台：左边是稿，右边是样，两张纸始终并置，改动一落笔，右边立刻跟着变。界面不试图显得聪明，也不试图被记住——它要让作者的注意力留在稿子上，而不是留在工具上。所有视觉决定都从这条推导：工具退到边缘，纸面占据中心。

气质是安静温润的纸感，但只到"触感"为止。暖白的底、克制的留白、几乎看不见的紫灰底子，让长时间写作不吃力。绝不跨到拟物：没有纸纹、没有做旧、没有仿真装订。纸感来自比例与留白，不来自贴图。

色彩分工是硬的。界面只有一枚朱砂，文章的颜色 100% 交给 9 套主题。这条分离让工具看起来安静，而产出的文章可以各自有性格——同一张校对台，可以排出墨影的朱砂，也可以排出报刊的铅字。

**Key Characteristics:**
- 两段式外壳：48px 菜单栏之后全部让给稿面与样面；格式带属于稿面，不属于全局
- 平面优先：静态面板之间只用 1px hairline，没有投影
- 单一强调色：朱砂只出现在主操作、光标、选区与当前选中项
- 圆而软，纸要方：控件接近胶囊，文档纸面严格直角
- 双语气：等宽稿面 / 主题字体的印刷样面

## Colors

一枚朱砂压在几乎无色的雾灰上，其余颜色留给文章主题。

### Primary

- **朱砂 Vermilion** (oklch(0.525 0.223 3.958))：主按钮底色、输入光标、文本选区、当前主题标记。深色模式降为 oklch(0.459 0.187 3.815)，避免高饱和红在深底上跳出来。
- **藕白 Lotus White** (oklch(0.971 0.014 343.198))：朱砂上的文字色。不是纯白——带一点同色相的粉，让红底上的字不刺眼。

### Neutral

- **墨黑 Ink** (oklch(0.145 0.008 326))：浅色模式的正文与标题；深色模式的背景。同一个值承担双重角色，这是整套中性色的锚点。
- **纸白 Paper White** (oklch(1 0 0))：浅色背景、预览白卡、弹窗表面。
- **雾灰 Mist** (oklch(0.96 0.003 325.6) 填充 / oklch(0.542 0.034 322.5) 次要文字 / oklch(0.922 0.005 325.62) 描边 / oklch(0.711 0.019 323.02) 焦点环)：色相锁在 320–326，彩度压到 0.034 以下。那层几乎看不出的紫灰底子是整套系统的温度来源，不要掺入暖黄或纯中性灰。
- **深色浮层** (oklch(0.212 0.019 322.12) 卡片与弹窗 / oklch(0.263 0.024 320.12) 静默填充)：深色模式用明度分层代替投影，靠 10% 白描边收边。

### State

- **警示红 Ember** (oklch(0.577 0.245 27.325))：只用于破坏性操作与错误态（恢复示例、导入失败），不做装饰，不与朱砂混用。

### 编辑器语法

代码语气自成一组，全部走 CSS 变量，浅深两套同色相：

- 标题 `#6d28d9` / 加粗 `#111827` / 斜体 `#0f766e` / 链接 `#1d4ed8` / 行内代码 `#b45309` / 元信息 `#6b7280`
- 深色模式整体提亮到紫 300、青 300、蓝 300、琥珀 400 一级；这是同一套色相的亮度调整，不是另一套配色。

### Named Rules

**The One Seal Rule.** 界面里只有一枚朱砂。它只出现在主操作、光标、选区与当前选中的主题标记上。不要为了"活泼"引入第二个强调色；状态点（已保存的绿点）属于指示器，不构成第二品牌色。

**The Theme Owns Color Rule.** 文章内部的颜色 100% 由主题 palette 决定。界面 chrome 的任何颜色都不得渗进文档，文档的颜色也不得回流成界面装饰。

## Typography

**Display / UI Font:** Inter（拉丁）+ 阿里巴巴普惠体 3.0（中文，`public/fonts/AlibabaPuHuiTi-3-55-Regular.ttf`），回落到 system CJK
**Body Font:** 同 UI 字体，14px 为主
**Mono Font:** Geist Mono（`--font-geist-mono`），编辑器与所有代码；中文回落到普惠体
**Article Font:** 由主题决定——系统无衬线（松间 / 潮汐 / 樱雾 / 紫藤 / 琥珀 / 素白）、系统衬线（墨影）、editorial serif（暖沙 / 报刊，Georgia 起手）

**Character:** 界面字是工具字：小、密、准确，14px 承载操作，11px 承载元信息。文章字是阅读字：16px、行高 1.82、字距 0.01em，为长时间阅读让步。两种语境刻意不统一——统一会让工具变得笨重，或让文章变得像表单。

### Hierarchy

- **Title** (600, 1.25rem / 1.4)：弹窗标题（文章主题、Markdown 语法速查）。
- **Body** (400, 0.875rem / 1.6)：界面默认文字——按钮、菜单项、说明段落。
- **Label** (500, 0.6875rem / 1.4)：状态栏（字数 · 行数 / 已保存）、分区名（"Markdown" / "实时预览"）。雾灰、不加粗。
- **Mono** (400, 0.875rem / 1.85)：稿面。行高比正文更松，因为稿件是逐行读的，不是整段扫的。
- **Article** (标题 700 / 正文 400, 1rem / 1.82 / 0.01em)：文档内。h1 28–31px，h2 19–22px，h3 18px，h4 16px，h5 15px，h6 14px。

### Named Rules

**The Two Registers Rule.** 稿面用等宽，样面用主题字体。不要为了"统一"把编辑器换成衬线，也不要把预览换成等宽——这个差异正是校对台上"原稿 / 清样"的物理对应。

**The Quiet Small Print Rule.** 元信息一律 11–12px、雾灰、不加粗。它必须可读，但永远不许抢眼。

## Layout

外壳是 `h-dvh` 的两段纵向结构：48px 菜单栏（sticky、磨砂），剩余高度全给工作台。没有全局格式带——格式带属于稿面。

工作台是一张桌子：`bg-muted/40` 的底，四周留 12px，两张卡片之间也留 12px，居中排布。

**稿面卡**——18px 圆角、1px 描边、纸白底，最大宽 760px。内部三段：44px 格式带（兼作卡头）、编辑器、32px 状态脚。编辑器占满卡宽：左侧 40px 行号栏 + 720px 文字列，与文章纸面同宽，卡内不留空边。
**预览卡**——18px 圆角、1px 描边、纸白底，最大宽 720px，与文章纸面同宽。卡内不再套一层白纸：文章直接从卡头顶到底，留白全部来自文章自身的 30px 内边距。44px 卡头只在 `lg` 以上出现：左侧"实时预览"，右侧一个隐藏按钮。

主体在 ≥1024px（`lg`）左右并排，<1024px 收成单栏 + "编辑 / 预览" Tabs。预览宽 `min(100% − 480px, 720px)`，余量给稿面（封顶 760px）。

文章纸面：`#artix` 最大宽 720px，内边距 34px 30px 46px；≤640px 时左右收到 18px、字号降到 15px。

密度以 4px 为步进，常用 8 / 12 / 16 / 24px。控件高度 32（sm）/ 36（default）/ 40（lg）px；工具图标位 32px。

### Named Rules

**The Paper Does Not Stretch Rule.** 稿面卡 760px，预览卡 720px，文章 720px，长图 375px。窗口变宽时纸不长，多出来的宽度留在桌面上，不塞进卡片。

**The Card-Is-The-Paper Rule.** 预览卡不是"装着纸的相框"——它本身就是纸。不在卡内再套一层白纸、不留桌垫、不留空边；留白只来自文章自身的 30px 内边距。

## Elevation & Depth

平面优先。静态界面没有任何阴影——面板之间靠 1px hairline（`--border`）和背景明度差分层次。

深度只属于浮层。菜单、下拉、popover、弹窗用 `shadow-lg` / `shadow-xl`，再叠一圈 `ring-1 ring-foreground/5`（深色 `ring-foreground/10`）收边，让投影有明确边界，而不是发糊的一团。

两条 44–48px 的栏是全站唯一的"玻璃"：`bg-background/85 backdrop-blur`，不支持 backdrop-filter 时回落到 `bg-background/70`。它只出现在压在内容上方、需要让内容透出来的栏上。

### Shadow Vocabulary

- **overlay-lg** (`0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`)：菜单、下拉、popover、hover card。
- **overlay-xl** (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`)：弹窗、抽屉、sheet。

两者都必须搭配 `ring-1 ring-foreground/5` 使用。单独一个投影在这套近白的底子上会显得脏。

### Named Rules

**The Overlay-Only Elevation Rule.** 阴影是"浮起来"的信号，不是"重要"的装饰。静态面板永远没有阴影；一块内容如果需要更突出，改它的位置或层级，不要给它投影。

## Shapes

圆而软。控件与卡片走圆角：按钮 26px（36px 高，视觉上就是胶囊）、图标位 14px、菜单与浮层 22px、主题列表项 14px、工作台两张卡 18px。文档本身不再有独立纸面——预览卡就是纸，圆角由卡承担；导出长图仍是 0 圆角。

圆角基数 `--radius: 10px`，依此派生 6 / 8 / 10 / 14 / 18 / 22 / 26px。文章主题另有一套 2–12px 的圆角（报刊 2px 最硬，樱雾 12px 最软），那属于主题，不属于界面——改主题圆角不该带动界面圆角。

### Named Rules

**The Round Tools, Square Content Rule.** 圆角只属于工具与容器，不属于文字。给卡片加圆角是对的；给段文字、代码块、表格再套一层圆角框是错的。

**The One-Pixel Press Rule.** 可点控件按下时下移 1px（`active:translate-y-px`）。这是全站唯一的位移动效，其余状态变化一律只改颜色。

## Components

### Buttons

- **Shape:** 胶囊（26px），高 36px，横向内边距 12px，图标与文字间距 6px。
- **Primary:** 朱砂底 + 藕白字。全站同一屏最多出现一个。
- **Outline:** 纸白底 + hairline 描边，用于工具栏里的次级动作（复制、导出、切换界面主题）。
- **Ghost:** 透明底，hover 才出现 `muted` 底。格式带里所有图标按钮都是这个形态。
- **Hover / Focus:** 主按钮 hover 把底色降到 80% 不透明度；焦点环 `ring-3 ring-ring/30`，同时边框转为 `ring` 色。
- **Disabled:** `opacity-50` + 不可点，不做灰度替换，也不隐藏。

### Tool Chips（格式带图标位）

- **Style:** Ghost 按钮，32×32，圆角 14px，图标 16px，`shrink-0`；容器允许横向滚动但不撑破页面，且隐藏滚动条（`scrollbar-width: none`），保证 44px 高度不因滚动条抖动。
- **带下拉的图标位:** 宽度放到 36px，图标旁加 3px 的 `ChevronDown`（60% 不透明度），让"这里还有菜单"可见。标题与列表两处用这个形态。
- **State:** 只有 hover 底色，没有选中态——它们往稿面里插入语法，不维护"当前格式"。撤销 / 重做按可用性禁用。

### Cards / Containers

- **Pane card（稿面卡与预览卡）:** 18px 圆角、1px 描边、无阴影，浮在 `muted/40` 桌面上。卡内不留空边——稿面占满卡宽，预览卡直接由文章内容填充。
- **Preview paper:** 预览卡本身就是纸，没有内嵌白卡。文章从卡头顶到底，自带 30px 内边距与 `#artix` 样式，这是整站最重要的呈现面。
- **Theme list item:** 14px 圆角；选中态 `border-primary` + `bg-primary/5` + 右侧勾选；未选中透明边框配雾灰字，hover 转 `muted` 底。
- **Internal padding:** 弹窗 24px、卡头 12px、卡片与条目 16px、芯片 12px。

### Inputs / Fields

- **Style:** 高 36px，22px 圆角，透明描边配 `input/50` 半透明填充，14px 文字。
- **Focus:** 边框转为 `ring`，外扩 `ring-3 ring-ring/30`，背景不变。焦点靠"描边亮起来"表达，不靠填充变色。
- **Error:** 边框与焦点环转 `destructive`；不在输入框旁加图标或红底。

### Navigation

- **Menubar:** 48px 高。左侧 32px 朱砂方块放笔形 logo（14px 圆角）+ "墨排" 600/14px；菜单项 32px 高、透明底、无边框，hover 才出现 `muted` 底；菜单分组用 9px 内边距。右侧只有界面主题切换——不放常驻主操作，发布动作留在「文件」菜单与窄屏工具行里。
- **Mobile:** 不折叠成抽屉菜单，直接改成 Tabs 分段 + 两个动作按钮。手机上做的是"看和改一两处"，不是完整排版。

### ThemeGallery（签名组件）

主题画廊是这套系统里唯一"以视觉为主角"的地方，也是唯一用 iframe 的地方。左侧 8 个主题名做成单选列表（14px 圆角、选中描朱砂），右侧 520px 高的沙箱 iframe 用真实 `themeCss` 渲染一段示例 Markdown——包含标题、引用、代码、表格、列表。选中不会立刻写入文章，必须点"应用主题"。

### Preview Pane（签名组件）

预览不是"渲染结果预览"，而是"最终成稿的替身"：同样的 HTML、同样的 CSS、同样的 720px 宽度。深色预览通过 `nightCss` 叠一层主题化暗色，而不是给白卡加滤镜。链接点击在新标签打开，不改变稿面。桌垫滚动条统一 10px、胶囊滑块、18% 前景色（`color-mix`），轨道透明。

**收起与展开:** 卡头右侧一个隐藏按钮收起预览；收起后桌面右上角浮出"显示预览"胶囊，`视图` 菜单里也有同名勾选项。三处入口共享同一个持久化状态。展开／收起用 300ms `cubic-bezier(0.22, 1, 0.36, 1)` 过渡 `width`、`max-width`、`opacity`——卡片宽度连续变化，稿面跟着平移，不跳变。浮出按钮自身用 180ms 淡入加轻微下移。

## Do's and Don'ts

### Do:

- **Do** 用 1px `border` 加背景明度差分隔静态面板，保持零阴影。
- **Do** 把朱砂限制在主操作、光标、选区、当前选中项；一屏只出现一枚。
- **Do** 让圆角停在容器上：卡片圆，卡里的文字、代码、表格保持直角。
- **Do** 让预览尺寸与微信里一致：文章 720px、预览卡 720px、长图 375px。
- **Do** 让卡片贴着内容，不在卡内留出无意义的空边。
- **Do** 保持雾灰中性色的紫灰底子（色相 320–326，彩度 ≤ 0.034）。
- **Do** 用 11–12px 雾灰承载所有元信息。
- **Do** 改样式前先确认复制到微信的 CSS 内联仍然成立——预览好看但粘不过去，等于没做。

### Don't:

- **Don't** 在预览卡里再套一层白纸、再留一圈桌垫。
- **Don't** 给卡片加投影——深度只属于浮层。
- **Don't** 在界面里引入第二个强调色；"已保存"的绿点是指示器，不要再扩散成配色。
- **Don't** 用渐变、玻璃拟态、彩色统计卡片把工作台做成 SaaS 后台。
- **Don't** 把工作台做成营销落地页：没有 Hero、没有插画、没有滚动叙事。
- **Don't** 加纸纹、做旧、仿真装订——纸感来自比例与留白，不来自贴图。
- **Don't** 让文档区域依赖 CSS 变量、外部 class 或外部样式表；复制到微信必须是内联结果。
- **Don't** 重命名或替换 9 套主题的中文名与题记（墨影、松间、潮汐、暖沙、樱雾、紫藤、琥珀、报刊、素白）。
