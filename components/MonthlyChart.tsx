"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Legend,
  Cell,
} from "recharts";
import { format } from "date-fns";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
};

type ChartData = {
  month: string;
  amount: number;
};

const COLORS = ["#60a5fa", "#34d399", "#facc15", "#fb923c", "#c084fc", "#f87171"];

export default function MonthlyChart({ refreshTrigger }: { refreshTrigger: number }) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchAndGroup = async () => {
      const res = await fetch("/api/transactions");
      const transactions: Transaction[] = await res.json();

      const grouped: Record<string, number> = {};

      transactions.forEach((tx) => {
        const date = new Date(tx.date);
        const month = format(date, "MMM yyyy"); // e.g. "Jul 2025"
        grouped[month] = (grouped[month] || 0) + tx.amount;
      });

      const chartData = Object.entries(grouped).map(([month, amount]) => ({
        month,
        amount,
      }));

      setData(chartData);
    };

    fetchAndGroup();
  }, [refreshTrigger]);

  return (
    <div className="p-4 bg-white rounded-lg shadow text-black">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", dy: 10 }} />
          <YAxis label={{ value: "Total ₹", angle: -90, position: "insideLeft", dx: -10 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" name="Total Expense">
            <LabelList dataKey="amount" position="top" />
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
