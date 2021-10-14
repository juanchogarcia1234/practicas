import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../lib/db";
import { isLastElement } from "../../helpers";
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
      //1º cancel class and get number of class to cancel
      classes = await classesCollection.updateOne({ _id: good_id }, { $set: { cancelled: true } });
      let classToCancell = await classesCollection.find({ _id: good_id }).toArray();
      let classToCancellNumber = classToCancell[0].number;
      //2º update rest of classes
      classes = await classesCollection.updateMany({ student: student, course: classCourse, number: { $gt: classNumber } }, { $inc: { number: -1 } });
      //3º Cojo los dias de la semana del curso
      const coursesCollection = client.db().collection("courses");
      let classDays = await coursesCollection.find({ number: classCourse, student: student }).toArray();
      classDays = classDays[0].days;
      //3A) Cojo la ultima clase para averiguar que día es y lo comparo con el array de días
      if (classToCancellNumber === 8) {
        console.log(classDays.indexOf(classToCancell[0].day + 1));
      } else {
        let lastClass = await classesCollection.find({ number: 7, student: student, course: classCourse }).toArray();
        lastClass = lastClass[0];
        let dayOfTheNewClass = isLastElement(classDays, lastClass.day) ? classDays[0] : classDays[classDays.indexOf(lastClass.day) + 1];
        console.log("es la ultima clase de la semana", isLastElement(classDays, lastClass.day));
        console.log("la nueva clase va a ser este dia", dayOfTheNewClass);
      }
      //3º A) Last class will be number 7 now but if cancelled class was the last, then it will be 8
      //3º A) new class will be always number 8?
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
