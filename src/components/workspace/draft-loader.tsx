import { cn } from "@/lib/utils";

/** 一行“正文”的宽度（占可视区宽度的百分比）；heading 只影响浓度。 */
const LINES = [
  { width: 100, heading: true },
  { width: 72 },
  { width: 100 },
  { width: 84 },
  { width: 94 },
  { width: 62 },
];

function Tile() {
  return (
    <div className="typeset-tile">
      {LINES.map(({ width, heading }, index) => (
        <span
          key={index}
          className="typeset-line"
          data-heading={heading ? "" : undefined}
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}

/**
 * 排版中 loading：一张稿纸里，文字一行行向上流动，像正文正被不断排出来。
 * 纯 HTML + CSS 实现（无 SVG、无 motion）：两个 tile 首尾拼接，
 * 位移正好等于一个 tile 周期，配合上下渐变遮罩形成无缝循环。
 */
export function DraftLoader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="正在读取本地草稿"
      className={cn(
        "flex h-dvh items-center justify-center bg-background",
        className,
      )}
    >
      <div className="typeset-loader" aria-hidden="true">
        <div className="typeset-window">
          <div className="typeset-track">
            <Tile />
            <Tile />
          </div>
        </div>
      </div>
    </div>
  );
}
