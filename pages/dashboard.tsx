import DashboardSummary from "@/components/DashboardSummary";
import CategoryPieChart from "@/components/CategoryPieChart";
import BudgetComparisonChart from "@/components/BudgetComparisonChart";
import { Transaction } from "@/types";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  type Budget = { category: string; totalBudget: number };
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const router = useRouter();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const txRes = await fetch(`/api/transactions`);
        const txData = await txRes.json();
        setTransactions(txData);

        const budgetRes = await fetch(`/api/budgets?month=${selectedMonth}`);
        const budgetData = await budgetRes.json();
        setBudgets(budgetData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const categoryMap = useMemo(() => {
    const map: { [category: string]: number } = {};
    transactions
      .filter((tx) => tx.date.startsWith(selectedMonth))
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });
    return map;
  }, [transactions, selectedMonth]);

  const categoryData = useMemo(() =>
    Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    })),
    [categoryMap]
  );

  const categoryTotals = useMemo(() => {
    return budgets.map((b) => {
      const spent = categoryMap[b.category] || 0;
      const allocated = b.totalBudget || 0;
      const saved = allocated - spent;
      return { category: b.category, allocated, spent, saved };
    });
  }, [budgets, categoryMap]);

  const totalSavings = categoryTotals.reduce((sum, c) => sum + c.saved, 0);

  return (
    <div className="p-6 space-y-6 bg-[#fdfdfd] min-h-screen text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
        <div className="flex gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={() => router.push("/landingpage")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Transaction details
          </button>
        </div>
      </div>

      {/* Summary Panel */}
      <DashboardSummary
        transactions={transactions}
        selectedMonth={selectedMonth}
        totalSavings={totalSavings}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryPieChart categoryData={categoryData} />
        <BudgetComparisonChart
          selectedMonth={selectedMonth}
          transactions={transactions}
        />
      </div>

      {/* Category Table + Manager */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Category-wise Budget Summary</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th>Category</th>
              <th>Allocated</th>
              <th>Spent</th>
              <th>Savings</th>
            </tr>
          </thead>
          <tbody>
            {categoryTotals.map(({ category, allocated, spent, saved }) => (
              <tr key={category}>
                <td>{category}</td>
                <td>₹{allocated}</td>
                <td>₹{spent}</td>
                <td className={saved >= 0 ? "text-green-600" : "text-red-600"}>
                  ₹{saved}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
