/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Calendar, MoreVertical, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { formatCurrency, cn } from "@/src/lib/utils";

import { useFinanceStore } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";

interface BillCardProps {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
  status: "Upcoming" | "Due Today" | "Overdue";
}

export function BillCard({ id, name, amount, dueDate, category, isPaid, status }: BillCardProps) {
  const { payBill, deleteBill } = useFinanceStore();
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const handlePay = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await payBill(user.id, id);
    }
  };

  const handleDelete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await deleteBill(user.id, id);
    }
    setIsDeleteOpen(false);
  };

  return (
    <Card className={cn("flex items-center justify-between transition-all hover:border-primary/50", isPaid && "opacity-60")}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          isPaid ? "bg-base-600 text-text-muted" : "bg-primary/10 text-primary"
        )}>
          {isPaid ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
        </div>
        <div>
          <h3 className="font-display font-bold">{name}</h3>
          <p className="text-xs text-text-muted">{category} • {dueDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-bold">{formatCurrency(amount)}</p>
          {!isPaid && (
            <Badge variant={status === "Overdue" ? "danger" : status === "Due Today" ? "warning" : "info"} className="mt-1">
              {status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isPaid && (
            <Button variant="secondary" size="sm" onClick={handlePay}>Bayar</Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-tertiary hover:bg-tertiary/10" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Hapus Tagihan"
        description={`Apakah Anda yakin ingin menghapus tagihan "${name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Card>
  );
}
