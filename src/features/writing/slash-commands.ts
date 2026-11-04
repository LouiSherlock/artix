import {
  snippetCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";
import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import type { EditorState } from "@codemirror/state";

interface SlashCommand extends Completion {
  /** 额外别名，只参与本地匹配，不显示在列表里。 */
  aliases: string[];
}

const SECTION_RANK: Record<string, number> = {
  标题: 1,
  列表: 2,
  内容块: 3,
  行内: 4,
  插入: 5,
};

function command(
  template: string,
  label: string,
  detail: string,
  section: string,
  aliases: string[] = [],
): SlashCommand {
  return {
    ...snippetCompletion(template, {
      label,
      detail,
      section: { name: section, rank: SECTION_RANK[section] },
    }),
    aliases,
  };
}

/** `/` 触发的 Markdown 片段命令，tab 可在 ${...} 占位符之间跳转。 */
const COMMANDS: SlashCommand[] = [
  command("# ${标题}", "/h1", "一级标题", "标题", ["标题", "heading"]),
  command("## ${标题}", "/h2", "二级标题", "标题", ["标题", "heading"]),
  command("### ${标题}", "/h3", "三级标题", "标题", ["标题", "heading"]),

  command("- ${}", "/ul", "无序列表", "列表", ["列表", "list"]),
  command("1. ${}", "/ol", "有序列表", "列表", ["编号", "list"]),
  command("- [ ] ${}", "/todo", "待办事项", "列表", ["任务", "task"]),

  command("> ${}", "/quote", "引用", "内容块", ["引用块", "blockquote"]),
  command("> [!TIP]\n> ${}", "/tip", "提示块", "内容块", ["提示", "callout"]),
  command("```${js}\n${}\n```", "/code", "代码块", "内容块", ["代码", "fence"]),
  command(
    "| ${列1} | ${列2} |\n| --- | --- |\n| ${} | ${} |",
    "/table",
    "表格",
    "内容块",
    ["表格", "table"],
  ),
  command("$$\n${}\n$$\n", "/math", "块级公式", "内容块", ["公式", "latex"]),
  command("---\n", "/hr", "分割线", "内容块", ["分割", "divider"]),

  command("==${}==", "/mark", "高亮", "行内", ["高亮", "highlight"]),
  command("++${}++", "/under", "下划线", "行内", ["下划线", "underline"]),
  command("[${文字}](${https://})", "/link", "链接", "行内", ["链接", "url"]),
  command("![${描述}](${url})", "/image", "图片", "行内", ["图片", "img"]),

  command("[toc]\n", "/toc", "目录", "插入", ["目录", "outline"]),
  command("${术语}\n: ${解释}\n", "/def", "定义列表", "插入", ["定义"]),
];

const CODE_NODE_NAMES = new Set(["FencedCode", "CodeBlock", "InlineCode"]);

function insideCode(state: EditorState, pos: number): boolean {
  // 输入到新行时语法树可能还没跟上，先尽力同步解析一次
  const tree = ensureSyntaxTree(state, pos, 100) ?? syntaxTree(state);
  let node = tree.resolveInner(pos, -1);
  for (;;) {
    if (CODE_NODE_NAMES.has(node.name)) return true;
    if (!node.parent) return false;
    node = node.parent;
  }
}

function score(command: SlashCommand, query: string): number {
  if (!query) return 0;
  const terms = [
    command.label.replace(/^\//, ""),
    command.detail ?? "",
    ...command.aliases,
  ].map((text) => text.toLowerCase());

  let best = Number.POSITIVE_INFINITY;
  for (const term of terms) {
    if (term === query) best = Math.min(best, 0);
    else if (term.startsWith(query)) best = Math.min(best, 1);
    else if (term.includes(query)) best = Math.min(best, 3);
  }
  return best;
}

/**
 * 斜杠命令补全源：只在一行开头或空白后的 `/` 触发，
 * 自己按 label / 说明 / 中文别名过滤，所以 `/表格` 也能命中。
 */
export function slashCommandSource(
  context: CompletionContext,
): CompletionResult | null {
  const word = context.matchBefore(/\/[^\s]*/);
  if (!word) return null;

  // 避免 http://、a/b 这类位置误触发
  if (word.from > 0) {
    const previous = context.state.sliceDoc(word.from - 1, word.from);
    if (!/\s/.test(previous)) return null;
  }

  if (insideCode(context.state, word.from)) return null;

  const query = word.text.slice(1).toLowerCase();
  const ranked = COMMANDS.map((item) => ({ item, rank: score(item, query) }))
    .filter((entry) => entry.rank !== Number.POSITIVE_INFINITY);

  if (ranked.length === 0) return null;

  // 有前缀/完全匹配时只留下这一档，避免「表」把「列表」也带出来
  const bestRank = Math.min(...ranked.map((entry) => entry.rank));
  const options = ranked
    .filter((entry) => entry.rank <= Math.max(bestRank, 1))
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => entry.item);

  return {
    from: word.from,
    options,
    // 过滤已经在上面做过，交给 CodeMirror 就不再重复匹配
    filter: false,
  };
}
