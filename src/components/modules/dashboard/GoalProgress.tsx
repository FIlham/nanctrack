/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Target, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/src/components/ui/Card";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { Button } from "@/src/components/ui/Button";
import { formatCurrency } from "@/src/lib/utils";

import { useFinanceStore } from "@/src/lib/store";

export function GoalProgress() {
  const { goals } = useFinanceStore();
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Financial Goals</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => navigate("/goals")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-6">
        {goals.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">Belum ada goal.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-text-muted" />
                  <p className="text-sm font-medium">{goal.title}</p>
                </div>
                <p className="text-xs font-bold text-text-secondary">
                  {Math.round((goal.current / goal.target) * 100)}%
                </p>
              </div>
              <ProgressBar value={goal.current} max={goal.target} color={goal.color || "bg-primary"} />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>{formatCurrency(goal.current)}</span>
                <span>{formatCurrency(goal.target)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
