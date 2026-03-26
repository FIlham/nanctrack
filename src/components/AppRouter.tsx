"use client";

import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Navbar } from "@/src/components/layout/Navbar";
import { MobileNav } from "@/src/components/layout/MobileNav";
import { useFinanceStore } from "@/src/lib/store";
import { supabase, isSupabaseConfigured } from "@/src/lib/supabase";
import { Auth } from "@/src/components/modules/auth/Auth";

import { TransactionForm } from "@/src/components/modules/transactions/TransactionForm";
import { GoalForm } from "@/src/components/modules/goals/GoalForm";
import { BillForm } from "@/src/components/modules/bills/BillForm";
import { BudgetForm } from "@/src/components/modules/budget/BudgetForm";

// Import page components
// (Assuming they are defined in app/page.tsx for now, I'll move them to a separate file if needed)
// For now, I'll just pass them as props or define them here.

export default function AppRouter({ 
  Dashboard, 
  Transactions, 
  Goals, 
  Bills, 
  Budget, 
  Recap, 
  Settings 
}: any) {
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { fetchData } = useFinanceStore();

  const [isTransactionFormOpen, setIsTransactionFormOpen] = React.useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = React.useState(false);
  const [isBillFormOpen, setIsBillFormOpen] = React.useState(false);
  const [isBudgetFormOpen, setIsBudgetFormOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchData(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const handleAddTransaction = async (data: any) => {
    await useFinanceStore.getState().addTransaction(session.user.id, data);
    setIsTransactionFormOpen(false);
  };

  const handleAddGoal = async (data: any) => {
    await useFinanceStore.getState().addGoal(session.user.id, data);
    setIsGoalFormOpen(false);
  };

  const handleAddBill = async (data: any) => {
    await useFinanceStore.getState().addBill(session.user.id, data);
    setIsBillFormOpen(false);
  };

  const handleAddBudget = async (data: any) => {
    await useFinanceStore.getState().addBudget(session.user.id, data);
    setIsBudgetFormOpen(false);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-base-900 text-white">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Navbar user={session.user} />
          <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-8 lg:pb-8">
            <div className="mx-auto max-w-7xl">
              <Routes>
                <Route path="/" element={<Dashboard user={session.user} onAddTransaction={() => setIsTransactionFormOpen(true)} />} />
                <Route path="/transactions" element={<Transactions onAddTransaction={() => setIsTransactionFormOpen(true)} />} />
                <Route path="/goals" element={<Goals onAddGoal={() => setIsGoalFormOpen(true)} />} />
                <Route path="/bills" element={<Bills onAddBill={() => setIsBillFormOpen(true)} />} />
                <Route path="/budget" element={<Budget onAddBudget={() => setIsBudgetFormOpen(true)} />} />
                <Route path="/recap" element={<Recap />} />
                <Route path="/settings" element={<Settings user={session.user} />} />
              </Routes>
            </div>
          </main>
          <MobileNav />
        </div>
      </div>

      {isTransactionFormOpen && (
        <TransactionForm
          onClose={() => setIsTransactionFormOpen(false)}
          onSubmit={handleAddTransaction}
        />
      )}
      {isGoalFormOpen && (
        <GoalForm
          onClose={() => setIsGoalFormOpen(false)}
          onSubmit={handleAddGoal}
        />
      )}
      {isBillFormOpen && (
        <BillForm
          onClose={() => setIsBillFormOpen(false)}
          onSubmit={handleAddBill}
        />
      )}
      {isBudgetFormOpen && (
        <BudgetForm
          onClose={() => setIsBudgetFormOpen(false)}
          onSubmit={handleAddBudget}
        />
      )}
    </Router>
  );
}
