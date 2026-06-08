import envConstants from "../constants/envConstants";
import emailService from "../services/email/emailService";
import { registerTemplate } from "../services/email/emailTemplates";
async function sendRegisterMail(data: { name: string }) {
  try {
    const html = emailService.compileTemplate(registerTemplate, {
      name: data.name,
      app_name: envConstants.APP_NAME,
    });
    console.log("This is the html", html);

    return emailService.sendEmail({
      subject: "Registered successfully",
      html,
    });
  } catch (error) {
    throw new Error("Server Error occurred");
  }
}

export default sendRegisterMail