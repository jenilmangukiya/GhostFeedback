import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { Message, UserModel } from "@/models/user.model";

export const POST = async (request: Request) => {
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
    const { content, username } = await request.json();
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isAcceptingMessage) {
      return Response.json({
        success: false,
        message:
          "Failed to send message to the user, User is not accepting the messages at the moment",
      });
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    const updatedUser = await user.save();
    if (!updatedUser) {
      return Response.json({
        success: false,
        message: "Failed to save the message",
      });
    }

    return Response.json({
      success: true,
      message: "Successfully send the message to the user ",
    });
  } catch (error) {
    console.error("Error while sending the message to user: ", error);
    return Response.json({
      success: false,
      message: "Something went wrong while sending the message",
    });
  }
};
