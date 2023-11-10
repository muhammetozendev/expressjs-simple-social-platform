import * as Joi from 'joi';
import { config } from 'dotenv';
config();

export interface IEnvironmentVariables {
  JWT_SECRET: string;
}

export function validateEnv() {
  Joi.object({
    JWT_SECRET: Joi.string().required(),
  } as Record<keyof IEnvironmentVariables, Joi.AnySchema>)
    .unknown()
    .validateAsync(process.env);
}

export const env: IEnvironmentVariables = {
  JWT_SECRET: process.env.JWT_SECRET!,
};
