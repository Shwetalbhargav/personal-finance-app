import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Budget {
  category: string;
  amount: number;
  totalBudget?: number;
}

interface Props {
  chartType?: "pie" | "bar";
}

export default function BudgetOnlyChart({ chartType = "bar" }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    fetch("/api/budgets")
      .then((res) => res.json())
      .then((data) => setBudgets(data))
      .catch((err) => console.error("Failed to load budgets", err));
  }, []);

  const labels = budgets.map((b) => b.category);
  const dataValues = budgets.map((b) => b.totalBudget ?? b.amount);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Budget Amount",
        data: dataValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return chartType === "pie" ? (
    <Pie data={chartData} />
  ) : (
    <Bar data={chartData} />
  );
}
