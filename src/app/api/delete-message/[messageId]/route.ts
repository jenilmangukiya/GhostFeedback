import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { UserModel } from "@/models/user.model";

export const DELETE = async (
  request: Request,
  { params }: { params: { messageId: string } }
) => {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  const messageId = params.messageId;

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

  if (!messageId || messageId == "undefined") {
    return Response.json(
      {
        success: false,
        message: "Message Id is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: sessionUser._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting the messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong while deleting messages",
      },
      { status: 500 }
    );
  }
};
