import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if all required param are passed or not
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Username email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // Check for user with same username exist in our Database
    const isUserWithUsernameVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (isUserWithUsernameVerified) {
      return Response.json(
        {
          success: false,
          message: "User exist with this username",
        },
        { status: 409 }
      );
    }

    // Check for user exist with same email in our database
    const isUserExistWithEmail = await UserModel.findOne({ email });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (isUserExistWithEmail) {
      if (isUserExistWithEmail.isVerified) {
        return Response.json(
          {
            success: true,
            message: "User with this email already exists",
          },
          { status: 409 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        isUserExistWithEmail.password = hashedPassword;
        isUserExistWithEmail.verifyCodeExpiry = expiryDate;
        isUserExistWithEmail.verifyCode = verificationCode;

        await isUserExistWithEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = await UserModel.create({
        username: username,
        password: hashedPassword,
        verifyCodeExpiry: expiryDate,
        email: email,
        isVerified: false,
        verifyCode: verificationCode,
        messages: [],
        isAcceptingMessage: false,
      });

      await newUser.save();
    }

    const mailSend = await sendVerificationEmail({
      fullname: username,
      email: email,
      otp: verificationCode,
    });

    if (!mailSend.success) {
      return Response.json(
        {
          success: false,
          message: mailSend.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering the User", error);
    return Response.json(
      {
        success: false,
        message: "Error registering the user",
      },
      { status: 500 }
    );
  }
}
