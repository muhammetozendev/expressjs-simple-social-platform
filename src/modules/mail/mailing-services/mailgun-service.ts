import { IMailingService } from '../mailing-service.interface';

export class MailgunService implements IMailingService {
  async sendMail(options: {
    to: string;
    subject: string;
    cc: string[];
    bcc: string[];
    content?: string;
    template?: string;
  }): Promise<void> {
    // Fake implementation of Mailgun service
    console.log('Sending the following mail using Mailgun service');
    console.log(options);
  }
}
