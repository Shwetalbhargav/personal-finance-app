// BudgetManager.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BudgetForm from "./BudgetForm";
import { Pencil, Trash2, IndianRupee } from "lucide-react";

type Budget = {
  _id: string;
  category: string;
  amount?: number;
  month: string;
  totalBudget?: number;
};

type BudgetManagerProps = {
  displayOnly?: boolean;
  selectedMonth?: string;
};

export default function BudgetManager({ displayOnly = false, selectedMonth }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentMonth, setCurrentMonth] = useState(
    selectedMonth ||
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );

  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [showMonthlyForm, setShowMonthlyForm] = useState(false);
  const [monthlyForm, setMonthlyForm] = useState({ month: currentMonth, amount: 0 });
  const [monthlyBudgetAmount, setMonthlyBudgetAmount] = useState<number | null>(null);

  const fetchBudgets = async () => {
    const res = await fetch(`/api/budgets?month=${currentMonth}`);
    const data = await res.json();
    setBudgets(data);
  };

  const fetchMonthlyBudget = async () => {
    const res = await fetch(`/api/monthly-budget?month=${currentMonth}`);
    const data = await res.json();
    setMonthlyBudgetAmount(data.amount || null);
  };

  const deleteBudget = async (id: string) => {
    if (!confirm("Delete this budget?")) return;
    const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    if (res.ok) fetchBudgets();
  };

  const handleMonthlySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/monthly-budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(monthlyForm),
    });
    if (res.ok) {
      setMonthlyBudgetAmount(monthlyForm.amount);
      setShowMonthlyForm(false);
    } else {
      alert("Failed to save monthly budget");
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchMonthlyBudget();
  }, [currentMonth]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      {!displayOnly && (
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="border px-2 py-1 rounded text-black"
            />
            {monthlyBudgetAmount !== null && (
              <div className="text-gray-800 font-semibold ml-2">
                ₹ {monthlyBudgetAmount.toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Dialog open={showMonthlyForm} onOpenChange={setShowMonthlyForm}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2">
                  <IndianRupee size={18} />
                  Set Monthly Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white text-black rounded-lg">
                <h2 className="text-lg font-bold mb-4">Set Monthly Budget</h2>
                <form onSubmit={handleMonthlySubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-1/3 font-medium">Month:</label>
                    <input
                      type="month"
                      name="month"
                      required
                      value={monthlyForm.month}
                      onChange={(e) =>
                        setMonthlyForm({ ...monthlyForm, month: e.target.value })
                      }
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="amount" className="mb-1 font-medium">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      placeholder="Monthly Budget Amount"
                      required
                      value={monthlyForm.amount}
                      onChange={(e) =>
                        setMonthlyForm({
                          ...monthlyForm,
                          amount: Number(e.target.value),
                        })
                      }
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    Save Monthly Budget
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <BudgetForm
                  existing={editBudget ?? undefined}
                  onSuccess={() => {
                    fetchBudgets();
                    setShowForm(false);
                    setEditBudget(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Budget Table */}
      <table className="w-full table-auto border-t border-b border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-right">Total Budget</th>
            {!displayOnly && <th className="p-2 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => (
            <tr key={b._id} className="border-b text-sm text-gray-700">
              <td className="p-2">{b.category}</td>
              <td className="p-2 text-right">{b.totalBudget?.toFixed(2) || "-"}</td>
              {!displayOnly && (
                <td className="p-2 flex justify-center gap-2">
                  <Dialog open={showForm && editBudget?._id === b._id} onOpenChange={setShowForm}>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full bg-gray-900 text-white hover:bg-gray-700"
                        onClick={() => setEditBudget(b)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <BudgetForm
                        existing={editBudget ?? undefined}
                        onSuccess={() => {
                          fetchBudgets();
                          setShowForm(false);
                          setEditBudget(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => deleteBudget(b._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
