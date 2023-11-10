import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(payload: string | object) {
    super(409, payload);
  }
}
