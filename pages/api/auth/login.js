import { MongoClient } from "mongodb";

function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    res.status(200).json({ email, password });
  }
}

export default handler;
