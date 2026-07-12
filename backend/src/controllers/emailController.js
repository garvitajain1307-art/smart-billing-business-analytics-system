import { sendEmail } from "../utils/sendEmail.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const testEmail = asyncHandler(async (req, res) => {
  await sendEmail({
    email: req.body.email,
    subject: "Smart Billing Test Email",
    html: `
      <h2>Email setup successful 🎉</h2>
      <p>If you're reading this, Nodemailer is working correctly.</p>
    `,
  });

  res.status(200).json({
    success: true,
    message: "Email sent successfully",
  });
});