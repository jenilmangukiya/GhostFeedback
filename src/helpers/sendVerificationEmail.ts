import { resend } from "@/lib/resend";
import { SendVerificationEmail } from "../../EmailTemplates/SendVerificationEmail";

export const sendVerificationEmail = async ({
  fullname,
  email,
  otp,
}: {
  fullname: string;
  email: string;
  otp: string;
}) => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "GhostFeedback | Verification E-mail",
      react: SendVerificationEmail({ fullname, otp }),
    });
    return { success: true, message: "Verification email send successfully" };
  } catch (error) {
    console.error("Error while sending the verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
};
