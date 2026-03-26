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

const billSchema = z.object({
  name: z.string().min(1, "Nama tagihan wajib diisi"),
  amount: z.number().min(1, "Nominal harus lebih dari 0"),
  dueDate: z.string(),
  recurrence: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]),
  category: z.string().min(1, "Kategori wajib dipilih"),
  reminderDays: z.number().min(0, "Minimal 0 hari"),
});

type BillFormValues = z.infer<typeof billSchema>;

interface BillFormProps {
  onClose: () => void;
  onSubmit: (data: BillFormValues) => void;
}

export function BillForm({ onClose, onSubmit }: BillFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      recurrence: "MONTHLY",
      reminderDays: 3,
    }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg shadow-modal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Tambah Tagihan</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Nama Tagihan</label>
            <input
              {...register("name")}
              placeholder="Contoh: Netflix Premium"
              className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
            />
            {errors.name && <p className="text-[10px] text-tertiary">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Nominal (Rp)</label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
              />
              {errors.amount && <p className="text-[10px] text-tertiary">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Kategori</label>
              <select
                {...register("category")}
                className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Pilih Kategori</option>
                <option value="Entertainment">Hiburan</option>
                <option value="Utilities">Utilitas (Listrik, Air)</option>
                <option value="Internet">Internet & Pulsa</option>
                <option value="Rent">Sewa / Kost</option>
                <option value="Other">Lainnya</option>
              </select>
              {errors.category && <p className="text-[10px] text-tertiary">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Jatuh Tempo</label>
              <input
                {...register("dueDate")}
                type="date"
                className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Pengulangan</label>
              <select
                {...register("recurrence")}
                className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
              >
                <option value="MONTHLY">Bulanan</option>
                <option value="WEEKLY">Mingguan</option>
                <option value="YEARLY">Tahunan</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Ingatkan (H- hari)</label>
            <input
              {...register("reminderDays", { valueAsNumber: true })}
              type="number"
              className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1">Simpan</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
