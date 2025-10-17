import * as nodemailer from 'nodemailer';
import * as dotenv from "dotenv";
dotenv.config();

const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASS,EMAIL_USER,EMAIL_PASS}=process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST||"sandbox.smtp.mailtrap.io",
  port: Number(SMTP_PORT)||2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER||"3463e343ab1b61",
    pass: SMTP_PASS||"9bc51995f8a7be",
  },
});

// const transporter = nodemailer.createTransport({
//   service:"Gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

export const sendMail = async ({ to, subject, text }: { to: string; subject: string; text: string }): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Support Team" <${SMTP_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent successfully to: ${to}`);
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
}


  