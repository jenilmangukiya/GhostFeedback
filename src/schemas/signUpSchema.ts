import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 character long")
  .max(20, "Username must not be more then 20 character long")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: usernameSchema,
  email: z.string().email({ message: "Email address invalid" }),
  password: z
    .string()
    .min(6, "Password must be 6 character long")
    .max(20, "password must not be more then 20 character long"),
});
