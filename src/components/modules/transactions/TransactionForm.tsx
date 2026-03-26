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

const transactionSchema = z.object({
  name: z.string().min(1, "Nama transaksi wajib diisi"),
  amount: z.number().min(1, "Nominal harus lebih dari 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Kategori wajib dipilih"),
  date: z.string(),
  description: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (data: TransactionFormValues) => void;
}

export function TransactionForm({ onClose, onSubmit }: TransactionFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      date: new Date().toISOString().split('T')[0],
    }
  });

  const type = watch("type");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg shadow-modal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Tambah Transaksi</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex p-1 bg-base-700 rounded-lg">
            <button
              type="button"
              onClick={() => setValue("type", "EXPENSE")}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                type === "EXPENSE" ? "bg-base-800 text-white shadow-sm" : "text-text-muted"
              )}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "INCOME")}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                type === "INCOME" ? "bg-base-800 text-white shadow-sm" : "text-text-muted"
              )}
            >
              Pemasukan
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Nama Transaksi</label>
            <input
              {...register("name")}
              placeholder="Contoh: Kopi Pagi"
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
                <option value="Food">Makanan & Minuman</option>
                <option value="Transport">Transportasi</option>
                <option value="Groceries">Belanja</option>
                <option value="Entertainment">Hiburan</option>
                <option value="Health">Kesehatan</option>
                <option value="Other">Lainnya</option>
              </select>
              {errors.category && <p className="text-[10px] text-tertiary">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Tanggal</label>
            <input
              {...register("date")}
              type="date"
              className="w-full h-11 bg-base-700 border border-base-600 rounded-lg px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Catatan (Opsional)</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-base-700 border border-base-600 rounded-lg p-4 text-sm focus:border-primary focus:outline-none resize-none"
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
