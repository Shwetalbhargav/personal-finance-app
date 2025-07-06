import { useState } from "react";
import { categories } from "@/constants/categories";

export default function BudgetForm({ onBudgetSaved }: { onBudgetSaved: () => void }) {
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, category, amount: parseFloat(amount) }),
    });

    if (res.ok) {
      setMonth("");
      setCategory("");
      setAmount("");
      onBudgetSaved();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.label} value={c.label}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Save Budget
      </button>
    </form>
  );
}
