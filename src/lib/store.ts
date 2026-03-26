import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  description: string;
  type: "INCOME" | "EXPENSE";
  date: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  status: string;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
  status: string;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: string;
}

interface InsightData {
  content: string | null;
  isStale: boolean;
}

interface FinanceState {
  transactions: Transaction[];
  goals: Goal[];
  bills: Bill[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  insights: {
    recap: InsightData;
    transactions: InsightData;
    goals: InsightData;
    bills: InsightData;
    budgets: InsightData;
  };
  
  fetchData: (userId: string) => Promise<void>;
  addTransaction: (userId: string, data: any) => Promise<void>;
  addGoal: (userId: string, data: any) => Promise<void>;
  addBill: (userId: string, data: any) => Promise<void>;
  addBudget: (userId: string, data: any) => Promise<void>;
  payBill: (userId: string, billId: string) => Promise<void>;
  updateGoal: (userId: string, goalId: string, current: number) => Promise<void>;
  deleteTransaction: (userId: string, id: string) => Promise<void>;
  deleteGoal: (userId: string, id: string) => Promise<void>;
  deleteBill: (userId: string, id: string) => Promise<void>;
  deleteBudget: (userId: string, id: string) => Promise<void>;
  setInsight: (category: keyof FinanceState["insights"], content: string) => void;
  invalidateInsights: (categories?: (keyof FinanceState["insights"])[]) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      goals: [],
      bills: [],
      budgets: [],
      loading: false,
      error: null,
      insights: {
        recap: { content: null, isStale: true },
        transactions: { content: null, isStale: true },
        goals: { content: null, isStale: true },
        bills: { content: null, isStale: true },
        budgets: { content: null, isStale: true },
      },

      fetchData: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const [tRes, gRes, bRes, buRes] = await Promise.all([
            fetch(`/api/transactions?userId=${userId}`),
            fetch(`/api/goals?userId=${userId}`),
            fetch(`/api/bills?userId=${userId}`),
            fetch(`/api/budgets?userId=${userId}`),
          ]);

          const [transactions, goals, bills, budgets] = await Promise.all([
            tRes.json(),
            gRes.json(),
            bRes.json(),
            buRes.json(),
          ]);

          set({ 
            transactions, 
            goals, 
            bills, 
            budgets, 
            loading: false, 
            insights: {
              recap: { content: null, isStale: true },
              transactions: { content: null, isStale: true },
              goals: { content: null, isStale: true },
              bills: { content: null, isStale: true },
              budgets: { content: null, isStale: true },
            }
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      addTransaction: async (userId: string, data: any) => {
        try {
          const res = await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, userId }),
          });
          const newTransaction = await res.json();
          set((state) => ({ 
            transactions: [newTransaction, ...state.transactions],
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              transactions: { ...state.insights.transactions, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      addGoal: async (userId: string, data: any) => {
        try {
          const res = await fetch("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, userId }),
          });
          const newGoal = await res.json();
          set((state) => ({ 
            goals: [newGoal, ...state.goals],
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              goals: { ...state.insights.goals, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      addBill: async (userId: string, data: any) => {
        try {
          const res = await fetch("/api/bills", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, userId }),
          });
          const newBill = await res.json();
          set((state) => ({ 
            bills: [newBill, ...state.bills],
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              bills: { ...state.insights.bills, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      addBudget: async (userId: string, data: any) => {
        try {
          const res = await fetch("/api/budgets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, userId }),
          });
          const newBudget = await res.json();
          set((state) => ({ 
            budgets: [newBudget, ...state.budgets],
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              budgets: { ...state.insights.budgets, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      payBill: async (userId: string, billId: string) => {
        try {
          const res = await fetch(`/api/bills/${billId}/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
          const updatedBill = await res.json();
          set((state) => ({
            bills: state.bills.map(b => b.id === billId ? updatedBill : b),
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              bills: { ...state.insights.bills, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      updateGoal: async (userId: string, goalId: string, current: number) => {
        try {
          const res = await fetch(`/api/goals/${goalId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, current }),
          });
          const updatedGoal = await res.json();
          set((state) => ({
            goals: state.goals.map(g => g.id === goalId ? updatedGoal : g),
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              goals: { ...state.insights.goals, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      deleteTransaction: async (userId: string, id: string) => {
        try {
          await fetch(`/api/transactions/${id}?userId=${userId}`, { method: "DELETE" });
          set((state) => ({
            transactions: state.transactions.filter(t => t.id !== id),
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              transactions: { ...state.insights.transactions, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      deleteGoal: async (userId: string, id: string) => {
        try {
          await fetch(`/api/goals/${id}?userId=${userId}`, { method: "DELETE" });
          set((state) => ({
            goals: state.goals.filter(g => g.id !== id),
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              goals: { ...state.insights.goals, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      deleteBill: async (userId: string, id: string) => {
        try {
          await fetch(`/api/bills/${id}?userId=${userId}`, { method: "DELETE" });
          set((state) => ({
            bills: state.bills.filter(b => b.id !== id),
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              bills: { ...state.insights.bills, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      deleteBudget: async (userId: string, id: string) => {
        try {
          await fetch(`/api/budgets/${id}?userId=${userId}`, { method: "DELETE" });
          set((state) => ({
            budgets: state.budgets.filter(b => b.id !== id),
            insights: {
              ...state.insights,
              recap: { ...state.insights.recap, isStale: true },
              budgets: { ...state.insights.budgets, isStale: true },
            }
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      setInsight: (category, content) => set((state) => ({
        insights: {
          ...state.insights,
          [category]: { content, isStale: false }
        }
      })),
      
      invalidateInsights: (categories) => set((state) => {
        const newInsights = { ...state.insights };
        if (categories) {
          categories.forEach(cat => {
            newInsights[cat] = { ...newInsights[cat], isStale: true };
          });
        } else {
          Object.keys(newInsights).forEach(key => {
            newInsights[key as keyof typeof newInsights] = { 
              ...newInsights[key as keyof typeof newInsights], 
              isStale: true 
            };
          });
        }
        return { insights: newInsights };
      }),
    }),
    {
      name: "finance-storage",
    }
  )
);
