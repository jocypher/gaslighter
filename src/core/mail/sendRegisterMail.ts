import envConstants from '../constants/envConstants';
import emailService from '../services/email/emailService';
import { registerTemplate } from '../services/email/emailTemplates';
async function sendRegisterMail(data: { name: string }) {
  try {
    const html = emailService.compileTemplate(registerTemplate, {
      name: data.name,
      app_name: envConstants.APP_NAME,
    });
    console.log('This is the html', html);

    return emailService.sendEmail({
      subject: 'Registered successfully',
      html,
    });
  } catch (error) {
    const err = new Error('Failed to send register mail');
    (err as any).cause = error;
    throw err;
  }
}

export default sendRegisterMail;
