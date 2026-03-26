/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

interface InputModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function InputModal({
  isOpen,
  title,
  description,
  placeholder = "",
  defaultValue = "",
  type = "text",
  onConfirm,
  onCancel,
  confirmText = "Simpan",
  cancelText = "Batal"
}: InputModalProps) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (isOpen) setValue(defaultValue);
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(value);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-sm shadow-modal border-base-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-text-muted mb-4">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            autoFocus
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
          />

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button type="submit" className="flex-1">
              {confirmText}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
