import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("personalFinance");
  const collection = db.collection("transactions");

  const { id } = req.query;

  if (!ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }

  const _id = new ObjectId(id as string);

  if (req.method === "PUT") {
    const { amount, description, date } = req.body;

    if (!amount || !description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const result = await collection.updateOne(
        { _id },
        {
          $set: {
            amount: Number(amount),
            description,
            date: new Date(date),
            updatedAt: new Date(),
          },
        }
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error updating transaction" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await collection.deleteOne({ _id });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error deleting transaction" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
