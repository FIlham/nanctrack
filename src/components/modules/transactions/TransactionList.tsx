/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Search, Coffee, Car, Utensils, Music, ShoppingBag, Wallet, CreditCard, Trash2 } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import { useFinanceStore } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";

const categories = ["All", "Food", "Transport", "Groceries", "Entertainment", "Income", "Utilities", "Shopping", "Health", "Other"];

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "food": return Utensils;
    case "transport": return Car;
    case "groceries": return ShoppingBag;
    case "entertainment": return Music;
    case "income": return Wallet;
    case "utilities": return Coffee;
    case "shopping": return ShoppingBag;
    case "health": return Coffee;
    default: return CreditCard;
  }
};

const getCategoryColor = (category: string, type: string) => {
  if (type === "INCOME") return "bg-primary/10 text-primary";
  switch (category.toLowerCase()) {
    case "food": return "bg-orange-500/10 text-orange-500";
    case "transport": return "bg-green-500/10 text-green-500";
    case "groceries": return "bg-blue-500/10 text-blue-500";
    case "entertainment": return "bg-purple-500/10 text-purple-500";
    case "utilities": return "bg-yellow-500/10 text-yellow-500";
    default: return "bg-base-600 text-text-muted";
  }
};

export function TransactionList() {
  const { transactions, deleteTransaction } = useFinanceStore();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await deleteTransaction(user.id, deleteId);
      }
      setDeleteId(null);
    }
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = (t.name || t.description || t.category).toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-base-600 bg-base-800 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                cat === selectedCategory ? "bg-primary text-white" : "bg-base-800 text-text-secondary hover:bg-base-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-base-600">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-text-muted">
              No transactions found.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const Icon = getCategoryIcon(tx.category);
              const color = getCategoryColor(tx.category, tx.type);
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 transition-colors hover:bg-base-700/50">
                  <div className="flex items-center gap-4">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{tx.name || tx.description || tx.category}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{formatDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={cn("font-bold", tx.type === "INCOME" ? "text-secondary" : "text-white")}>
                        {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </p>
                      <Badge variant="outline" className="mt-1 text-[10px]">Completed</Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-tertiary hover:bg-tertiary/10"
                      onClick={() => setDeleteId(tx.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Hapus Transaksi"
        description="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
