/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card } from "@/src/components/ui/Card";

import { useFinanceStore } from "@/src/lib/store";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

export function SpendingOverview() {
  const { transactions } = useFinanceStore();

  const chartData = React.useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => {
      const day = addDays(start, i);
      const dayName = format(day, "EEE");
      const dayTransactions = transactions.filter((t) => isSameDay(new Date(t.date), day));
      
      const income = dayTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expense = dayTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      return { name: dayName, income, expense };
    });
  }, [transactions]);

  return (
    <Card className="h-[400px] w-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Spending Overview</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-secondary" />
            <span className="text-xs text-text-muted">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-tertiary" />
            <span className="text-xs text-text-muted">Expense</span>
          </div>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#282C36" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B7280", fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B7280", fontSize: 12 }} 
              tickFormatter={(value) => `Rp${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#161920", border: "1px solid #282C36", borderRadius: "8px" }}
              itemStyle={{ fontSize: "12px" }}
              formatter={(value: number) => `Rp${value.toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#00C9A7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#FF6B6B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
