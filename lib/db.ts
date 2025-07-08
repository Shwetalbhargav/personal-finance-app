import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI!;
const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise!;

export async function connectToDatabase(): Promise<{ db: Db }> {
  const client = await clientPromise;
  const db = client.db();
  return { db };
}
