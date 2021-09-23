import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const client = await connectToDatabase();
  const classesCollection = client.db().collection("classes");
  let classes;

  const { startDate, endDate } = req.query;
  if (session.user.email === "juan@gmail.com") {
    //retorno todas
    classes = await classesCollection.find({ student: session.user.email, start_time: { $gte: new Date(new Date(startDate).toISOString()) }, end_time: { $lte: new Date(new Date(endDate).toISOString()) } }).toArray();
  } else {
    //retorno solo las del usuario
    classes = await classesCollection.find({ student: session.user.email, start_time: { $gte: new Date(new Date(startDate).toISOString()) }, end_time: { $lte: new Date(new Date(endDate).toISOString()) } }).toArray();
  }
  client.close();
  res.status(200).json({ classes });
}
