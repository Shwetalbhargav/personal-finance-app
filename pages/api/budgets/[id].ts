import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const collection = db.collection("budgets");

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  if (req.method === "PUT") {
    const { category, amount, month, totalBudget } = req.body;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          category,
          amount,
          month,
          totalBudget: totalBudget || 0, 
        },
      }
    );

    return res.status(200).json({ modified: result.modifiedCount });
  }

  if (req.method === "DELETE") {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ deleted: result.deletedCount });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
