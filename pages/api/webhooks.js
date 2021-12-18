import { connectToDatabase } from "../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    //Añadir campo shareurl a la clase concreta
    //Hacer un put a la clase con el nombre del alumno ("topic":"Clase con Alexandr") y la fecha ("recording_end":"2021-12-16T18:33:44Z") y añadir "share_url"
    const client = await connectToDatabase();
    const classesCollection = client.db().collection("classes");

    const { start_time, topic, share_url } = req.body.payload.object;

    const recordingDateFrom = start_time.substring(0, 10) + "T00:00:00.000Z";
    const recordingDateTo = start_time.substring(0, 10) + "T23:00:00.000Z";

    console.log(topic);
    console.log(start_time);
    console.log("new date", start_time + "T00:00:00.000Z");
    console.log(share_url);
    console.log("hello", start_time.substring(0, 10));

    await classesCollection.updateOne({ student: topic, start_time: { $gt: new Date(recordingDateFrom) }, end_time: { $lt: new Date(recordingDateTo) } }, { $set: { share_url: share_url } });
  }

  res.status(200).json({ "hello": "rolw" });
}
