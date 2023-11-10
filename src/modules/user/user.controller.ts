import { Router } from 'express';
import { routeHandler } from '../../common/utils/route-handler';
import { ACTIVE_USER, isAuth } from '../../middleware/is-auth.middleware';
import { UserService } from './user.service';
import { IActiveUser } from '../auth/types/active-user.interface';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { validationMiddlware } from '../../middleware/validation.middleware';
import { PaginationDto } from '../../common/dto/pagination.dto';

export function registerUserRoutes(userService: UserService) {
  const router = Router();

  // Get the profile information of the active user
  router.get(
    '/profile',
    isAuth,
    routeHandler(async (req, res) => {
      // Get the active user payload and pass the id into the serivce method
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      const user = await userService.getUserById(activeUser.id);

      // Map to user response dto to exclude password
      const mappedUser = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
      res.status(200).json(mappedUser);
    })
  );

  // View user. This is not a protected route
  router.get(
    '/:id',
    routeHandler(async (req, res) => {
      const id = req.params.id as string;
      const user = await userService.viewUser(+id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      res.status(200).json(user);
    })
  );

  router.get(
    '/:id/posts',
    validationMiddlware({
      query: PaginationDto,
    }),
    routeHandler(async (req, res) => {
      // Extract id, limit and page
      const id = req.params.id as string;
      const { limit, page } = req.query as PaginationDto;

      // Get the posts of the user
      const posts = await userService.viewUserPosts(+id, +limit, +page);
      res.status(200).json(posts);
    })
  );

  // Deactive the account
  router.post(
    '/deactivate',
    isAuth,
    routeHandler(async (req, res) => {
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      await userService.deactivate(activeUser.id);
      res.status(200).json({ message: 'User deactivated' });
    })
  );

  // Activate the account
  router.post(
    '/activate',
    isAuth,
    routeHandler(async (req, res) => {
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      await userService.activate(activeUser.id);
      res.status(200).json({ message: 'User activated' });
    })
  );

  return router;
}
