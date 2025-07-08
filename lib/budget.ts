import { ObjectId } from "mongodb";
import { connectToDatabase } from "./db";
import { Budget } from "@/types"; 

export async function addBudget(budget: Budget) {
  const { db } = await connectToDatabase();
  const collection = db.collection("budgets");

  const result = await collection.insertOne({
    category: budget.category,
    month: budget.month,
    totalBudget: budget.totalBudget || 0, 
  });

  return result.insertedId;
}

export async function updateBudget(id: string, data: Partial<Budget>) {
  const { db } = await connectToDatabase();
  const result = await db.collection("budgets").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  return result.modifiedCount > 0;
}

export async function deleteBudget(id: string) {
  const { db } = await connectToDatabase();
  const result = await db.collection("budgets").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
