import { useState } from "react";
import { categories } from "@/constants/categories";
import { Budget } from "@/types"; 

interface Props {
  onSuccess: () => void;
  existing?: Budget;
  mode?: "add" | "edit";
}

export default function BudgetForm({ onSuccess, existing, mode = "add" }: Props) {
  const [form, setForm] = useState<Omit<Budget, "_id">>({
    category: existing?.category || "",
    month: existing?.month || "",
    totalBudget: existing?.totalBudget ?? 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalBudget" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validation check
    if (!form.category || !form.month || !form.totalBudget || form.totalBudget <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }
  
    const payload = {
      category: form.category,
      month: form.month,
      totalBudget: form.totalBudget,
    };
    console.log("Submitting payload:", payload);
  
    const res = await fetch(
      mode === "edit" ? `/api/budgets/${existing?._id}` : "/api/budgets",
      {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  
    if (res.ok) {
      onSuccess();
    } else {
      const error = await res.json();
      console.error("API error:", error);
      alert("Failed to submit budget. Check console.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow w-full max-w-md mx-auto text-black">
      <h2 className="text-lg font-semibold">Budgets</h2>

      {/* Category Dropdown */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full p-2 border rounded text-black"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.label} value={cat.label}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Month Input */}
      <div className="relative">
  <input
    type="month"
    name="month"
    value={form.month}
    onChange={handleChange}
    className="w-full p-2 pl-10 border rounded text-black"
    required
  />
  <span className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">
    📅
  </span>
</div>

      {/* Budget Input */}
      <input
        name="totalBudget"
        type="number"
        value={form.totalBudget === 0 ? "" : form.totalBudget}
        onChange={handleChange}
        placeholder="Total Budget"
        className="w-full p-2 border rounded text-black"
        required
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {mode === "edit" ? "Update" : "Add"} Budget
      </button>
    </form>
  );
}
