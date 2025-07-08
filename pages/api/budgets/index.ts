import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const collection = db.collection("budgets");

  if (req.method === "POST") {
    const { category, amount, month, totalBudget } = req.body;

    if (!category || !month || totalBudget === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await collection.insertOne({
      category,
      month,
      totalBudget: totalBudget || 0, 
    });

    return res.status(201).json({ _id: result.insertedId });
  }

  if (req.method === "GET") {
    const budgets = await collection.find().toArray();
    return res.status(200).json(budgets);
  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
