import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/models/user.model";
import mongoose from "mongoose";

export const GET = async (request: Request) => {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!session || !sessionUser) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized Request",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(sessionUser._id);
    const messages = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);

    if (!messages || !messages.length) {
      return Response.json(
        {
          success: false,
          message: "No messages found",
          data: [],
        },
        {
          status: 200,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: messages[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while fetching the messages: ", error);
    return Response.json({
      success: false,
      message: "Something went wrong while reading messages",
    });
  }
};
