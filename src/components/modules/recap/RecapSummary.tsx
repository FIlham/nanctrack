/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { TrendingUp, TrendingDown, PiggyBank, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { formatCurrency, cn } from "@/src/lib/utils";
import { useFinanceStore } from "@/src/lib/store";
import { format, startOfMonth, endOfMonth } from "date-fns";

export function RecapSummary() {
  const { transactions } = useFinanceStore();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const stats = React.useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });

    const income = filtered.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    const savings = income - expense;

    return { income, expense, savings };
  }, [transactions, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={handlePrevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center min-w-[150px]">
            <h2 className="font-display text-xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
            <p className="text-xs text-text-muted">Rekapitulasi Keuangan</p>
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={handleNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="hidden sm:flex" onClick={() => window.print()}>Download PDF</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-2 border-secondary/20 bg-secondary/5">
          <div className="flex items-center gap-2 text-secondary">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Income</span>
          </div>
          <h3 className="font-display text-xl font-bold">{formatCurrency(stats.income)}</h3>
          <p className="text-[10px] text-secondary">Bulan ini</p>
        </Card>
        <Card className="flex flex-col gap-2 border-tertiary/20 bg-tertiary/5">
          <div className="flex items-center gap-2 text-tertiary">
            <TrendingDown className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Expense</span>
          </div>
          <h3 className="font-display text-xl font-bold">{formatCurrency(stats.expense)}</h3>
          <p className="text-[10px] text-tertiary">Bulan ini</p>
        </Card>
        <Card className="flex flex-col gap-2 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 text-primary">
            <PiggyBank className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Net Savings</span>
          </div>
          <h3 className="font-display text-xl font-bold">{formatCurrency(stats.savings)}</h3>
          <p className="text-[10px] text-primary">Tabungan bulan ini</p>
        </Card>
      </div>
    </div>
  );
}
