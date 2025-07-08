// LandingPage.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import MonthlyChart from "./MonthlyChart";
import BudgetComparisonChart from "./BudgetComparisonChart";
import BudgetManager from "./BudgetManager";
import { Transaction } from "../types";
import Link from 'next/link';

const LandingPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("2025-07");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleTransactionSaved = () => {
    setShowForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    };
    fetchTransactions();
  }, [refreshTrigger]);

  const filteredTransactions = transactions.filter((t) => {
    const matchMonth = selectedMonth ? t.date.startsWith(selectedMonth) : true;
    const matchCategory = selectedCategory ? t.category === selectedCategory : true;
    return matchMonth && matchCategory;
  });

  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
        <Link href="/dashboard">
          <a className="your-class">Go to Dashboard</a>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded text-black"
        >
          <option value="">All Categories</option>
          <option value="Provisions">Provisions</option>
          <option value="EMI (House)">EMI (House)</option>
          <option value="Insurance">Insurance</option>
          <option value="Internet and Mobile">Internet and Mobile</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transactions */}
        <div className="bg-white p-4 rounded-2xl shadow h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Transactions</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-white bg-blue-600 hover:bg-blue-700">+ Add</Button>
              </DialogTrigger>
              <DialogContent>
                <TransactionForm onSuccess={handleTransactionSaved} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <TransactionList
              transactions={filteredTransactions}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bg-white p-4 rounded-2xl shadow h-[500px]">
          <h2 className="text-lg font-bold mb-4">Expense Breakdown</h2>
          <MonthlyChart refreshTrigger={refreshTrigger} />
        </div>

        {/* Budget Table with Set Button */}
        <div className="bg-white p-4 rounded-2xl shadow h-[500px] flex flex-col">
                  <h2 className="text-lg font-bold mb-2">Budgets</h2>

        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
             <BudgetManager />
                     </div>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <BudgetComparisonChart
            selectedMonth={selectedMonth}
            transactions={transactions}
            
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
