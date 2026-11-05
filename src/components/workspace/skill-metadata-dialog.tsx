"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
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
  const [exampleOpen, setExampleOpen] = useState(false);

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
    if (validationErrors.length > 0) {
      toast.add({
        title: "元数据校验失败",
        description: validationErrors.join("；"),
        type: "error",
        timeout: 5000,
      });
      return;
    }

    onSave({ ...draft, metadata: customMetadata });
    onOpenChange(false);
  };

  return (
    <Dialog
      open
      disablePointerDismissal
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onOpenChange(false);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden sm:max-w-xl"
      >
        <DialogHeader className="shrink-0 gap-2">
          <DialogTitle>SKILL 元数据</DialogTitle>
          <DialogDescription>
            这些信息会写入 SKILL.md 顶部的 YAML Frontmatter。
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <div className="grid gap-6 py-2">
          <div className="grid gap-3">
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

          <div className="grid gap-3">
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

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-4">
            <div className="grid content-start gap-3">
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
            <div className="grid content-start gap-3">
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

          <div className="grid gap-3">
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

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
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
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {entries.length > 0 ? (
                  entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      layout="position"
                      initial={{ opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_2rem] gap-3 overflow-hidden"
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
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    key="empty-metadata"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-xs text-muted-foreground"
                  >
                    可添加作者、版本等键值信息。
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/20">
            <button
              type="button"
              aria-expanded={exampleOpen}
              aria-controls="skill-reference-example"
              onClick={() => setExampleOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm font-medium"
            >
              <span>完整元数据示例（YAML Frontmatter）</span>
              <motion.span
                animate={{ rotate: exampleOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex shrink-0"
              >
                <ChevronDown className="size-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {exampleOpen ? (
                <motion.div
                  id="skill-reference-example"
                  key="skill-reference-example"
                  initial={{ height: 0, opacity: 0, y: -4 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t"
                >
                  <div className="px-3 py-3">
                    <p className="mb-2 text-xs text-muted-foreground">
                      示例包含必填项和常用可选项，可按需填写上方字段。
                    </p>
                    <pre className="max-h-72 overflow-auto rounded-xl bg-background p-3 text-xs leading-relaxed whitespace-pre-wrap break-words">
                      <code>{`---
name: code-review
description: Review code changes for correctness, security, and maintainability. Use when reviewing a pull request or patch.
license: MIT
compatibility: Requires Git and access to the project source.
metadata:
  author: example-org
  version: "1.0"
allowed-tools: Read Grep
---`}</code>
                    </pre>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          </div>
        </div>

        <DialogFooter className="mt-4 shrink-0 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={save}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
