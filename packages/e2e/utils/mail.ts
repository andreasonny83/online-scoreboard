import { envConfig } from '../env-keys';
import { MailSlurp } from 'mailslurp-client';

const mailslurp = new MailSlurp({
  apiKey: envConfig.MAILSLURP_API_KEY,
});

export const getVerificationCode = async (emailId: string) => {
  const fullEmail = await mailslurp.getEmail(emailId);
  const body = fullEmail.body;
  console.warn(body);

  if (body) {
    const code = body.match(/verification code: (\d{6})/);
    return code && code[1];
  }
  return null;
};

export const waitForLatestEmail = async (inboxId: string) => {
  const oldEmails = await mailslurp.getEmails(inboxId);
  console.warn('Waiting for verification email...');

  const email = await mailslurp.waitForEmailCount(oldEmails.length + 1, inboxId, 60000);

  return email[oldEmails.length].id || '';
};

export const createInbox = async () => {
  const { emailAddress, id } = await mailslurp.createInbox();

  if (!emailAddress || !id) {
    throw Error('Cannot create a new inbox');
  }

  return { address: emailAddress, id };
};

export const destroyInbox = (id: string) => {
  return mailslurp.deleteInbox(id);
};
