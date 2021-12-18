import { connectToDatabase } from "../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    //Añadir campo shareurl a la clase concreta
    //Hacer un put a la clase con el nombre del alumno ("topic":"Clase con Alexandr") y la fecha ("recording_end":"2021-12-16T18:33:44Z") y añadir "share_url"
    const client = await connectToDatabase();
    const classesCollection = client.db().collection("classes");
    const myObject = JSON.parse(req.body.payload.object);
    const { topic, recording_end, share_url } = myObject;

    console.log(recording_end);
    console.log("hello");
    // console.log("new Date", new Date(recording_end.substr(0, 10)).toString());

    classes = await classesCollection.updateOne({ student: topic, start_time: recording_end.substring() }, { $set: { moved: true, start_time: addHours(parseISO(dateToMove), 3), end_time: addHours(parseISO(dateToMove), 4) } });
  }
  console.log(JSON.stringify(req.body.payload.object));

  res.status(200).json({ "hello": "rolw" });
}
