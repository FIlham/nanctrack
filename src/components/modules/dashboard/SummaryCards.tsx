/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { formatCurrency } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";

interface SummaryCardProps {
  label: string;
  amount: number;
  icon: React.ElementType;
  trend?: string;
  variant?: "primary" | "secondary" | "tertiary";
}

function SummaryCard({ label, amount, icon: Icon, trend, variant = "primary" }: SummaryCardProps) {
  const variants = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    tertiary: "text-tertiary bg-tertiary/10",
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", variants[variant])}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className={cn("text-xs font-medium", trend.startsWith("+") ? "text-secondary" : "text-tertiary")}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</p>
        <h3 className="font-display text-2xl font-bold tracking-tight mt-1">{formatCurrency(amount)}</h3>
      </div>
    </Card>
  );
}

import { useFinanceStore } from "@/src/lib/store";

export function SummaryCards() {
  const { transactions } = useFinanceStore();

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard 
        label="Total Balance" 
        amount={balance} 
        icon={Wallet} 
        variant="primary" 
      />
      <SummaryCard 
        label="Monthly Income" 
        amount={totalIncome} 
        icon={TrendingUp} 
        variant="secondary" 
      />
      <SummaryCard 
        label="Monthly Expense" 
        amount={totalExpense} 
        icon={TrendingDown} 
        variant="tertiary" 
      />
    </div>
  );
}
