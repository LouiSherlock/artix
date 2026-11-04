import { saveAs } from "file-saver";

export function saveBlob(blob: Blob, fileName: string) {
  saveAs(blob, fileName);
}

export function ensureExtension(fileName: string, extension: string) {
  const trimmed = fileName.trim();
  const suffix = `.${extension.replace(/^\./, "")}`;
  return trimmed.toLowerCase().endsWith(suffix.toLowerCase())
    ? trimmed
    : `${trimmed}${suffix}`;
}

export function safeFileName(name: string, fallback = "未命名文章") {
  const cleaned = name
    .replace(/[\\/*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || fallback;
}
