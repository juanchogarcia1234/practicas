import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const client = await connectToDatabase();
  const usersCollection = client.db().collection("users");
  let users;
  if (req.method === "GET") {
    //GET USERS
    users = await usersCollection.find().toArray();
  } else if (req.method === "POST") {
    let { student, password } = req.body;
    users = await usersCollection.insertOne({ email: student, password });
  }

  client.close();
  res.status(200).json({ users });
}
