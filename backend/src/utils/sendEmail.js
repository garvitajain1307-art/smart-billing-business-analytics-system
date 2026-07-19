import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  subject,
  html,
  attachments = [],
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const { data, error } = await resend.emails.send({
    from: `${process.env.EMAIL_FROM_NAME || "Smart Billing"} <onboarding@resend.dev>`,
    to: email,
    subject,
    html,
    attachments: attachments.map((a) => ({
      filename: a.filename,
      content: a.content.toString("base64"),
    })),
  });

  if (error) {
    console.error("Resend email failed:", error);
    throw new Error(error.message || "Resend failed to send email");
  }

  console.log("EMAIL RESULT", data);

  return data;
};