function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const site = {
  name: "墨排",
  title: "墨排 · Markdown 排版",
  tagline: "Markdown 排版",
  description:
    "本地优先的 Markdown 排版工具：实时预览、9 套文章主题、一键复制到微信公众号、导出长图与 Markdown。打开网页即可使用，无需登录，草稿只留在你的浏览器里。",
  keywords: [
    "Markdown 排版",
    "微信公众号排版",
    "公众号排版工具",
    "Markdown 编辑器",
    "Markdown 转微信",
    "微信图文排版",
    "长图导出",
    "在线 Markdown",
  ],
  locale: "zh_CN",
  language: "zh-CN",
  features: [
    "Markdown 实时预览",
    "9 套公众号文章主题",
    "一键复制到微信公众号",
    "导出 375px 长图",
    "KaTeX 公式、表格、代码高亮",
    "本地存储，无需登录",
  ],
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  alternateName: "Mopai",
  url: siteUrl,
  applicationCategory: "DesignApplication",
  applicationSubCategory: "Typesetting",
  operatingSystem: "Web",
  inLanguage: site.language,
  description: site.description,
  featureList: site.features,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
  },
};
