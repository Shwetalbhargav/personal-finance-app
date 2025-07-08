import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { startOfMonth } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const collection = db.collection("transactions");

  if (req.method === "POST") {
    const { amount, description, date, category } = req.body;

    if (
      typeof amount !== "number" ||
      !description ||
      !date ||
      !category
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const transactionDate = new Date(date);
    const monthStart = startOfMonth(transactionDate).toISOString().slice(0, 7); // 'YYYY-MM'

    // 👉 Fetch matching budget
    const budgetDoc = await db.collection("budgets").findOne({
      category,
      month: monthStart,
    });

    const budgetAmount = budgetDoc?.amount || 0;
    const savings = budgetAmount - amount;

    const result = await collection.insertOne({
      amount,
      description,
      date,
      category,
      savings,
    });

    return res.status(201).json({ _id: result.insertedId });
  }

  if (req.method === "GET") {
    const transactions = await collection.find().toArray();
    return res.status(200).json(transactions);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
