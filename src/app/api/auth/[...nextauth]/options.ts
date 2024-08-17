import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email",
          placeholder: "Enter email address",
          type: "email",
        },
        password: {
          label: "password",
          placeholder: "Enter password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        await dbConnect();
        const user = await UserModel.findOne({
          email: credentials?.identifier,
        });

        if (!user) {
          throw new Error("Invalid email");
        }

        if (!user?.isVerified) {
          throw new Error("Please verify your account before login");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return user as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      token._id = user._id?.toString();
      token.isVerified = user.isVerified;
      token.username = user.username;
      token.isAcceptingMessages = user.isAcceptingMessages;

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
