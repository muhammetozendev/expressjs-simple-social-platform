import { Router } from 'express';
import { routeHandler } from '../../common/utils/route-handler';
import { validationMiddlware } from '../../middleware/validation.middleware';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

export function registerAuthRoutes(authService: AuthService) {
  const authRouter = Router();

  authRouter.post(
    '/login',
    validationMiddlware({
      body: LoginDto,
    }),
    routeHandler(async (req, res) => {
      const token = await authService.login(req.body);
      res.status(200).json(token);
    })
  );

  authRouter.post(
    '/register',
    validationMiddlware({
      body: RegisterDto,
    }),
    routeHandler(async (req, res) => {
      const user = await authService.register(req.body);

      // Map to user response dto to exclude password
      const userResponse = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });

      res.status(201).json(userResponse);
    })
  );

  return authRouter;
}
