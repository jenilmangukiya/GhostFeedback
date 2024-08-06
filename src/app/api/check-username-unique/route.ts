import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { usernameSchema } from "@/schemas/signUpSchema";
import { z } from "zod";

const usernameCheckSchema = z.object({
  username: usernameSchema,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const queryParams = {
      username: url.searchParams.get("username"),
    };

    const result = usernameCheckSchema.safeParse(queryParams);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid username",
        },
        { status: 400 }
      );
    }

    const verifiedUser = await UserModel.findOne({
      username: queryParams.username,
      isVerified: true,
    });

    if (verifiedUser) {
      return Response.json(
        {
          success: false,
          message: "User with this username already exist",
        },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json({
      status: false,
      message: "Error while checking unique username",
    });
  }
}
