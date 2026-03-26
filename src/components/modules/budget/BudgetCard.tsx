/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { MoreVertical, AlertCircle, Trash2 } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { Button } from "@/src/components/ui/Button";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { formatCurrency, cn } from "@/src/lib/utils";
import { useFinanceStore } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";

interface BudgetCardProps {
  id: string;
  category: string;
  spent: number;
  limit: number;
  period: string;
}

export function BudgetCard({ id, category, spent, limit, period }: BudgetCardProps) {
  const { deleteBudget } = useFinanceStore();
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const percentage = (spent / limit) * 100;
  const isNearLimit = percentage >= 80 && percentage < 100;
  const isOverLimit = percentage >= 100;

  const color = isOverLimit ? "bg-tertiary" : isNearLimit ? "bg-warning" : "bg-primary";

  const handleDelete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await deleteBudget(user.id, id);
    }
    setIsDeleteOpen(false);
  };

  return (
    <Card className="flex flex-col gap-4 transition-all hover:border-primary/50">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold">{category}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-tertiary hover:bg-tertiary/10" onClick={() => setIsDeleteOpen(true)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Terpakai</span>
          <span className="font-bold">{formatCurrency(spent)} / {formatCurrency(limit)}</span>
        </div>
        <ProgressBar value={spent} max={limit} color={color} />
        <div className="flex items-center justify-between text-[10px] text-text-muted">
          <span>{Math.round(percentage)}% terpakai</span>
          <span>Sisa: {formatCurrency(Math.max(limit - spent, 0))}</span>
        </div>
      </div>

      {(isNearLimit || isOverLimit) && (
        <div className={cn(
          "flex items-center gap-2 rounded-md p-2 text-[10px] font-medium",
          isOverLimit ? "bg-tertiary/10 text-tertiary" : "bg-warning/10 text-warning"
        )}>
          <AlertCircle className="h-3 w-3" />
          <span>{isOverLimit ? "Budget sudah melebihi batas!" : "Hampir mencapai batas budget."}</span>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Hapus Budget"
        description={`Apakah Anda yakin ingin menghapus budget untuk kategori "${category}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Card>
  );
}
