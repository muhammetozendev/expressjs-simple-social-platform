import { MailingServiceEnum } from './mailing-service.enum';
import { IMailingService } from './mailing-service.interface';
import { MailgunService } from './mailing-services/mailgun-service';
import { SendgridService } from './mailing-services/sendgrid-service';

/**
 * Imeplementing the factory design pattern to follow open-close principle
 *
 * This pattern will make switching between different services fairly simple
 */
export class MailingServiceFactory {
  constructor(
    private mailgunService: MailgunService,
    private sendgridService: SendgridService
  ) {}

  getMailingService(mailingServiceEnum: MailingServiceEnum): IMailingService {
    switch (mailingServiceEnum) {
      case MailingServiceEnum.MAILGUN:
        return this.mailgunService;
      case MailingServiceEnum.SENDGRID:
        return this.sendgridService;
      default:
        throw new Error('Invalid mailing service');
    }
  }
}
