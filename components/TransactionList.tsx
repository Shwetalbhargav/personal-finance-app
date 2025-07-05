"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
};

export default function TransactionList({ refreshTrigger }: { refreshTrigger: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  return (
    <div className="p-4 bg-white rounded-lg shadow text-black">
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>

      <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Description</th>
            <th className="p-2">Amount (₹)</th>
            <th className="p-2">Date</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-t hover:bg-gray-50">
              <td className="p-2">{tx.description}</td>
              <td className="p-2">{tx.amount.toFixed(2)}</td>
              <td className="p-2">{format(new Date(tx.date), "dd MMM yyyy")}</td>
              <td className="p-2 text-center space-x-2">
                <Dialog>
                  <DialogContent>
                    <TransactionForm
                      mode="edit"
                      existing={tx}
                      onSuccess={fetchTransactions}
                    />
                  </DialogContent>
                  <Button onClick={() => setEditTx(tx)}>Edit</Button>
                </Dialog>
                <Button variant="destructive" onClick={() => deleteTransaction(tx._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
