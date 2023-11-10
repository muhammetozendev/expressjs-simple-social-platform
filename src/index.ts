import express, { NextFunction } from 'express';
import { json } from 'body-parser';
import { validateEnv } from './config/env';
import { Req, Res } from './common/types/custom';
import { BaseException } from './common/exceptions/base.exception';

import { registerAuthRoutes } from './modules/auth/auth.controller';
import { DIContainer } from './di-container';
import { AuthService } from './modules/auth/auth.service';
import { registerUserRoutes } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { registerPostRoutes } from './modules/post/post.controller';
import { PostService } from './modules/post/post.service';
import { registerCommentRoutes } from './modules/comment/comment.controller';
import { CommentService } from './modules/comment/comment.service';

async function init() {
  // Validate environment variables
  validateEnv();

  const app = express();

  // Parse body
  app.use(json());

  // Register routes
  app.use('/auth', registerAuthRoutes(DIContainer.resolve(AuthService)));
  app.use('/users', registerUserRoutes(DIContainer.resolve(UserService)));
  app.use(
    '/posts',
    registerPostRoutes(
      DIContainer.resolve(PostService),
      DIContainer.resolve(CommentService)
    )
  );
  app.use(
    '/comments',
    registerCommentRoutes(DIContainer.resolve(CommentService))
  );

  // Register generic error handler
  app.use((err: any, req: Req, res: Res, next: NextFunction) => {
    if (err instanceof BaseException) {
      return res.status(err.statusCode).json(err.payload);
    } else {
      console.log(err);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  });

  // Start applicatoin on port 80
  app.listen(80);
}

init().catch((err) => {
  console.error('Failed to start the server');
  console.error(err);
});
