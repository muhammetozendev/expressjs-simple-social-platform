import { Router } from 'express';
import { routeHandler } from '../../common/utils/route-handler';
import { CommentService } from './comment.service';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { validationMiddlware } from '../../middleware/validation.middleware';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ACTIVE_USER, isAuth } from '../../middleware/is-auth.middleware';
import { IActiveUser } from '../auth/types/active-user.interface';
import { UpdateCommentDto } from './dto/update-comment.dto';

export function registerCommentRoutes(commentService: CommentService) {
  const router = Router();

  router.get(
    '/:id',
    routeHandler(async (req, res) => {
      const id = req.params.id as string;
      const comment = await commentService.getCommentById(+id);
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      res.status(200).json(comment);
    })
  );

  router.post(
    '/',
    isAuth,
    validationMiddlware({
      body: CreateCommentDto,
    }),
    routeHandler(async (req, res) => {
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      const comment = await commentService.createComment(req.body, activeUser);
      res.status(201).json(comment);
    })
  );

  router.patch(
    '/:id',
    isAuth,
    validationMiddlware({
      body: UpdateCommentDto,
    }),
    routeHandler(async (req, res) => {
      const id = req.params.id as string;
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      await commentService.updateComment(+id, req.body, activeUser.id);
      res.status(204).send();
    })
  );

  router.delete(
    '/:id',
    isAuth,
    routeHandler(async (req, res) => {
      const id = req.params.id as string;
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      await commentService.deleteComment(+id, activeUser.id);
      res.status(204).send();
    })
  );

  return router;
}
