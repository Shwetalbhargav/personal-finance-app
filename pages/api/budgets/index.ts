import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase(); 
    const collection = db.collection("budgets");

    if (req.method === 'GET') {
      const budgets = await collection.find().toArray();
      res.status(200).json(budgets);
    } else if (req.method === 'POST') {
      const budget = req.body;
      const result = await collection.insertOne(budget);
      res.status(201).json({ insertedId: result.insertedId });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
