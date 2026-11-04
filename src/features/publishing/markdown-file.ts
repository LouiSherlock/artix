import { format } from "date-fns";

import { ensureExtension, safeFileName, saveBlob } from "@/lib/download";

export function exportMarkdown(markdown: string, fileName?: string) {
  const target = ensureExtension(
    fileName?.trim() || defaultExportName(markdown, "md"),
    "md",
  );
  saveBlob(
    new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
    target,
  );
}

export async function readMarkdownFile(file: File): Promise<string> {
  const text = await file.text();
  return text.replace(/^\uFEFF/, "");
}

export function defaultExportName(markdown: string, extension: string) {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const base = heading
    ? safeFileName(heading)
    : `未命名文件 ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`;
  return `${base}.${extension}`;
}
