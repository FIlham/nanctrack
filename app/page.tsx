"use client";

import * as React from "react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Navbar } from "@/src/components/layout/Navbar";
import { MobileNav } from "@/src/components/layout/MobileNav";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { Plus, PieChart, Utensils, Car, Music, User, Bell as BellIcon, Shield, CreditCard, Moon, Globe } from "lucide-react";

import { format, startOfWeek, addDays } from "date-fns";
import { SummaryCards } from "@/src/components/modules/dashboard/SummaryCards";
import { SpendingOverview } from "@/src/components/modules/dashboard/SpendingOverview";
import { RecentActivity } from "@/src/components/modules/dashboard/RecentActivity";
import { UpcomingBills } from "@/src/components/modules/dashboard/UpcomingBills";
import { GoalProgress } from "@/src/components/modules/dashboard/GoalProgress";
import { SmartAIInsight } from "@/src/components/modules/ai/SmartAIInsight";
import { AIInsightCard } from "@/src/components/modules/ai/AIInsightCard";

import { TransactionList } from "@/src/components/modules/transactions/TransactionList";
import { GoalCard } from "@/src/components/modules/goals/GoalCard";
import { BillCard } from "@/src/components/modules/bills/BillCard";
import { BudgetCard } from "@/src/components/modules/budget/BudgetCard";
import { RecapSummary } from "@/src/components/modules/recap/RecapSummary";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";
import { BarChart as ReBarChart, Bar, XAxis as ReXAxis, YAxis as ReYAxis, CartesianGrid as ReCartesianGrid, ResponsiveContainer as ReResponsiveContainer, Legend as ReLegend } from "recharts";

import { useFinanceStore } from "@/src/lib/store";

// --- Page Components ---

function Dashboard({ onAddTransaction, user }: { onAddTransaction: () => void; user: any }) {
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const currentMonth = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl capitalize">
            Hei, {displayName}! 👋
          </h1>
          <p className="text-sm text-text-muted">{currentMonth} • Overview keuanganmu hari ini.</p>
        </div>
        <Button onClick={onAddTransaction} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendingOverview />
        </div>
        <div className="flex flex-col gap-6">
          <GoalProgress />
          <UpcomingBills />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="flex flex-col gap-6">
          <SmartAIInsight category="recap" />
        </div>
      </div>
    </div>
  );
}

function Transactions({ onAddTransaction }: { onAddTransaction: () => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Transactions</h1>
          <p className="text-sm text-text-muted">Kelola semua pemasukan dan pengeluaranmu.</p>
        </div>
        <Button onClick={onAddTransaction} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransactionList />
        </div>
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4 bg-primary/10 border-primary/20">
            <div className="flex items-center gap-2 text-primary">
              <PieChart className="h-5 w-5" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider">Spending Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Food & Drinks</span>
                <span className="font-medium">42%</span>
              </div>
              <ProgressBar value={42} color="bg-primary" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Transport</span>
                <span className="font-medium">15%</span>
              </div>
              <ProgressBar value={15} color="bg-secondary" />
            </div>
          </Card>
          <SmartAIInsight category="transactions" />
        </div>
      </div>
    </div>
  );
}

function Goals({ onAddGoal }: { onAddGoal: () => void }) {
  const { goals } = useFinanceStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Financial Goals</h1>
          <p className="text-sm text-text-muted">Simpan uang untuk impianmu di masa depan.</p>
        </div>
        <Button onClick={onAddGoal} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card 
          onClick={onAddGoal}
          className="flex flex-col items-center justify-center gap-4 border-dashed border-base-600 bg-transparent p-12 text-center transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-base-800 border border-base-600">
            <Plus className="h-8 w-8 text-text-muted" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Buat Goal Baru</h3>
            <p className="mt-1 text-sm text-text-muted">Mulai menabung untuk impianmu.</p>
          </div>
          <Button variant="outline" size="sm">Mulai Sekarang</Button>
        </Card>
        {goals.map((goal) => (
          <GoalCard 
            key={goal.id}
            id={goal.id}
            title={goal.title}
            description={goal.description}
            current={goal.current}
            target={goal.target}
            deadline={goal.deadline ? formatDate(goal.deadline) : "No deadline"}
            color={goal.color || "bg-primary"}
            status={goal.status as any}
          />
        ))}
      </div>

      <SmartAIInsight category="goals" />
    </div>
  );
}

function Bills({ onAddBill }: { onAddBill: () => void }) {
  const { bills } = useFinanceStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Bills & Subscriptions</h1>
          <p className="text-sm text-text-muted">Pantau semua tagihan rutinmu agar tidak terlewat.</p>
        </div>
        <Button onClick={onAddBill} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Tagihan
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {bills.length === 0 ? (
          <Card className="lg:col-span-2 flex flex-col items-center justify-center py-12 text-center border-dashed">
            <p className="text-text-muted">Belum ada tagihan yang terdaftar.</p>
            <Button variant="ghost" className="mt-2" onClick={onAddBill}>Tambah Sekarang</Button>
          </Card>
        ) : (
          bills.map((bill) => (
            <BillCard 
              key={bill.id}
              id={bill.id}
              name={bill.name}
              amount={bill.amount}
              dueDate={formatDate(bill.dueDate)}
              category={bill.category}
              isPaid={bill.isPaid}
              status={bill.status as any}
            />
          ))
        )}
      </div>

      <SmartAIInsight category="bills" />
    </div>
  );
}

