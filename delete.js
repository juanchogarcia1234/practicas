const { MongoClient } = require("mongodb");

async function main() {
  // we'll add code here soon
  const uri = "mongodb+srv://m001-student:m001-mongodb-basics@cluster0.jyaw3.mongodb.net/uroki?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    await client.connect();

    // //Course collection
    const coursesCollection = await client.db().collection("courses");
    await coursesCollection.deleteOne({ number: 2, student: "Alexandr" });

    //Clases collection
    // const classesCollection = await client.db().collection("classes");
    // await classesCollection.deleteMany({ student: "Alexandr", course: 2 });
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

main();

// //Course collection
// const coursesCollection = await client.db().collection("courses");
// coursesCollection.deleteOne({ number: 2, student: "Alexandr" });

// //Classes collection
// const classesCollection = client.db().collection("classes");
// classesCollection.deleteMany();

// //Users collection
// const usersCollection = client.db().collection("users");
