import { useEffect, useState } from "react";
import DashboardSummary from "@/components/DashboardSummary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";
import { categories } from "@/constants/categories";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#0088FE"];

const predefinedBudgets = [
  { category: "Shopping", amount: 5000 },
  { category: "Travel", amount: 3000 },
  { category: "Dining Out (+Take Out)", amount: 2000 },
  { category: "Movies", amount: 1000 },
  { category: "Internet and Mobile", amount: 1200 },
  { category: "Provisions", amount: 4000 },
  { category: "Insurance", amount: 2500 },
  { category: "SIP (Investments)", amount: 5000 },
  { category: "EMI (House)", amount: 15000 },
  { category: "EMI (Car)", amount: 7000 }
];

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<{ category: string; amount: number }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/transactions");
      const data: Transaction[] = await res.json();
      setTransactions(data);

      const filtered = selectedMonth
        ? data.filter(
            (tx) =>
              new Date(tx.date).toLocaleString("default", { month: "long", year: "numeric" }) === selectedMonth
          )
        : data;

      const grouped: Record<string, number> = {};
      filtered.forEach((tx) => {
        grouped[tx.category] = (grouped[tx.category] || 0) + tx.amount;
      });

      const chartData = Object.entries(grouped).map(([category, amount]) => ({ category, amount }));
      setCategoryData(chartData);
    };

    fetchData();
  }, [selectedMonth]);

  const months = Array.from(
    new Set(
      transactions.map((tx) =>
        new Date(tx.date).toLocaleString("default", { month: "long", year: "numeric" })
      )
    )
  );

  const filteredTx = selectedMonth
    ? transactions.filter(
        (tx) =>
          new Date(tx.date).toLocaleString("default", { month: "long", year: "numeric" }) === selectedMonth
      )
    : transactions;

  const renderLegend = (value: string) => {
    const item = categories.find((c) => c.label === value);
    return (
      <span className="flex items-center gap-2">
        {item?.icon && <item.icon />}
        {value}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-black dark:text-white p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/">
          <Button className="bg-gray-300 text-black dark:bg-gray-600 dark:text-white hover:opacity-90">
            ← Back to Tracker
          </Button>
        </Link>
      </div>

      <div className="flex justify-end">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-2 py-1 rounded dark:bg-zinc-900 dark:text-white"
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month}>{month}</option>
          ))}
        </select>
      </div>

      <DashboardSummary
        transactions={transactions}
        selectedMonth={selectedMonth}
        budgets={predefinedBudgets}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend formatter={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-300 border-b">
                <th className="py-1">Category</th>
                <th className="py-1">Description</th>
                <th className="py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.slice(0, 5).map((tx) => (
                <tr key={tx._id} className="border-t dark:border-zinc-600">
                  <td className="py-1 flex items-center gap-2">
                    {categories.find((c) => c.label === tx.category)?.icon()}
                    {tx.category}
                  </td>
                  <td className="py-1">{tx.description}</td>
                  <td className="py-1">₹{tx.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