function Budget({ onAddBudget }: { onAddBudget: () => void }) {
  const { budgets } = useFinanceStore();

  const chartData = budgets.map(b => ({
    name: b.category,
    value: b.limit,
    color: b.spent > b.limit ? "#FF6B6B" : "#6C63FF"
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Budgeting</h1>
          <p className="text-sm text-text-muted">Atur batas pengeluaranmu per kategori.</p>
        </div>
        <Button onClick={onAddBudget} className="gap-2">
          <Plus className="h-4 w-4" />
          Buat Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col gap-6 lg:col-span-1">
          <h3 className="font-display text-lg font-bold">Total Budget</h3>
          {budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <p className="text-sm text-text-muted">Belum ada budget.</p>
            </div>
          ) : (
            <>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip 
                      contentStyle={{ backgroundColor: "#161920", border: "1px solid #282C36", borderRadius: "8px" }}
                      itemStyle={{ fontSize: "12px" }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {budgets.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span className="text-text-secondary">{item.category}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.limit)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:col-span-2 sm:grid-cols-2">
          {budgets.map((budget) => (
            <BudgetCard 
              key={budget.id}
              id={budget.id}
              category={budget.category}
              spent={budget.spent}
              limit={budget.limit}
              period={budget.period}
            />
          ))}
          {budgets.length === 0 && (
            <Card className="sm:col-span-2 flex flex-col items-center justify-center py-12 text-center border-dashed">
              <p className="text-text-muted">Mulai atur budget pengeluaranmu.</p>
              <Button variant="ghost" className="mt-2" onClick={onAddBudget}>Buat Budget</Button>
            </Card>
          )}
        </div>
      </div>

      <SmartAIInsight category="budgets" />
    </div>
  );
}

function Recap() {
  const { transactions } = useFinanceStore();

  const topCategories = React.useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === "EXPENSE")
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [transactions]);

  const compareData = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const getStats = (month: number) => {
      const filtered = transactions.filter(t => new Date(t.date).getMonth() === month);
      const income = filtered.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
      const expense = filtered.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
      return { income, expense };
    };

    const currentStats = getStats(currentMonth);
    const lastStats = getStats(lastMonth);

    return [
      { name: format(addDays(startOfWeek(now), -30), "MMM"), ...lastStats },
      { name: format(now, "MMM"), ...currentStats },
    ];
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Monthly Recap</h1>
        <p className="text-sm text-text-muted">Lihat performa keuanganmu bulan demi bulan.</p>
      </div>

      <RecapSummary />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-6">
          <h3 className="font-display text-lg font-bold">Comparison</h3>
          <div className="h-[300px] w-full">
            <ReResponsiveContainer width="100%" height="100%">
              <ReBarChart data={compareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <ReCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#282C36" />
                <ReXAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                <ReYAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                <ReTooltip 
                  contentStyle={{ backgroundColor: "#161920", border: "1px solid #282C36", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <ReLegend verticalAlign="top" height={36}/>
                <Bar dataKey="income" fill="#00C9A7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ReResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col gap-6">
          <h3 className="font-display text-lg font-bold">Top Spending Categories</h3>
          <div className="space-y-4">
            {topCategories.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">Belum ada data pengeluaran.</p>
            ) : (
              topCategories.map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <PieChart className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(amount)}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <SmartAIInsight category="recap" />
    </div>
  );
}

function Settings({ user }: { user: any }) {
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const [showManageMsg, setShowManageMsg] = React.useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Settings</h1>
        <p className="text-sm text-text-muted">Kelola akun dan preferensi aplikasimu.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-base-700 border border-base-600 uppercase">
                {displayName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold capitalize">{displayName}</h3>
                <p className="text-sm text-text-muted">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">Edit Profile</Button>
            </div>

            <div className="space-y-4 pt-4 border-t border-base-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm font-medium">Currency</p>
                    <p className="text-xs text-text-muted">IDR (Indonesian Rupiah)</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Change</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-text-muted">Gunakan tema gelap secara default</p>
                  </div>
                </div>
                <div className="h-6 w-11 rounded-full bg-primary p-1">
                  <div className="h-4 w-4 translate-x-5 rounded-full bg-white transition-all" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="font-display font-bold">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellIcon className="h-5 w-5 text-text-muted" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <div className="h-6 w-11 rounded-full bg-base-600 p-1">
                  <div className="h-4 w-4 rounded-full bg-white transition-all" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-text-muted" />
                  <span className="text-sm">Two-Factor Authentication</span>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/10 border-primary/20">
            <div className="flex items-center gap-3 text-primary">
              <CreditCard className="h-5 w-5" />
              <h3 className="font-display font-bold">Subscription</h3>
            </div>
            <p className="mt-2 text-sm text-text-secondary">Kamu sedang menggunakan paket <strong>Premium</strong>.</p>
            <ul className="mt-4 space-y-2 text-xs text-text-muted">
              <li className="flex items-center gap-2">✓ Unlimited Transactions</li>
              <li className="flex items-center gap-2">✓ AI Financial Insights</li>
              <li className="flex items-center gap-2">✓ Export to CSV/PDF</li>
            </ul>
            <Button 
              className="mt-6 w-full" 
              variant="outline"
              onClick={() => setShowManageMsg(true)}
            >
              Manage Plan
            </Button>
            {showManageMsg && (
              <p className="mt-2 text-[10px] text-center text-primary animate-pulse">
                Subscription management coming soon!
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

import dynamic from "next/dynamic";

const AppRouter = dynamic(() => import("@/src/components/AppRouter"), { ssr: false });

// --- Page Components ---
// (Dashboard, Transactions, Goals, Bills, Budget, Recap, Settings remain here)

export default function App() {
  return (
    <AppRouter 
      Dashboard={Dashboard}
      Transactions={Transactions}
      Goals={Goals}
      Bills={Bills}
      Budget={Budget}
      Recap={Recap}
      Settings={Settings}
    />
  );
}
