import { NextFunction } from 'express';
import { Req, Res } from '../types/custom';

export function routeHandler(
  cb: (
    request: Req,
    response: Res,
    nextFunction: NextFunction
  ) => any | Promise<any>
) {
  return async (req: Req, res: Res, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
