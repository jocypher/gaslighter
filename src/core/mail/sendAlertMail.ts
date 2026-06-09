import envConstants from "../constants/envConstants";
import emailService from "../services/email/emailService";
import { incomingAlertTemplate } from "../services/email/emailTemplates";

async function sendIncomingAlertMail(data: {
  name: string;
  result: any;
  timestamp: any;
}) {
  try {
    const html = emailService.compileTemplate(incomingAlertTemplate, {
      name: data.name,
      app_name: envConstants.APP_NAME,
      result: data.result,
      timestamp: data.timestamp,
    });

    return emailService.sendEmail({
      subject: "Incoming Alert Mail",
      html,
    });
  } catch (error) {
    const err = new Error("Failed to send incoming alert mail");
    (err as any).cause = error;
    throw err;
  }
}

export default sendIncomingAlertMail;
