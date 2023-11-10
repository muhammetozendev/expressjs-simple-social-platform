import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../common/exceptions/unauthorized.exception';
import { verify } from 'jsonwebtoken';
import { env } from '../config/env';
import { IActiveUser } from '../modules/auth/types/active-user.interface';

// For type safety when accessing the token
export const ACTIVE_USER = 'ACTIVE_USER';

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    switch (type) {
      case 'Bearer':
        const activeUser = verify(token, env.JWT_SECRET) as IActiveUser;
        req[ACTIVE_USER] = activeUser;
        return next();

      default:
        throw new Error();
    }
  } catch (error) {
    next(new UnauthorizedException('Authentication failed'));
  }
};
