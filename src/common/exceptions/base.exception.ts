/** Base exception type that all exceptions must implement */
export class BaseException extends Error {
  private _statusCode: number;
  private _payload: string | object;

  constructor(statusCode: number, payload: string | object) {
    super('HTTP Exception occured');
    this._statusCode = statusCode;
    if (typeof payload === 'string') {
      this._payload = { message: payload };
    } else {
      this._payload = payload;
    }
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get payload(): string | object {
    return this._payload;
  }
}
