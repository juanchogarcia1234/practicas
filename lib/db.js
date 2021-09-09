import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb+srv://m001-student:m001-mongodb-basics@cluster0.jyaw3.mongodb.net/uroki?retryWrites=true&w=majority");
  return client;
}
