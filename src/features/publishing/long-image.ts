"use client";

import { mountArticle, type PublishOptions } from "./wechat-publish";
import { defaultExportName } from "./markdown-file";
import { ensureExtension, saveBlob } from "@/lib/download";

const exportWidth = 375;
const maximumArea = 16_777_216;
const maximumSide = 16_384;

function pixelRatio(height: number) {
  if (height <= 0) return 2;
  const bySide = maximumSide / height;
  const byArea = Math.sqrt(maximumArea / (exportWidth * height));
  return Math.max(0.5, Math.floor(Math.min(2, bySide, byArea) * 100) / 100);
}

async function waitForPaint(container: HTMLElement) {
  await Promise.all(
    Array.from(container.querySelectorAll("img")).map((image) =>
      image.complete ? Promise.resolve() : image.decode().catch(() => undefined),
    ),
  );
  await document.fonts?.ready.catch(() => undefined);
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

export interface LongImageOptions extends PublishOptions {
  fileName?: string;
}

export async function exportLongImage(
  markdown: string,
  options: LongImageOptions,
): Promise<void> {
  const dark = document.documentElement.classList.contains("dark");
  const host = await mountArticle(markdown, {
    ...options,
    width: exportWidth,
    inline: true,
    visible: true,
    dark,
  });

  try {
    host.querySelectorAll<HTMLElement>("pre > code").forEach((code) => {
      code.style.whiteSpace = "pre-wrap";
      code.style.overflowWrap = "anywhere";
    });

    host.querySelectorAll<HTMLElement>(".imageflow-layer2").forEach((layer) => {
      layer.style.whiteSpace = "normal";
      layer.style.overflowX = "visible";
    });
    host.querySelectorAll<HTMLElement>(".imageflow-layer3").forEach((item) => {
      item.style.display = "block";
      item.style.width = "100%";
      item.style.marginRight = "0";
    });
    host.querySelectorAll<HTMLElement>(".imageflow-caption").forEach((caption) => {
      caption.remove();
    });

    await waitForPaint(host);

    const ratio = pixelRatio(host.scrollHeight);
    const { snapdom } = await import("@zumer/snapdom");
    const canvas = await snapdom.toCanvas(host, {
      dpr: ratio,
      backgroundColor: dark ? "#17181c" : "#ffffff",
      embedFonts: "auto",
      fast: false,
    });

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) throw new Error("浏览器未能生成图片");

    const target = ensureExtension(
      options.fileName?.trim() || defaultExportName(markdown, "png"),
      "png",
    );
    saveBlob(blob, target);
  } finally {
    host.remove();
  }
}
