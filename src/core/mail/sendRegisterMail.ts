import envConstants from "../constants/envConstants";
import emailService from "../services/email/emailService";
import { registerTemplate } from "../services/email/emailTemplates";
async function sendRegisterMail(email: string, data: { name: string }) {
  try {
    const html = emailService.compileTemplate(registerTemplate, {
      name: data.name,
      app_name: envConstants.APP_NAME,
    });

    return emailService.sendEmail({
      to: email,
      subject: "Registered successfully",
      html,
    });
  } catch (error) {
    throw new Error("Server Error occurred");
  }
}

export default sendRegisterMail