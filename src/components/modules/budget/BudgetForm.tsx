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

const budgetSchema = z.object({
  category: z.string().min(1, "Kategori wajib dipilih"),
  limit: z.number().min(1, "Limit harus lebih dari 0"),
  period: z.string(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  onClose: () => void;
  onSubmit: (data: BudgetFormValues) => void;
}

export function BudgetForm({ onClose, onSubmit }: BudgetFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: "MONTHLY",
    }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg shadow-modal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Atur Budget</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Kategori</label>
            <select
              {...register("category")}
              className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Pilih Kategori</option>
              <option value="Food">Makanan & Minuman</option>
              <option value="Transport">Transportasi</option>
              <option value="Groceries">Belanja Bulanan</option>
              <option value="Entertainment">Hiburan</option>
              <option value="Health">Kesehatan</option>
              <option value="Other">Lainnya</option>
            </select>
            {errors.category && <p className="text-[10px] text-tertiary">{errors.category.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Limit Bulanan (Rp)</label>
            <input
              {...register("limit", { valueAsNumber: true })}
              type="number"
              placeholder="0"
              className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
            />
            {errors.limit && <p className="text-[10px] text-tertiary">{errors.limit.message}</p>}
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-xs text-primary leading-relaxed">
              💡 <strong>Tips:</strong> Atur budget sesuai dengan rata-rata pengeluaranmu 3 bulan terakhir agar lebih realistis.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1">Simpan Budget</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
