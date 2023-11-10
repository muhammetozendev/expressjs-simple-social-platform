import { IMailingService } from '../mailing-service.interface';

export class SendgridService implements IMailingService {
  async sendMail(options: {
    to: string;
    subject: string;
    cc: string[];
    bcc: string[];
    content?: string;
    template?: string;
  }): Promise<void> {
    // Fake implementation of Sendgrid service
    console.log('Sending the following mail using Sendgrid service');
    console.log(options);
  }
}
