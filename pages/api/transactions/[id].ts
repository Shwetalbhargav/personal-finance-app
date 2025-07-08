import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { startOfMonth } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const { db } = await connectToDatabase();
  const collection = db.collection("transactions");

  if (req.method === "PUT") {
    const { amount, description, date, category } = req.body;

    const transactionDate = new Date(date);
    const monthStart = startOfMonth(transactionDate).toISOString().slice(0, 7);

    // 👉 Fetch matching budget
    const budgetDoc = await db.collection("budgets").findOne({
      category,
      month: monthStart,
    });

    const budgetAmount = budgetDoc?.amount || 0;
    const savings = budgetAmount - amount;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          amount,
          description,
          date,
          category,
          savings,
        },
      }
    );

    return res.status(200).json({ modified: result.modifiedCount });
  }

  if (req.method === "DELETE") {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ deleted: result.deletedCount });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
