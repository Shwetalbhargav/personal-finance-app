import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { categories } from "@/constants/categories";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Budget = {
  category: string;
  amount: number;
  month: string;
};

type Transaction = {
  category: string;
  amount: number;
  date: string;
};

interface Props {
  selectedMonth: string;
  transactions: Transaction[];
}

export default function BudgetComparisonChart({ selectedMonth, transactions }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      const res = await fetch("/api/budgets");
      const data = await res.json();
      setBudgets(data);
    };

    fetchBudgets();
  }, []);

  // Filter for selected month
  const monthBudgets = budgets.filter((b) => b.month === selectedMonth);
  const monthTx = transactions.filter(
    (tx) => tx.date.slice(0, 7) === selectedMonth
  );

  // Group actuals
  const actuals: Record<string, number> = {};
  monthTx.forEach((tx) => {
    if (!actuals[tx.category]) actuals[tx.category] = 0;
    actuals[tx.category] += tx.amount;
  });

  const labels = Array.from(new Set([...monthBudgets.map(b => b.category), ...Object.keys(actuals)]));

  const data = {
    labels,
    datasets: [
      {
        label: "Budgeted",
        data: labels.map(label => monthBudgets.find(b => b.category === label)?.amount || 0),
        backgroundColor: "rgba(59, 130, 246, 0.6)", 
      },
      {
        label: "Actual",
        data: labels.map(label => actuals[label] || 0),
        backgroundColor: "rgba(239, 68, 68, 0.6)", 
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-2">Budget vs Actual</h2>
      <Bar data={data} />
    </div>
  );
}
