import { Transaction } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  transactions: Transaction[];
  onRefresh: () => void;
};

export default function TransactionList({ transactions, onRefresh }: Props) {
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [open, setOpen] = useState(false);

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="text-left border-b border-gray-300 text-sm">
          <th className="p-2">Date</th>
          <th className="p-2">Category</th>
          <th className="p-2">Description</th>
          <th className="p-2 text-right">Amount</th>
          <th className="p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx._id} className="border-b text-sm text-gray-700">
            <td className="p-2">{tx.date}</td>
            <td className="p-2">{tx.category}</td>
            <td className="p-2">{tx.description}</td>
            <td className="p-2 text-right">₹{tx.amount.toFixed(2)}</td>
            <td className="p-2 text-center space-x-2">
  {/* Edit Button */}
  <Dialog open={open && editTx?._id === tx._id} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <button
        className="rounded-full bg-gray-900 text-white p-2 hover:bg-gray-800"
        onClick={() => setEditTx(tx)}
      >
        <Pencil className="w-4 h-4" />
      </button>
    </DialogTrigger>
    <DialogContent>
      <TransactionForm
        mode="edit"
        existing={tx}
        onSuccess={() => {
          onRefresh();
          setOpen(false);
        }}
      />
    </DialogContent>
  </Dialog>

  {/* Delete Button */}
  <button
    className="rounded-full bg-red-600 text-white p-2 hover:bg-red-500"
    onClick={() => deleteTransaction(tx._id)}
  >
    <Trash2 className="w-4 h-4" />
  </button>
</td>

          </tr>
        ))}
      </tbody>
    </table>
  );
}
