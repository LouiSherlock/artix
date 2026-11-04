const removeEmptyStyle = (element: HTMLElement) => {
  if (element.style.length === 0 && element.hasAttribute("style")) {
    element.removeAttribute("style");
  }
};

const toEmoji = (checked: boolean) => (checked ? "✅&nbsp;" : "⬜&nbsp;");

function materializeTaskLists(container: HTMLElement) {
  container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => {
    const emoji = document.createElement("span");
    emoji.innerHTML = toEmoji(input.checked);
    emoji.className = "task-emoji";
    input.replaceWith(emoji);
  });
}

function relocateRootPadding(container: HTMLElement) {
  const root = container.firstElementChild;
  if (!(root instanceof HTMLElement)) return;

  const style = window.getComputedStyle(root);
  const hasPadding = ["top", "right", "bottom", "left"].some(
    (side) => Number.parseFloat(style.getPropertyValue(`padding-${side}`)) > 0,
  );

  const inner = document.createElement("div");
  inner.setAttribute("data-md-inner", "");
  inner.style.width = "100%";
  inner.style.boxSizing = "border-box";
  inner.style.background = "inherit";

  const background = style.backgroundColor;
  if (background && background !== "rgba(0, 0, 0, 0)") {
    inner.style.backgroundColor = background;
    root.style.backgroundColor = background;
  }

  if (hasPadding) {
    inner.style.paddingTop = style.paddingTop;
    inner.style.paddingRight = style.paddingRight;
    inner.style.paddingBottom = style.paddingBottom;
    inner.style.paddingLeft = style.paddingLeft;
  }

  while (root.firstChild) {
    inner.appendChild(root.firstChild);
  }
  root.appendChild(inner);

  root.style.padding = "0";
  if (!root.style.maxWidth) root.style.maxWidth = "720px";
  if (!root.style.marginLeft) root.style.margin = "0 auto";
}

function normalizeBlockColors(container: HTMLElement) {
  const selectors = "p, li, td, th, h1, h2, h3, h4, h5, h6, blockquote, figcaption";
  container.querySelectorAll<HTMLElement>(selectors).forEach((element) => {
    if (element.style.color) return;
    const color = window.getComputedStyle(element).color;
    if (color) element.style.color = color;
  });
}

function normalizeCode(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("pre").forEach((pre) => {
    pre.style.overflowX = "auto";
    pre.style.setProperty("-webkit-overflow-scrolling", "touch");
    pre.style.whiteSpace = "pre";
    pre.style.marginTop = pre.style.marginTop || "20px";
    pre.style.marginBottom = pre.style.marginBottom || "20px";
    removeEmptyStyle(pre);
  });

  container.querySelectorAll<HTMLElement>("pre code").forEach((code) => {
    code.style.whiteSpace = "pre";
    code.style.textAlign = "left";
    code.style.letterSpacing = "0";
    code.style.wordSpacing = "0";
    removeEmptyStyle(code);
  });
}

function normalizeTables(container: HTMLElement, tableWrap: boolean) {
  container.querySelectorAll<HTMLElement>("table").forEach((table) => {
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.borderSpacing = "0";

    table.querySelectorAll<HTMLElement>("th, td").forEach((cell) => {
      cell.style.whiteSpace = tableWrap ? "normal" : "nowrap";
      if (tableWrap) {
        cell.style.wordBreak = "break-word";
        cell.style.overflowWrap = "anywhere";
      }
      removeEmptyStyle(cell);
    });
    removeEmptyStyle(table);
  });

  container.querySelectorAll<HTMLElement>(".table-shell").forEach((shell) => {
    shell.style.overflowX = "auto";
    shell.style.setProperty("-webkit-overflow-scrolling", "touch");
    removeEmptyStyle(shell);
  });
}

function normalizeImages(container: HTMLElement) {
  container.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    image.style.maxWidth = "100%";
    image.style.height = "auto";
    image.style.display = "block";
    if (!image.style.marginLeft) image.style.marginLeft = "auto";
    if (!image.style.marginRight) image.style.marginRight = "auto";
    removeEmptyStyle(image);
  });
}

function normalizeAlignment(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[style]").forEach((element) => {
    const align = element.style.textAlign.toLowerCase();
    if (align === "start") element.style.textAlign = "left";
    if (align === "end") element.style.textAlign = "right";
    element.style.removeProperty("caret-color");
    removeEmptyStyle(element);
  });
}

function stripMetadata(container: HTMLElement) {
  const root = container.firstElementChild;
  if (!(root instanceof HTMLElement)) return;

  root.removeAttribute("id");
  root.querySelectorAll<HTMLElement>("[data-tool]").forEach((node) => {
    node.removeAttribute("data-tool");
  });

  container.querySelectorAll<HTMLElement>("*").forEach((element) => {
    Array.from(element.attributes)
      .filter(
        (attribute) =>
          attribute.name.startsWith("data-") ||
          attribute.name.startsWith("on") ||
          attribute.name === "contenteditable",
      )
      .forEach((attribute) => element.removeAttribute(attribute.name));
    element.removeAttribute("id");
    removeEmptyStyle(element);
  });

  container.querySelectorAll("style, script, link, meta").forEach((node) => node.remove());
}

function transformRootToDiv(container: HTMLElement) {
  const root = container.firstElementChild;
  if (
    !(root instanceof HTMLElement) ||
    root.id !== "artix" ||
    container.childElementCount !== 1
  ) {
    return;
  }

  const replacement = document.createElement("div");
  Array.from(root.attributes).forEach((attribute) => {
    replacement.setAttribute(attribute.name, attribute.value);
  });
  replacement.innerHTML = root.innerHTML;
  container.replaceChildren(replacement);
}

export interface NormalizeOptions {
  tableWrap: boolean;
}

export function normalizeForWechat(
  container: HTMLElement,
  options: NormalizeOptions,
) {
  materializeTaskLists(container);
  relocateRootPadding(container);
  normalizeBlockColors(container);
  normalizeCode(container);
  normalizeTables(container, options.tableWrap);
  normalizeImages(container);
  normalizeAlignment(container);
  transformRootToDiv(container);
  stripMetadata(container);
}
