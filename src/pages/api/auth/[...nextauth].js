
import db from "lib/mongodb";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";


export const nextauthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      
      clientId: "626123949375-68pg6aqomc2botd243hlhj6fvg8rnf2l.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    
    // ...add more providers here
  ],
  callbacks: {
    jwt({ token, user }) {
      // if(user) token.role = "student"
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    },
    async signIn({user}) {
      
      const exist = await db.collection("students").findOne({email: user.email});
      if(exist)
      {
        // await db.collection("students").updateOne({email:user.email}, {$set:{loggedIn:true}})
      }
      else{
        await db.collection("students").insertOne({ email:user.email, loggedIn:true, "63fffe1f8cd0a177eca5dec0":0})
      }

      return true;
    }
  },
  // adapter: MongoDBAdapter(clientPromise, {
  //   collections:{
  //     Accounts: "accounts",
  //     Sessions: "sessions",
  //     Users: "users",
  //     VerificationTokens: "tokens"
  //   },
  //   databaseName:"Education-App"
  // }),
  
}

export default async function auth(req, res) {
  
  console.log("cookies: "+req.cookies.role);
  
  return await NextAuth(req, res, {
    secret: process.env.NEXTAUTH_SECRET_KEY,
    // Configure one or more authentication providers
    providers: [
      GoogleProvider({
        
        clientId: "626123949375-68pg6aqomc2botd243hlhj6fvg8rnf2l.apps.googleusercontent.com",
        clientSecret: "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",
      }),
      
      // ...add more providers here
    ],
    callbacks: {
      jwt({ token, user }) {
        if(user) token.role = req.cookies.role
        return token
      },
      session({ session, token }) {
        session.user.role = token.role
        return session
      },
      async signIn({user}) {
        
        const exist = await db.collection("students").findOne({email: user.email});
        if(exist)
        {
          // await db.collection("students").updateOne({email:user.email}, {$set:{loggedIn:true}})
        }
        else{
          await db.collection("students").insertOne({ email:user.email, loggedIn:true})
        }
  
        return true;
      }
    },
    // adapter: MongoDBAdapter(clientPromise, {
    //   collections:{
    //     Accounts: "accounts",
    //     Sessions: "sessions",
    //     Users: "users",
    //     VerificationTokens: "tokens"
    //   },
    //   databaseName:"Education-App"
    // }),
    
  });
} 