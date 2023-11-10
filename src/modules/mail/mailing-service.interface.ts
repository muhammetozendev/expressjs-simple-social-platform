export interface IMailingService {
  sendMail(options: {
    to: string;
    subject: string;
    cc?: string[];
    bcc?: string[];
    content?: string;
    template?: string;
  }): Promise<void>;
}
