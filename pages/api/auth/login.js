import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const client = await MongoClient.connect("mongodb+srv://m001-student:m001-mongodb-basics@cluster0.jyaw3.mongodb.net/uroki?retryWrites=true&w=majority");
    const db = client.db();
    await db.collection("users").insertOne({ email, password });
    client.close();
    res.status(200).json({ name: "John Doe" });
  }
}

export default handler;
