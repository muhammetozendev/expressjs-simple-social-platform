import { Router } from 'express';
import { routeHandler } from '../../common/utils/route-handler';
import { PostService } from './post.service';
import { validationMiddlware } from '../../middleware/validation.middleware';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { ACTIVE_USER, isAuth } from '../../middleware/is-auth.middleware';
import { CreatePostDto } from './dto/create-post.dto';
import { IActiveUser } from '../auth/types/active-user.interface';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentService } from '../comment/comment.service';

export function registerPostRoutes(
  postService: PostService,
  commentService: CommentService
) {
  const router = Router();

  router.get(
    '/',
    validationMiddlware({
      query: PaginationDto,
    }),
    routeHandler(async (req, res) => {
      const { limit, page } = req.query as PaginationDto;
      const posts = await postService.getPosts(+limit, +page);
      res.status(200).json(posts);
    })
  );

  router.get(
    '/:id',
    routeHandler(async (req, res) => {
      const id = req.params.id as string;
      const post = await postService.getPostById(+id);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      res.status(200).json(post);
    })
  );

  router.get(
    '/:id/comments',
    validationMiddlware({
      query: PaginationDto,
    }),
    routeHandler(async (req, res) => {
      const id = req.params.id as string;
      const { limit, page } = req.query as PaginationDto;
      const comments = await commentService.getCommentsByPostId(
        +id,
        +limit,
        +page
      );
      res.status(200).json(comments);
    })
  );

  router.post(
    '/',
    isAuth,
    validationMiddlware({
      body: CreatePostDto,
    }),
    routeHandler(async (req, res) => {
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      const post = await postService.createPost(req.body, activeUser.id);
      res.status(201).json(post);
    })
  );

  router.patch(
    '/:id',
    isAuth,
    validationMiddlware({
      body: UpdatePostDto,
    }),
    routeHandler(async (req, res) => {
      const id = req.params.id as string;
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      await postService.updatePost(+id, req.body, activeUser.id);
      res.status(204).send();
    })
  );

  router.delete(
    '/:id',
    isAuth,
    routeHandler(async (req, res) => {
      const id = req.params.id as string;
      const activeUser = req[ACTIVE_USER] as IActiveUser;
      await postService.deletePost(+id, activeUser.id);
      res.status(204).send();
    })
  );

  return router;
}
