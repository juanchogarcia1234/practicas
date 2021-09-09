import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { connectToDatabase } from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true
  },
  //Array de providers
  providers: [
    //Credentials Provider
    Providers.Credentials({
      async authorize(credentials) {
        //Our auth login
        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found!");
        }

        if (credentials.password !== user.password) {
          throw new Error("Wrong password");
        }
        client.close();

        //This object will be encoded in the JSON WEBTOKEN
        return { email: user.email };
      }
    })
  ]
});
