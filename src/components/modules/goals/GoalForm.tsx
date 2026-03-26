/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { cn } from "@/src/lib/utils";

const goalSchema = z.object({
  title: z.string().min(1, "Nama goal wajib diisi"),
  description: z.string().optional(),
  target: z.number().min(1, "Target harus lebih dari 0"),
  current: z.number().min(0, "Saldo awal tidak boleh negatif"),
  deadline: z.string(),
  icon: z.string(),
  color: z.string(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalFormProps {
  onClose: () => void;
  onSubmit: (data: GoalFormValues) => void;
}

export function GoalForm({ onClose, onSubmit }: GoalFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      current: 0,
      icon: "Target",
      color: "bg-primary",
    }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg shadow-modal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Buat Goal Baru</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Nama Goal</label>
            <input
              {...register("title")}
              placeholder="Contoh: Liburan ke Jepang"
              className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
            />
            {errors.title && <p className="text-[10px] text-tertiary">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Target (Rp)</label>
              <input
                {...register("target", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
              />
              {errors.target && <p className="text-[10px] text-tertiary">{errors.target.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Saldo Awal (Rp)</label>
              <input
                {...register("current", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Deadline</label>
            <input
              {...register("deadline")}
              type="date"
              className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Deskripsi (Opsional)</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-base-700 border border-base-600 rounded-lg p-4 text-sm focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1">Buat Goal</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
