import BudgetManager from "@/components/BudgetManager";

export default function BudgetsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Budgets</h1>
      <BudgetManager />
    </div>
  );
}
