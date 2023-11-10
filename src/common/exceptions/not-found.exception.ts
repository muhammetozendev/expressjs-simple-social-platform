import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(payload: string | object) {
    super(404, payload);
  }
}
