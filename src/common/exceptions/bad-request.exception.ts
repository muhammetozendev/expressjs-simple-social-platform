import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
  constructor(payload: string | object) {
    super(400, payload);
  }
}
