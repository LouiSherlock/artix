/**
 * MathJax 按需加载（tex-svg）。
 *
 * 预览仍使用 KaTeX，见 features/markdown/plugins/math.ts。
 * 这里只在“复制到公众号”时使用：微信会清洗 KaTeX 依赖的 `display:inline-table`、
 * 绝对定位、负 margin 等布局属性，导致公式散架。MathJax 的 SVG 输出是自包含的
 * 字形轮廓，粘贴到公众号后不依赖任何外部字体或 CSS。
 */

const MATHJAX_BASE = "/libs/mathjax";
const SCRIPT_ID = "artix-mathjax";
const CONFIG_VERSION = 1;

/** tex-svg 已内置 base/ams 等，额外扩展从本地 es5 目录加载。 */
const TEX_PACKAGES = [
  "base",
  "ams",
  "newcommand",
  "configmacros",
  "color",
  "boldsymbol",
  "cancel",
  "enclose",
] as const;

/**
 * 补上 KaTeX 认识、MathJax 默认不认识的同义命令，
 * 避免预览正常但复制后报错：
 * - `\bm` 是 `\boldsymbol` 的常用简写
 * - `\sout` 对应 enclose 扩展的水平删除线
 */
const TEX_MACROS: Record<string, string | [string, number]> = {
  bm: ["\\boldsymbol{#1}", 1],
  sout: ["\\enclose{horizontalstrike}{#1}", 1],
};

let pending: Promise<boolean> | null = null;

export function isMathJaxReady(): boolean {
  if (typeof window === "undefined") return false;
  if (window.__artixMathJaxVersion !== CONFIG_VERSION) return false;
  const mathJax = window.MathJax;
  return Boolean(mathJax?.tex2svg || mathJax?.tex2svgPromise);
}

/**
 * 加载 MathJax。加载失败时返回 false（而不是抛错），
 * 这样复制流程可以退回原有的 KaTeX 输出。
 */
export function loadMathJax(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (isMathJaxReady()) return Promise.resolve(true);
  if (pending) return pending;

  pending = new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (ready: boolean) => {
      if (settled) return;
      settled = true;
      if (!ready) pending = null;
      resolve(ready);
    };

    document.getElementById(SCRIPT_ID)?.remove();
    delete window.MathJax;

    window.MathJax = {
      tex: {
        packages: [...TEX_PACKAGES],
        macros: { ...TEX_MACROS },
        inlineMath: [["$", "$"]],
        displayMath: [["$$", "$$"]],
        tags: "ams",
      },
      svg: {
        // 每个公式的 SVG 自带字形路径，脱离页面字体缓存也能完整显示
        fontCache: "none",
      },
      options: {
        renderActions: {
          addMenu: [0, "", ""],
        },
      },
      startup: {
        typeset: false,
        ready: () => {
          window.MathJax?.startup?.defaultReady?.();
          const startupPromise = window.MathJax?.startup?.promise;
          if (startupPromise && typeof startupPromise.then === "function") {
            startupPromise
              .then(() => {
                window.__artixMathJaxVersion = CONFIG_VERSION;
                finish(true);
              })
              .catch(() => finish(false));
          } else {
            window.__artixMathJaxVersion = CONFIG_VERSION;
            finish(true);
          }
        },
      },
      loader: {
        paths: { mathjax: `${MATHJAX_BASE}/es5` },
        load: ["[tex]/color", "[tex]/boldsymbol", "[tex]/cancel", "[tex]/enclose"],
        failed: () => finish(false),
      },
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `${MATHJAX_BASE}/tex-svg.js`;
    script.async = true;
    script.onerror = () => finish(false);
    document.head.appendChild(script);
  });

  return pending;
}
