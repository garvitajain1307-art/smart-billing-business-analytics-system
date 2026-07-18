import nodemailer from "nodemailer";

export const sendEmail = async ({
  email,
  subject,
  html,
  attachments = [],
}) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email environment variables are missing");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Smart Billing"}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
      attachments,
    });

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};