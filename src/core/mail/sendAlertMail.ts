import envConstants from "../constants/envConstants";
import emailService from "../services/email/emailService";
import { incomingAlertTemplate } from "../services/email/emailTemplates";

async function sendIncomingAlertMail(data: {
  name: string;
  eventData: any;
}) {
  try {
    const html = emailService.compileTemplate(incomingAlertTemplate, {
      name: data.name,
      app_name: envConstants.APP_NAME,
      event_data: data.eventData
    });

    return emailService.sendEmail({
      subject: "Incoming Alert Mail",
      html,
    });
  } catch (error) {
    throw new Error("Server couldn't send email");
  }
}

export default sendIncomingAlertMail;
