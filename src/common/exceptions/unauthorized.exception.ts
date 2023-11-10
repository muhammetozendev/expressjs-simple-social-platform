import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(payload: string | object) {
    super(401, payload);
  }
}
