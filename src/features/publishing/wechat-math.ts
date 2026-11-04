import { loadMathJax } from "./mathjax";

/**
 * 把 KaTeX 输出的公式替换成 MathJax 生成的自包含 SVG。
 *
 * 微信公众号会丢弃 `inline-table`、`position:absolute`、负 margin、`clip-path`
 * 等属性，KaTeX 的 HTML 排版因此会散架（上下标、根号、分式全部错位）。
 * 内联 SVG 只依赖 `width/height`，粘贴后可以稳定还原公式。
 */

const LOAD_TIMEOUT_MS = 8000;
const RENDER_TIMEOUT_MS = 8000;
const MAX_RETRIES = 5;

const MATH_SELECTOR = ".inline-equation[data-latex], .block-equation[data-latex]";
const ERROR_SELECTOR = "mjx-merror, merror, [data-mjx-error]";

export interface MathConversionResult {
  total: number;
  converted: number;
  failed: number;
  /** MathJax 未就绪，公式保持 KaTeX 原样。 */
  skipped: boolean;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error("公式渲染超时")),
      timeoutMs,
    );
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** MathJax 按需加载扩展时会抛出带 retry 承诺的错误，重试耗尽后按普通失败处理。 */
async function renderWithRetry(
  render: () => Promise<HTMLElement>,
  retriesLeft = MAX_RETRIES,
): Promise<HTMLElement> {
  try {
    return await render();
  } catch (error) {
    const retry =
      typeof error === "object" && error !== null && "retry" in error
        ? (error as { retry?: unknown }).retry
        : undefined;
    if (
      !retry ||
      retriesLeft <= 0 ||
      typeof retry !== "object" ||
      !("then" in retry) ||
      typeof (retry as PromiseLike<unknown>).then !== "function"
    ) {
      throw error;
    }

    await (retry as PromiseLike<unknown>);
    return renderWithRetry(render, retriesLeft - 1);
  }
}

/** `\bm` / `\boldsymbol` 在某些扩展缺失时会失败，降级成 `\mathbf` 再试一次。 */
function latexCandidates(latex: string): string[] {
  const simplified = latex
    .replace(/\\bm(?![a-zA-Z])/g, "\\mathbf")
    .replace(/\\boldsymbol(?![a-zA-Z])/g, "\\mathbf");
  return simplified === latex ? [latex] : [latex, simplified];
}

function isDefaultBlack(value: string): boolean {
  return ["black", "#000", "#000000", "rgb(0,0,0)", "rgba(0,0,0,1)"].includes(
    value.trim().toLowerCase().replace(/\s+/g, ""),
  );
}

/** 黑色字形改成 currentColor，公众号切换暗色模式时公式跟随正文颜色。 */
function applyCurrentColor(svg: SVGElement): void {
  const retarget = (element: Element) => {
    // MathJax 用 data-bgcolor 标记 \colorbox / \bbox 的背景块，改色会让内容消失
    if (element.hasAttribute("data-bgcolor")) return;

    for (const attribute of ["fill", "stroke"] as const) {
      const value = element.getAttribute(attribute);
      if (value && isDefaultBlack(value)) {
        element.setAttribute(attribute, "currentColor");
      }

      if ("style" in element && element.style instanceof CSSStyleDeclaration) {
        const styled = element.style.getPropertyValue(attribute);
        if (isDefaultBlack(styled)) {
          element.style.setProperty(attribute, "currentColor");
        }
      }
    }
  };

  retarget(svg);
  svg.querySelectorAll("[fill], [stroke], [style]").forEach(retarget);
}

function normalizeSvg(source: SVGElement, display: boolean): SVGElement {
  const svg = source.cloneNode(true) as SVGElement;
  const width = svg.getAttribute("width") || svg.style.width || svg.style.minWidth;
  const height = svg.getAttribute("height") || svg.style.height;
  const hasViewBox = svg.hasAttribute("viewBox");

  // 公众号对 width/height 属性的处理不稳定，改成 style 交给浏览器缩放
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.style.removeProperty("min-width");
  if (width) svg.style.width = width;
  svg.style.height = hasViewBox || !height ? "auto" : height;
  svg.style.maxWidth = "100%";
  applyCurrentColor(svg);

  if (display) {
    svg.style.display = "block";
    svg.style.margin = "1em auto";
  } else {
    // 某些编辑器/主题会给全局 svg 加 display:block，显式声明避免行内公式掉行
    svg.style.display = "inline";
  }

  return svg;
}

async function renderLatexToSvg(
  latex: string,
  display: boolean,
): Promise<SVGElement> {
  const mathJax = window.MathJax;
  if (!mathJax?.tex2svg && !mathJax?.tex2svgPromise) {
    throw new Error("MathJax 尚未就绪");
  }
  mathJax.texReset?.();

  let lastError: unknown;
  for (const candidate of latexCandidates(latex)) {
    try {
      const output = await renderWithRetry(() =>
        mathJax.tex2svgPromise
          ? mathJax.tex2svgPromise(candidate, { display })
          : Promise.resolve(mathJax.tex2svg!(candidate, { display })),
      );
      const svg = output.querySelector("svg");
      if (
        !svg ||
        output.matches(ERROR_SELECTOR) ||
        output.querySelector(ERROR_SELECTOR)
      ) {
        throw new Error("MathJax 未能渲染该公式");
      }
      return normalizeSvg(svg, display);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("公式渲染失败");
}

/**
 * KaTeX 会输出隐藏 MathML 与 TeX annotation，微信清洗样式后可能把源码暴露出来，
 * 因此无论公式是否转成 SVG，都先删掉这些隐藏节点。
 */
function stripHiddenMathMarkup(container: HTMLElement) {
  container.querySelectorAll(".katex-mathml").forEach((node) => node.remove());
  container
    .querySelectorAll('annotation[encoding="application/x-tex"]')
    .forEach((node) => node.remove());
  container.querySelectorAll<HTMLElement>("[data-latex]").forEach((node) => {
    node.removeAttribute("data-latex");
  });
}

export async function convertMathToSvg(
  container: HTMLElement,
): Promise<MathConversionResult> {
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(MATH_SELECTOR));
  const result: MathConversionResult = {
    total: nodes.length,
    converted: 0,
    failed: 0,
    skipped: false,
  };

  try {
    if (nodes.length === 0) return result;

    const ready = await withTimeout(loadMathJax(), LOAD_TIMEOUT_MS).catch(
      () => false,
    );
    if (!ready) {
      result.skipped = true;
      return result;
    }

    for (const node of nodes) {
      const latex = node.getAttribute("data-latex") ?? "";
      const display = node.classList.contains("block-equation");

      try {
        const svg = await withTimeout(
          renderLatexToSvg(latex, display),
          RENDER_TIMEOUT_MS,
        );
        node.replaceChildren(svg);
        node.removeAttribute("data-latex");

        if (display) {
          if (!node.style.display) node.style.display = "block";
          if (!node.style.textAlign) node.style.textAlign = "center";
        }
        result.converted += 1;
      } catch {
        // 单个公式失败不应阻塞整篇复制，退回可读的 LaTeX 原文
        node.textContent = display ? `$$${latex}$$` : `$${latex}$`;
        node.removeAttribute("data-latex");
        result.failed += 1;
      }
    }

    return result;
  } finally {
    stripHiddenMathMarkup(container);
  }
}
