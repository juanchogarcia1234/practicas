import { connectToDatabase } from "../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const client = await connectToDatabase();
    const usersCollection = client.db().collection("users");
    await usersCollection.insertOne({ email: "perico" });
    client.close();
  }

  res.status(200).json({ "hello": "rolw" });
}
