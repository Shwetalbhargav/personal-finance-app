import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("personalFinance");
  const { id } = req.query;

  if (!ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const collection = db.collection("transactions");

  switch (req.method) {
    case "PUT": {
      const { amount, description, date } = req.body;

      if (!amount || !description || !date) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await collection.updateOne(
        { _id: new ObjectId(id as string) },
        {
          $set: {
            amount,
            description,
            date: new Date(date),
            updatedAt: new Date(),
          },
        }
      );

      return res.status(200).json({ message: "Transaction updated" });
    }

    case "DELETE": {
      await collection.deleteOne({ _id: new ObjectId(id as string) });
      return res.status(200).json({ message: "Transaction deleted" });
    }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
