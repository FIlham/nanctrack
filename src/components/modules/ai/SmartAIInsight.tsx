import * as React from "react";
import { AIInsightCard } from "./AIInsightCard";
import { useFinanceStore } from "@/src/lib/store";
import { generateInsight } from "@/src/lib/gemini";

interface SmartAIInsightProps {
  category: "transactions" | "bills" | "goals" | "budgets" | "recap";
}

export function SmartAIInsight({ category }: SmartAIInsightProps) {
  const { transactions, goals, budgets, bills, insights, setInsight } = useFinanceStore();
  const [loading, setLoading] = React.useState(false);

  const currentInsight = insights[category];

  const handleRefresh = async () => {
    setLoading(true);
    try {
      let prompt = "";
      const dataSummary: any = {};

      switch (category) {
        case "transactions":
          dataSummary.transactions = transactions.slice(0, 15).map(t => ({ name: t.name, amount: t.amount, category: t.category, type: t.type }));
          prompt = `Berikan insight singkat (1-2 kalimat) tentang pola transaksi terbaru pengguna: ${JSON.stringify(dataSummary.transactions)}. Fokus pada pengeluaran terbesar atau anomali.`;
          break;
        case "bills":
          dataSummary.bills = bills.map(b => ({ name: b.name, amount: b.amount, dueDate: b.dueDate, isPaid: b.isPaid }));
          prompt = `Berikan pengingat atau saran singkat (1-2 kalimat) tentang tagihan mendatang: ${JSON.stringify(dataSummary.bills)}. Fokus pada tagihan yang belum dibayar atau jatuh tempo dekat.`;
          break;
        case "goals":
          dataSummary.goals = goals.map(g => ({ title: g.title, target: g.target, current: g.current, deadline: g.deadline }));
          prompt = `Berikan motivasi atau saran strategis singkat (1-2 kalimat) untuk mencapai goal tabungan: ${JSON.stringify(dataSummary.goals)}.`;
          break;
        case "budgets":
          dataSummary.budgets = budgets.map(b => ({ category: b.category, limit: b.limit, spent: b.spent }));
          prompt = `Berikan peringatan atau saran efisiensi singkat (1-2 kalimat) berdasarkan budget bulanan: ${JSON.stringify(dataSummary.budgets)}. Fokus pada kategori yang hampir melebihi limit.`;
          break;
        case "recap":
          dataSummary.all = {
            transactions: transactions.slice(0, 5).map(t => ({ amount: t.amount, category: t.category, type: t.type })),
            goals: goals.map(g => ({ title: g.title, target: g.target, current: g.current })),
            budgets: budgets.map(b => ({ category: b.category, limit: b.limit, spent: b.spent })),
            bills: bills.filter(b => !b.isPaid).length
          };
          prompt = `Berikan ringkasan eksekutif singkat (2-3 kalimat) tentang kondisi keuangan pengguna secara keseluruhan: ${JSON.stringify(dataSummary.all)}. Berikan satu langkah konkret yang paling penting dilakukan sekarang.`;
          break;
      }

      const systemInstruction = "Anda adalah asisten keuangan pribadi AI yang cerdas, praktis, dan memotivasi. Gunakan bahasa Indonesia yang santai tapi profesional. Berikan insight yang sangat spesifik berdasarkan data yang diberikan.";
      
      const result = await generateInsight(`${systemInstruction}\n\n${prompt}`);
      setInsight(category, result);
    } catch (error: any) {
      console.error("AI Insight Error:", error);
      const errorMessage = error.message.includes("API key") 
        ? "Gemini API key belum diatur di Settings AI Studio."
        : "Gagal menghasilkan insight. Coba lagi nanti.";
      setInsight(category, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const shouldFetch = currentInsight.isStale && !loading && (
      (category === "transactions" && transactions.length > 0) ||
      (category === "bills" && bills.length > 0) ||
      (category === "goals" && goals.length > 0) ||
      (category === "budgets" && budgets.length > 0) ||
      (category === "recap" && (transactions.length > 0 || goals.length > 0 || bills.length > 0))
    );

    if (shouldFetch) {
      handleRefresh();
    }
  }, [category, currentInsight.isStale, transactions.length, goals.length, bills.length, budgets.length]);

  return (
    <AIInsightCard 
      insight={currentInsight.content || undefined} 
      isLoading={loading} 
      onRefresh={handleRefresh} 
    />
  );
}
