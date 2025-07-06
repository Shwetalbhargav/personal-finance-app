import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("personalFinance");
  const collection = db.collection("transactions");

  if (req.method === "GET") {
    try {
      const transactions = await collection.find({}).sort({ date: -1 }).toArray();
      return res.status(200).json(transactions);
    } catch  {
      return res.status(500).json({ message: "Error fetching transactions" });
    }
  }

  if (req.method === "POST") {
    const { amount, description, date, category } = req.body;

    if (!amount || !description || !date || ! category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const result = await collection.insertOne({
        amount: Number(amount),
        description,
        category,
        date: new Date(date),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return res.status(201).json(result);
    } catch  {
      return res.status(500).json({ message: "Error adding transaction" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
