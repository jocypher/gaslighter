import envConstants from "../constants/envConstants";
import emailService from "../services/email/emailService";
import { changePasswordTemplate } from "../services/email/emailTemplates";

async function changePasswordMail(data: { name: string }) {
  try {
    const html = emailService.compileTemplate(changePasswordTemplate, {
      name: data.name,
      app_name: envConstants.APP_NAME,
    });

    return emailService.sendEmail({
      subject: "Change Password Mail",
      html,
    });
  } catch (error) {
    const err = new Error("Failed to send change password mail");
    (err as any).cause = error;
    throw err;
  }
}

export default changePasswordMail;
