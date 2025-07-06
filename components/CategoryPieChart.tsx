import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { categories } from "../constants/categories";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#d88884",
  "#84d8b2",
  "#c684d8",
  "#d8b484",
  "#84c2d8",
  "#d884a6",
];

interface Props {
  data: { category: string; amount: number }[];
  refreshTrigger?: number;
}

const CategoryPieChart = ({ data }: Props) => {
  const chartData = data.map((d) => ({
    name: d.category,
    value: d.amount,
  }));

  const renderLegend = (value: string) => {
    const cat = categories.find((c) => c.label === value);
    return (
      <span className="flex items-center gap-2">
        {cat?.icon?.()}
        <span>{value}</span>
      </span>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={60} formatter={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
