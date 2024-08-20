import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { UserModel } from "@/models/user.model";

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
    const { acceptMessage } = await request.json();

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: sessionUser._id,
      },
      {
        isAcceptingMessage: acceptMessage,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update status of user accepting the message",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json({
      success: true,
      message: "User successfully updated for accepting the messages",
    });
  } catch (error) {
    console.error("Error while setting up the accept message status :", error);
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
};

export const GET = async (request: Request) => {
  await dbConnect();

  const session = await getServerSession();

  const sessionUser = session?.user;
  if (!session || !sessionUser) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized request",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const user = await UserModel.findById(sessionUser._id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
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
        isAcceptingMessages: user.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error fetching the info for accepting message", error);
    return Response.json({
      status: false,
      message: "Something went wrong while fetching the accepting status",
    });
  }
};
