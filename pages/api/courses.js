import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../lib/db";
import { addHours } from "date-fns";
import { utcToZonedTime, format, getTimezoneOffset, zonedTimeToUtc } from "date-fns-tz";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const client = await connectToDatabase();
  const coursesCollection = client.db().collection("courses");
  let courses;
  let { student, course } = req.query;
  let courseNumber;

  if (req.method === "GET") {
    console.log("estudiante", student);
    console.log("curso", parseInt(course));
    console.log("variables en NODE", process.env);

    //GET USERS
    courses = await coursesCollection
      .find({ student: student, number: parseInt(course) })
      .sort({ number: -1 })
      .toArray();
    console.log("courses", courses);
  } else if (req.method === "POST") {
    console.log("hora ACTUAL en NODE", new Date());

    let { student, startDate, weekDays, weekHours, numberOfClasses, number } = req.body;

    console.log("recibido en NODE", startDate);
    console.log("horas a añadir", Number(startDate[21]));

    console.log("recibido en NODE", startDate);
    console.log("hora startDate en NODE cambiada", zonedTimeToUtc(startDate, "Europe/Riga"));

    courses = await coursesCollection.insertOne({ student: student, number: number, start_date: addHours(new Date(startDate), Number(startDate[21])), number_of_weekclasses: numberOfClasses, days: weekDays, hours: weekHours });
  }
  client.close();
  res.status(200).json({ courses });
}
