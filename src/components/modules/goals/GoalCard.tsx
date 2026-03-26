/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Target, Calendar, MoreVertical, Plus, Trash2 } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { InputModal } from "@/src/components/ui/InputModal";
import { formatCurrency, cn } from "@/src/lib/utils";

import { useFinanceStore } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";

interface GoalCardProps {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  deadline: string;
  color: string;
  status: "ACTIVE" | "ACHIEVED" | "PAUSED";
}

export function GoalCard({ id, title, description, current, target, deadline, color, status }: GoalCardProps) {
  const { updateGoal, deleteGoal } = useFinanceStore();
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = React.useState(false);
  const percentage = Math.round((current / target) * 100);

  const handleAddFunds = async (amount: string) => {
    if (amount && !isNaN(Number(amount))) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await updateGoal(user.id, id, current + Number(amount));
      }
      setIsAddFundsOpen(false);
    }
  };

  const handleDelete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await deleteGoal(user.id, id);
    }
    setIsDeleteOpen(false);
  };

  return (
    <Card className="group relative flex flex-col gap-6 transition-all hover:border-primary/50">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", color.replace("bg-", "bg-opacity-10 text-").replace("text-", "text-"))}>
          <Target className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status === "ACTIVE" ? "info" : status === "ACHIEVED" ? "success" : "outline"}>
            {status}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-tertiary hover:bg-tertiary/10" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm text-text-muted line-clamp-2">{description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{percentage}% Saved</span>
          <span className="text-text-muted">{formatCurrency(current)} / {formatCurrency(target)}</span>
        </div>
        <ProgressBar value={current} max={target} color={color} />
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Calendar className="h-3 w-3" />
          <span>Deadline: {deadline}</span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button className="w-full gap-2" variant="outline" onClick={() => setIsAddFundsOpen(true)}>
          <Plus className="h-4 w-4" />
          Tambah Dana
        </Button>
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Hapus Goal"
        description={`Apakah Anda yakin ingin menghapus goal "${title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <InputModal
        isOpen={isAddFundsOpen}
        title="Tambah Dana"
        description={`Masukkan jumlah dana yang ingin ditambahkan ke goal "${title}".`}
        placeholder="0"
        type="number"
        onConfirm={handleAddFunds}
        onCancel={() => setIsAddFundsOpen(false)}
      />
    </Card>
  );
}
