import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await connectToDatabase();
  const {db }= await connectToDatabase();
  const collection = db.collection("budgets");

  if (req.method === "POST") {
    const { month, category, amount } = req.body;
    if (!month || !category || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid budget input" });
    }

    await collection.updateOne(
      { month, category },
      { $set: { amount } },
      { upsert: true }
    );

    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    const { month } = req.query;
    const query = month ? { month } : {};
    const budgets = await collection.find(query).toArray();
    return res.status(200).json(budgets);
  }

  return res.status(405).end(); 
}

export async function updateBudget(id: string, data: any) {
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
