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

  if (session.user.email === "juan@gmail.com") {
    //retorno todas
    classes = await classesCollection.find({ cancelled: true }).toArray();
  } else {
    //retorno solo las del usuario
    classes = await classesCollection.find({ student: session.user.email, cancelled: true }).toArray();
  }
  client.close();
  res.status(200).json({ classes });
}
