import mongooes, { Document, model, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<Message>({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: Boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "please use valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    required: [true, "Verification code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code expiry is required"],
  },
  isAcceptingMessage: {
    type: Boolean,
    required: [true, "isAcceptingMessage is required"],
  },
  messages: [messageSchema],
});

export const UserModel =
  (mongooes.models.User as mongooes.Model<User>) ||
  mongooes.model<User>("User", userSchema);
