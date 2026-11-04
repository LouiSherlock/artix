"use client";

import { useState } from "react";

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
import { ensureExtension } from "@/lib/download";

interface ExportNameDialogProps {
  title: string;
  description: string;
  extension: "md" | "png";
  defaultName: string;
  onConfirm: (fileName: string) => void;
  onClose: () => void;
}

export function ExportNameDialog({
  title,
  description,
  extension,
  defaultName,
  onConfirm,
  onClose,
}: ExportNameDialogProps) {
  const [name, setName] = useState(defaultName);

  const confirm = () => {
    const value = name.trim() || defaultName;
    onConfirm(ensureExtension(value, extension));
    onClose();
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Label htmlFor="export-file-name">文件名</Label>
          <Input
            id="export-file-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                confirm();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={confirm}>导出</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
