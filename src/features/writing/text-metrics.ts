export function articleTitle(markdown: string): string {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;
  const firstLine = markdown
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith("```"));
  return firstLine?.replace(/^#+\s*/, "").slice(0, 80) || "未命名文章";
}

export function setArticleTitle(markdown: string, title: string): string {
  const nextTitle = title.trim() || "未命名文章";
  if (/^#\s+.+$/m.test(markdown)) {
    return markdown.replace(/^#\s+.+$/m, `# ${nextTitle}`);
  }
  return `# ${nextTitle}\n\n${markdown.trimStart()}`;
}

export function countCharacters(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/==(.*?)==/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "")
    .trim().length;
}

export function countLines(markdown: string): number {
  if (!markdown.trim()) return 0;
  return markdown.split("\n").length;
}
