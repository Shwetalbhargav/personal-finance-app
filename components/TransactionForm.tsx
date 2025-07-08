"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaMoneyBill, FaRegCalendarAlt, FaRegFileAlt, FaList } from "react-icons/fa";
  import { categories } from "../constants/categories";

  
export default function TransactionForm({
  onSuccess,
  existing,
  mode = "add",
}: {
  onSuccess: () => void;
  existing?: {
    _id: string;
    amount: number;
    description: string;
    date: string;
    category: string;
  };
  mode?: "add" | "edit";
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existing) {
      setAmount(existing.amount.toString());
      setDescription(existing.description);
      setDate(existing.date.slice(0, 10));
      setCategory(existing.category);
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      amount: parseFloat(amount),
      description,
      date,
      category,
    };

    const method = mode === "edit" ? "PUT" : "POST";
    const endpoint = mode === "edit" ? `/api/transactions/${existing?._id}` : "/api/transactions";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-md shadow-sm text-black w-full"
    >
      <div>
        <Label htmlFor="amount" className="flex items-center gap-2">
          <FaMoneyBill /> Amount
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-black placeholder-black"
          placeholder="Enter amount"
        />
      </div>

      <div>
        <Label htmlFor="description" className="flex items-center gap-2">
          <FaRegFileAlt /> Description
        </Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-black placeholder-black"
          placeholder="Enter description"
        />
      </div>

      <div>
        <Label htmlFor="category" className="flex items-center gap-2">
          <FaList /> Category
        </Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
             <option key={cat.label} value={cat.label}>
          {cat.label}
          </option>
           ))}
        </select>
      </div>

      <div>
        <Label htmlFor="date" className="flex items-center gap-2">
          <FaRegCalendarAlt /> Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-black"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : mode === "edit" ? "Update" : "Add Transaction"}
      </Button>
    </form>
  );
}
