"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type SkillMetadata,
  validateSkillMetadata,
} from "@/features/skills/frontmatter";

interface SkillMetadataDialogProps {
  metadata: SkillMetadata;
  onOpenChange: (open: boolean) => void;
  onSave: (metadata: SkillMetadata) => void;
}

interface MetadataEntry {
  id: number;
  key: string;
  value: string;
}

export function SkillMetadataDialog({
  metadata,
  onOpenChange,
  onSave,
}: SkillMetadataDialogProps) {
  const [draft, setDraft] = useState(metadata);
  const [entries, setEntries] = useState<MetadataEntry[]>(() =>
    Object.entries(metadata.metadata).map(([key, value], id) => ({
      id,
      key,
      value,
    })),
  );
  const [nextEntryId, setNextEntryId] = useState(
    () => Object.keys(metadata.metadata).length,
  );

  const customMetadata = Object.fromEntries(
    entries
      .map(({ key, value }) => [key.trim(), value] as const)
      .filter(([key]) => key.length > 0),
  );
  const nonEmptyKeys = entries.map(({ key }) => key.trim()).filter(Boolean);
  const hasDuplicateKeys = new Set(nonEmptyKeys).size !== nonEmptyKeys.length;
  const validationErrors = validateSkillMetadata({
    ...draft,
    metadata: customMetadata,
  });
  if (hasDuplicateKeys) validationErrors.push("metadata 的键不能重复");

  const save = () => {
    onSave({ ...draft, metadata: customMetadata });
    onOpenChange(false);
  };

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onOpenChange(false);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>SKILL 元数据</DialogTitle>
          <DialogDescription>
            这些信息会写入 SKILL.md 顶部的 YAML Frontmatter。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-1">
          <div className="grid gap-2">
            <Label htmlFor="skill-name">name（必填）</Label>
            <Input
              id="skill-name"
              value={draft.name}
              maxLength={64}
              placeholder="例如：code-review"
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              1–64 位小写字母、数字或连字符，不能以连字符开头或结尾。
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="skill-description">description（必填）</Label>
            <Textarea
              id="skill-description"
              value={draft.description}
              maxLength={1024}
              rows={3}
              placeholder="说明这个技能做什么，以及何时应该使用它。"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
            <p className="text-right text-xs text-muted-foreground">
              {[...draft.description].length}/1024
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <div className="grid content-start gap-2">
              <Label htmlFor="skill-license">license（可选）</Label>
              <Input
                id="skill-license"
                value={draft.license}
                placeholder="例如：MIT"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, license: event.target.value }))
                }
              />
            </div>
            <div className="grid content-start gap-2">
              <Label htmlFor="skill-compatibility">compatibility（可选）</Label>
              <Input
                id="skill-compatibility"
                value={draft.compatibility}
                maxLength={500}
                placeholder="运行环境或依赖要求"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    compatibility: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="skill-allowed-tools">
              allowed-tools（可选，实验性）
            </Label>
            <Input
              id="skill-allowed-tools"
              value={draft.allowedTools}
              placeholder="例如：Read Grep"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  allowedTools: event.target.value,
                }))
              }
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label>扩展 metadata（可选）</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEntries((current) => [
                    ...current,
                    { id: nextEntryId, key: "", value: "" },
                  ]);
                  setNextEntryId((current) => current + 1);
                }}
              >
                <Plus />
                添加字段
              </Button>
            </div>
            {entries.length > 0 ? (
              <div className="grid gap-2">
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_2rem] gap-2"
                  >
                    <Input
                      aria-label={`metadata 键 ${index + 1}`}
                      value={entry.key}
                      placeholder="键，例如：author"
                      onChange={(event) =>
                        setEntries((current) =>
                          current.map((item) =>
                            item.id === entry.id
                              ? { ...item, key: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <Input
                      aria-label={`metadata 值 ${index + 1}`}
                      value={entry.value}
                      placeholder="值，例如：团队名称"
                      onChange={(event) =>
                        setEntries((current) =>
                          current.map((item) =>
                            item.id === entry.id
                              ? { ...item, value: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`删除 metadata 字段 ${index + 1}`}
                      onClick={() =>
                        setEntries((current) =>
                          current.filter((item) => item.id !== entry.id),
                        )
                      }
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                可添加作者、版本等键值信息。
              </p>
            )}
          </div>

          {validationErrors.length > 0 ? (
            <div
              role="status"
              className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-700 dark:text-amber-300"
            >
              {validationErrors.join("；")}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={save}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
