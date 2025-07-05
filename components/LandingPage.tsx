"use client";

import { useState } from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import MonthlyChart from "@/components/MonthlyChart";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function LandingPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Personal Finance Tracker</h1>

      {/* Two-Column Grid */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Transactions */}
        <div className="h-full space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transactions</h2>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="text-white bg-blue-600 hover:bg-blue-700">+ Add</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <TransactionForm onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>

          <TransactionList refreshTrigger={refreshKey} />
        </div>

        {/* Right Column: Chart */}
        <div className="h-full space-y-4 mt-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Weekly Breakdown</h2>
            {/* Empty div for alignment with Add button */}
            <div className="w-[72px]" />
          </div>

          <MonthlyChart refreshTrigger={refreshKey} />
        </div>
      </div>
    </div>
  );
}
