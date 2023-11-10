import { BaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(payload: string | object) {
    super(403, payload);
  }
}
