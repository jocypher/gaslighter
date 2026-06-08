import nodemailer from "nodemailer";
import envConstants from "../../constants/envConstants";

const transporter = nodemailer.createTransport({
  // host:"smtp.sendgrid.net",
  // port: 587,
  host: envConstants.smtp.HOST,
  port: envConstants.smtp.PORT,
  auth: {
    user: envConstants.smtp.USERNAME,
    pass: envConstants.smtp.PASSWORD,
  },
});

function compileTemplate(template: string, variables: Record<string, string>) {
  let output = template;

  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    const value = variables[key] ?? "";
    output = output.replace(regex, value);
  }

  return output;
}

async function sendEmail({

  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: "Resend <onboarding@resend.dev>",
    to: "jonathanwilchield@gmail.com",
    subject,
    html,
  });
}

export default {sendEmail,compileTemplate};
