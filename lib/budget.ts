import { ObjectId } from "mongodb";
import { connectToDatabase } from "./db";

export async function updateBudget(id: string, data: Record<string, unknown>) {
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
