import { FaRupeeSign, FaCalendarAlt } from "react-icons/fa";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

type DashboardSummaryProps = {
  transactions: Transaction[];
  selectedMonth: string;
  totalSavings: number;
};

export default function DashboardSummary({
  transactions,
  selectedMonth,
  totalSavings,
}: DashboardSummaryProps) {
  const filteredTx = transactions.filter((tx) =>
    tx.date.startsWith(selectedMonth)
  );

  const totalSpent = filteredTx.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 📅 Selected Month */}
      <div className="bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg shadow p-4 flex items-center gap-4">
        <FaCalendarAlt className="text-blue-500 text-xl" />
        <div>
          <div className="text-sm text-gray-500">Selected Month</div>
          <div className="font-bold">{selectedMonth}</div>
        </div>
      </div>

      {/* 💸 Total Spent */}
      <div className="bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg shadow p-4 flex items-center gap-4">
        <FaRupeeSign className="text-red-500 text-xl" />
        <div>
          <div className="text-sm text-gray-500">Total Spent</div>
          <div className="font-bold">₹{totalSpent.toLocaleString()}</div>
        </div>
      </div>

      {/* 💰 Total Savings */}
      <div className="bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg shadow p-4 flex items-center gap-4">
        <FaRupeeSign className="text-green-600 text-xl" />
        <div>
          <div className="text-sm text-gray-500">Total Savings</div>
          <div className="font-bold">₹{totalSavings.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
