import { useEffect, useState } from "react";
import { categories } from "@/constants/categories";

type Budget = {
  _id?: string;
  category: string;
  amount: number;
  month: string;
};

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [form, setForm] = useState<Budget>({ category: "", amount: 0, month: "" });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const res = await fetch("/api/budgets");
    const data = await res.json();
    setBudgets(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ category: "", amount: 0, month: "" });
    fetchBudgets();
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Set Monthly Budget</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <select
          className="border px-2 py-1 rounded w-full"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.label} value={cat.label}>{cat.label}</option>
          ))}
        </select>

        <input
          type="month"
          className="border px-2 py-1 rounded w-full"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
          required
        />

        <input
          type="number"
          className="border px-2 py-1 rounded w-full"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
          required
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">
          Add Budget
        </button>
      </form>

      <div>
        <h3 className="font-medium mt-4 mb-2">Existing Budgets</h3>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b._id}>
                <td className="p-2 border">{b.category}</td>
                <td className="p-2 border">{b.month}</td>
                <td className="p-2 border text-right">{b.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
