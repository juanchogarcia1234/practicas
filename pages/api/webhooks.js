import { connectToDatabase } from "../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("funciona");
    console.log(req);
  }

  res.status(200).json({ "hello": "rolw" });
}
