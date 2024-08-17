import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { verifySchema } from "@/schemas/verifySchema";

export const POST = async (request: Request) => {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    if (!username || !code) {
      return Response.json({
        success: false,
        message: "Username and code are required",
      });
    }
    const result = verifySchema.safeParse({ code: code });

    if (!result.success) {
      const codeError = result.error.format().code?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            codeError.length > 0 ? codeError.join(", ") : "Invalid username",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found with this username",
        },
        { status: 404 }
      );
    }

    const isDateValid = new Date(user.verifyCodeExpiry) > new Date();

    if (!isDateValid) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired, Please sign up again to generate a new code",
        },
        { status: 401 }
      );
    }

    if (user.verifyCode !== code) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 401 }
      );
    }

    user.isVerified = true;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "User verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while verifying the Code", error);
    return Response.json({
      success: false,
      message: "Error while verifying the Code",
    });
  }
};
