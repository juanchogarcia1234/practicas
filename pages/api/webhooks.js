import { connectToDatabase } from "../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("funciona");
    console.log(req);
  }
  console.log(JSON.stringify(req.body.payload.object));

  res.status(200).json({ "hello": "rolw" });
}
