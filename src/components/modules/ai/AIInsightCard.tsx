/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";

interface AIInsightCardProps {
  insight?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function AIInsightCard({ insight, isLoading, onRefresh, className }: AIInsightCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-primary/20 bg-primary/5", className)}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">AI Insight</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-primary hover:bg-primary/10"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-primary/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-primary/10" />
          </div>
        ) : (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm leading-relaxed text-text-secondary"
          >
            {insight || "No insights available yet. Click refresh to generate one based on your current data."}
          </motion.p>
        )}
      </div>
    </Card>
  );
}
