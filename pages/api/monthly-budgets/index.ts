
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const collection = db.collection("monthlyBudgets");

  if (req.method === "POST") {
    const { month, amount } = req.body;
    if (!month || !amount) {
      return res.status(400).json({ message: "Month and amount are required" });
    }

    const result = await collection.updateOne(
      { month },
      { $set: { month, amount } },
      { upsert: true }
    );

    return res.status(200).json({ message: "Monthly budget saved", result });
  }

  if (req.method === "GET") {
    const { month } = req.query;
    const entry = await collection.findOne({ month });
    return res.status(200).json(entry || {});
  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
