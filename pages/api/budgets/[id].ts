import type { NextApiRequest, NextApiResponse } from 'next';
import { updateBudget, deleteBudget } from '@/lib/budget';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const success = await updateBudget(id as string, req.body);
      res.status(success ? 200 : 404).json({ success });
    } else if (req.method === 'DELETE') {
      const success = await deleteBudget(id as string);
      res.status(success ? 200 : 404).json({ success });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
