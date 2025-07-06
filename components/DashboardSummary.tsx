import { useState } from "react";
import { FaRupeeSign, FaCalendarAlt } from "react-icons/fa";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

interface Props {
  transactions: Transaction[];
  selectedMonth: string;
}

export default function DashboardSummary({ transactions }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyTotal = transactions
    .filter((tx) =>
      selectedMonth
        ? new Date(tx.date).toLocaleString("default", { month: "long", year: "numeric" }) === selectedMonth
        : true
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const months = Array.from(
    new Set(
      transactions.map((tx) =>
        new Date(tx.date).toLocaleString("default", { month: "long", year: "numeric" })
      )
    )
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 animate-fade-in">
      {/* Total Expenses */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 transition-all">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center gap-2">
          <FaRupeeSign /> Total Expenses
        </h3>
        <p className="text-xl font-semibold text-red-600 dark:text-red-400">
          ₹{total.toFixed(2)}
        </p>
      </div>

      {/* Monthly Expenses with dropdown */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 transition-all space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center gap-2">
            <FaCalendarAlt /> Monthly Expenses
          </h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-2 py-1 rounded dark:bg-zinc-800 dark:text-white text-sm"
          >
            <option value="">All</option>
            {months.map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>
        </div>
        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          ₹{monthlyTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
