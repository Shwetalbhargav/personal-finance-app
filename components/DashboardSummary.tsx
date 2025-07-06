import { FaRupeeSign, FaCalendarAlt } from "react-icons/fa";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

type Budget = {
  category: string;
  amount: number;
};

interface Props {
  transactions: Transaction[];
  selectedMonth: string;
  budgets: Budget[];
}

export default function DashboardSummary({ transactions, selectedMonth, budgets }: Props) {
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const filtered = selectedMonth
    ? transactions.filter(
        (tx) =>
          new Date(tx.date).toLocaleString("default", { month: "long", year: "numeric" }) === selectedMonth
      )
    : transactions;

  const monthlyTotal = filtered.reduce((sum, tx) => sum + tx.amount, 0);

  const totalsByCategory = filtered.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 transition-all">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center gap-2">
          <FaRupeeSign /> Total Expenses
        </h3>
        <p className="text-xl font-semibold text-red-600 dark:text-red-400">₹{total.toFixed(2)}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 transition-all space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center gap-2">
            <FaCalendarAlt /> Monthly Expenses
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
            ₹{monthlyTotal.toFixed(2)}
          </p>
        </div>

        {selectedMonth && (
          <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded mt-2">
            <h4 className="font-semibold text-sm mb-2">Spending Insights ({selectedMonth})</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {budgets.map((b) => {
                const actual = totalsByCategory[b.category] || 0;
                const diff = actual - b.amount;
                return (
                  <li
                    key={b.category}
                    className={diff > 0 ? "text-red-500" : "text-green-600"}
                  >
                    {diff > 0
                      ? `Over budget by ₹${diff.toFixed(2)} in ${b.category}`
                      : `Under budget by ₹${Math.abs(diff).toFixed(2)} in ${b.category}`}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
