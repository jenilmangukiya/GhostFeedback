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
  return await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "GhostFeedback | Verification E-mail",
    react: SendVerificationEmail({ fullname, otp }),
  });
};
