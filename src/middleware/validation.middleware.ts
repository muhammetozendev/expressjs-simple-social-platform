import { Request, Response, NextFunction } from 'express';
import { ValidationError, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Type } from '../common/types/type.interface';
import { BadRequestException } from '../common/exceptions/bad-request.exception';
import { DeepPartial } from 'typeorm';

export interface IValidationOptions {
  body?: Type;
  query?: Type;
  headers?: Type;
  path?: Type;
}

export const validationMiddlware =
  (options: IValidationOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Array that will contain validation errors
    let errors: DeepPartial<ValidationError>[] = [];

    // Validate request object
    if (options.body) {
      const bodyErrors = await validate(
        plainToInstance(options.body, req.body, {
          excludeExtraneousValues: true,
        })
      );
      if (bodyErrors.length > 0) {
        errors.push(...bodyErrors);
      }
    }

    // Validate query object
    if (options.query) {
      const queryErrors = await validate(
        plainToInstance(options.query, req.query, {
          excludeExtraneousValues: true,
        })
      );
      if (queryErrors.length > 0) {
        errors.push(...queryErrors);
      }
    }

    // Validate headers object
    if (options.headers) {
      const headerErrors = await validate(
        plainToInstance(options.headers, req.headers, {
          excludeExtraneousValues: true,
        })
      );
      if (headerErrors.length > 0) {
        errors.push(...headerErrors);
      }
    }

    // Validate path object
    if (options.path) {
      const pathErrors = await validate(
        plainToInstance(options.path, req.params, {
          excludeExtraneousValues: true,
        })
      );
      if (pathErrors.length > 0) {
        errors.push(...pathErrors);
      }
    }

    errors = errors.map((e) => ({
      property: e.property,
      children: e.children,
      constraints: e.constraints,
    }));

    // If there are any errors, throw a bad request exception
    if (errors.length > 0) {
      return next(new BadRequestException(errors));
    }

    // Otherwise, continue
    next();
  };
