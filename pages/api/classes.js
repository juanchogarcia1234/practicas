import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../lib/db";
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const client = await connectToDatabase();
  const classesCollection = client.db().collection("classes");

  //UPDATE CLASSES
  if (req.method === "PUT") {
    const { id, student, action, classNumber, classCourse } = req.body;
    console.log("id", id);
    console.log("action", action);
    console.log("number", classNumber);
    console.log("course", classCourse);

    var good_id = new ObjectId(id);
    let classes;
    if (action === "done") {
      //set to done
      classes = await classesCollection.updateOne({ _id: good_id }, { $set: { done: true } });
    } else if (action === "cancel") {
      //1º cancel class
      classes = await classesCollection.updateOne({ _id: good_id }, { $set: { cancelled: true } });
      //2º update rest of classes
      classes = await classesCollection.updateMany({ student: student, course: classCourse, number: { $gt: classNumber } }, { $inc: { number: -1 } });
      console.log(classes);
    }
    client.close();
    res.status(200).json({ classes });
  } else if (req.method === "GET") {
    //GET CLASSES
    let classes;

    const { startDate, endDate } = req.query;
    if (session.user.email === "juan@gmail.com") {
      //retorno todas
      classes = await classesCollection.find({ start_time: { $gte: new Date(new Date(startDate).toISOString()) }, end_time: { $lte: new Date(new Date(endDate).toISOString()) } }).toArray();
    } else {
      //retorno solo las del usuario
      classes = await classesCollection.find({ student: session.user.email, start_time: { $gte: new Date(new Date(startDate).toISOString()) }, end_time: { $lte: new Date(new Date(endDate).toISOString()) } }).toArray();
    }
    client.close();
    res.status(200).json({ classes });
  } else {
  }
}
