/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Calendar, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { formatCurrency, formatDate } from "@/src/lib/utils";

import { useFinanceStore } from "@/src/lib/store";

export function UpcomingBills() {
  const { bills } = useFinanceStore();
  const navigate = useNavigate();
  const upcomingBills = bills.filter((b) => !b.isPaid).slice(0, 3);

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Upcoming Bills</h3>
        <button 
          onClick={() => navigate("/bills")}
          className="text-xs font-medium text-primary hover:underline"
        >
          Manage
        </button>
      </div>
      <div className="space-y-4">
        {upcomingBills.length > 0 ? (
          upcomingBills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between rounded-lg border border-base-600 bg-base-700/50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-600">
                  <Calendar className="h-5 w-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{bill.name}</p>
                  <p className="text-xs text-text-muted">{formatCurrency(bill.amount)} • {formatDate(bill.dueDate)}</p>
                </div>
              </div>
              <Badge variant={bill.status === "Due Today" ? "danger" : "warning"}>
                {bill.status}
              </Badge>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="mb-2 h-8 w-8 text-text-muted opacity-20" />
            <p className="text-sm text-text-muted">No upcoming bills</p>
          </div>
        )}
      </div>
    </Card>
  );
}
