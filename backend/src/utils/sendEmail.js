import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
  
});

export const sendEmail = async ({
  email,
  subject,
  html,
  attachments = [],
}) => {
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is missing");
  }

  if (!process.env.EMAIL_PASSWORD) {
    throw new Error("EMAIL_PASSWORD is missing");
  }

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "Smart Billing"}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
    attachments,
  });

  console.log("EMAIL RESULT", {
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
    messageId: info.messageId,
  });

  return info;
};