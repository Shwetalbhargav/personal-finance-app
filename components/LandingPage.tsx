"use client";

import { useEffect,useState } from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import MonthlyChart from "@/components/MonthlyChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { BarChart3, PieChart, PlusCircle, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<"bar" | "pie">("bar");
  const [categoryData, setCategoryData] = useState<{ category: string; amount: number }[]>([]);


  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
  
      const grouped: Record<string, number> = {};
      data.forEach((tx: any) => {
        if (!grouped[tx.category]) grouped[tx.category] = 0;
        grouped[tx.category] += tx.amount;
      });
  
      const formatted = Object.entries(grouped).map(([category, amount]) => ({
        category,
        amount,
      }));
  
      setCategoryData(formatted);
    };
  
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
          <LayoutDashboard className="text-indigo-500" />
          Personal Finance Tracker
        </h1>

        <Link href="/dashboard">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex gap-2">
            <LayoutDashboard size={18} />
            View Full Dashboard
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Transactions Panel */}
        <div className="space-y-4 h-full w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              Transactions
            </h2>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2">
                  <PlusCircle size={18} />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <TransactionForm onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>

          <TransactionList refreshTrigger={refreshKey} />
        </div>

        {/* Charts Panel */}
        <div className="space-y-4 h-full w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              {selectedChart === "bar" ? <BarChart3 /> : <PieChart />}
              Expense Breakdown
            </h2>

            <select
              value={selectedChart}
              onChange={(e) =>
                setSelectedChart(e.target.value as "bar" | "pie")
              }
              className="border border-gray-300 px-3 py-1 rounded text-sm text-black"
            >
              <option value="bar">Monthly Bar Chart</option>
              <option value="pie">Category Pie Chart</option>
            </select>
          </div>

          {selectedChart === "bar" ? (
            <MonthlyChart refreshTrigger={refreshKey} />
          ) : (
            <CategoryPieChart data={categoryData} />

          )}
        </div>
      </div>
    </div>
  );
}
