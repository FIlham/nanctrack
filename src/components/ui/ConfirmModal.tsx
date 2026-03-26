/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "danger"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-sm shadow-modal border-base-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-tertiary">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold">{title}</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-text-muted mb-6">
          {description}
        </p>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === "danger" ? "secondary" : "primary"} 
            className="flex-1" 
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
