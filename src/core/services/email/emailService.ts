import nodemailer from "nodemailer";
import envConstants from "../../constants/envConstants";

const transporter = nodemailer.createTransport({
  // host:"smtp.sendgrid.net",
  // port: 587,
  service: envConstants.smtp.service,
  auth: {
    user: envConstants.smtp.email,
    pass: envConstants.smtp.password,
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
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: envConstants.smtp.email,
    to,
    subject,
    html,
  });
}

export default {sendEmail,compileTemplate};
