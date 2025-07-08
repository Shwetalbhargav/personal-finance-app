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

interface Props {
  transactions?: Transaction[];
  onRefresh?: () => void;
  refreshTrigger?: number;
}

const COLORS = ["#60a5fa", "#34d399", "#facc15", "#fb923c", "#c084fc", "#f87171"];

export default function MonthlyChart({ transactions, refreshTrigger }: Props) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      let txs: Transaction[] = transactions ?? [];

      if (!txs.length) {
        const res = await fetch("/api/transactions");
        txs = await res.json();
      }

      const grouped: Record<string, number> = {};
      txs.forEach((tx) => {
        const month = format(new Date(tx.date), "MMM yyyy");
        grouped[month] = (grouped[month] || 0) + tx.amount;
      });

      const chartData = Object.entries(grouped).map(([month, amount]) => ({
        month,
        amount,
      }));

      setData(chartData);
    };

    loadData();
  }, [refreshTrigger, transactions]);

  return (
    <div className="p-4 bg-white rounded-lg shadow text-black">
      <ResponsiveContainer width="100%" height={320}>
  <BarChart
    data={data}
    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    barCategoryGap={20} 
    barGap={5} 
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="amount" barSize={40} name="Total Expense">
      <LabelList dataKey="amount" position="top" />
      {data.map((_, i) => (
        <Cell key={i} fill={COLORS[i % COLORS.length]} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

    </div>
  );
}
