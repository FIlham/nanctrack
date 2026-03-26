/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/src/components/ui/Card";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";

import { useFinanceStore } from "@/src/lib/store";
import { Wallet, ShoppingBag, Coffee, Car, Utensils, Music } from "lucide-react";

const getIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "food":
    case "makanan":
      return Utensils;
    case "transport":
    case "transportasi":
      return Car;
    case "entertainment":
    case "hiburan":
      return Music;
    case "groceries":
    case "belanja":
      return ShoppingBag;
    case "income":
    case "pemasukan":
      return Wallet;
    default:
      return Wallet;
  }
};

export function RecentActivity() {
  const { transactions } = useFinanceStore();
  const navigate = useNavigate();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Recent Activity</h3>
        <button 
          onClick={() => navigate("/transactions")}
          className="text-xs font-medium text-primary hover:underline"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {recentTransactions.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">Belum ada transaksi.</p>
        ) : (
          recentTransactions.map((tx) => {
            const Icon = getIcon(tx.category);
            const isIncome = tx.type === "INCOME";
            return (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isIncome ? "bg-primary/10 text-primary" : "bg-base-700 text-text-muted"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.description || tx.category}</p>
                    <p className="text-xs text-text-muted">{tx.category} • {formatDate(tx.date)}</p>
                  </div>
                </div>
                <p className={cn("text-sm font-bold", isIncome ? "text-secondary" : "text-white")}>
                  {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
