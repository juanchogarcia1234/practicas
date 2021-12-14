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
    if (course) {
      //Get certain course
      courses = await coursesCollection
        .find({ student: student, number: parseInt(course) })
        .sort({ number: -1 })
        .toArray();
      console.log("courses", courses);
    } else {
      console.log("curso no especificado");
      courses = await coursesCollection.find({ student: student }).sort({ number: -1 }).toArray();
      console.log("courses no especificados", courses);
    }
  } else if (req.method === "POST") {
    let { student, startDate, weekDays, weekHours, numberOfClasses, number } = req.body;

    courses = await coursesCollection.insertOne({ student: student, number: number, start_date: addHours(new Date(startDate), Number(startDate[21])), number_of_weekclasses: numberOfClasses, days: weekDays, hours: weekHours });
  }
  client.close();
  res.status(200).json({ courses });
}
