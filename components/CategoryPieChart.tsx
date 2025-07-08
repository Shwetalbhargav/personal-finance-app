"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { COLORS } from "@/lib/colors";
import { ResponsiveContainer } from "recharts";

type CategoryPieChartProps = {
  categoryData: { category: string; amount: number }[];
};

export default function CategoryPieChart({ categoryData }: CategoryPieChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-black">
      <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>

      <div className="flex flex-col md:flex-row items-center justify-center">
        <ResponsiveContainer width={300} height={300}>
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
          </PieChart>
        </ResponsiveContainer>

        <div className="ml-6 mt-4 md:mt-0">
          <ul className="space-y-1 text-sm">
            {categoryData.map((entry, index) => (
              <li key={index} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 inline-block rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.category}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
