import * as React from "react";

interface EmailTemplateProps {
  fullname: string;
  otp: string;
}

export const SendVerificationEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  fullname,
  otp,
}) => (
  <div>
    <h1>Welcome, {fullname}!</h1>
    <p>This is your OTP: {otp}</p>
  </div>
);
