import { BaseException } from './base.exception';

export class InternalServerErrorException extends BaseException {
  error?: Error;
  constructor(error?: Error) {
    super(500, {
      message: 'Internal Server Error',
    });
    this.error = error;
  }
}
