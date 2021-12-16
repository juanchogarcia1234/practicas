import { connectToDatabase } from "../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const client = await connectToDatabase();
    const usersCollection = client.db().collection("users");
    let event = JSON.parse(req.body);
    var uuid = event.payload.object.uuid;
    await usersCollection.insertOne({ email: uuid });
    client.close();
  }
  console.log("funciona");
  res.status(200).json({ "hello": "rolw" });
}
