import { Type } from './common/types/type.interface';
import { AuthService } from './modules/auth/auth.service';
import { CommentRepository } from './modules/comment/comment.repository';
import { CommentService } from './modules/comment/comment.service';
import { MailingServiceFactory } from './modules/mail/mailing-service.factory';
import { MailgunService } from './modules/mail/mailing-services/mailgun-service';
import { SendgridService } from './modules/mail/mailing-services/sendgrid-service';
import { PostRepository } from './modules/post/post.repository';
import { PostService } from './modules/post/post.service';
import { UserRepository } from './modules/user/user.repository';
import { UserService } from './modules/user/user.service';

/**
 * Dependency injection container
 *
 * Normally I would use a framework that already supports dependency injection like NestJS.
 * However, as this project must be implemented without using such frameworks, I implemented
 * a simple DI container here.
 *
 * The reason we are using a DI container is to make testing easier, to apply
 * inversion of control principle, and to maintain singleton providers.
 */
export class DIContainer {
  private static container = new Map();

  /** Register an object in the DI container */
  public static register<T>(ref: Type<T> | string, instance: T) {
    this.container.set(ref, instance);
  }

  /** Resolve a dependency */
  public static resolve(ref: string): any;
  public static resolve<T>(ref: Type<T>): T;
  public static resolve<T>(ref: Type<T> | string): T {
    const instance = this.container.get(ref);
    if (!instance) {
      const refName = typeof ref === 'string' ? ref : ref.name;
      throw new Error(`No provider for type ${refName}`);
    }
    return instance;
  }
}

// Repositories
const userRepository = new UserRepository();
DIContainer.register(UserRepository, userRepository);
const postRepository = new PostRepository();
DIContainer.register(PostRepository, postRepository);
const commentRepository = new CommentRepository();
DIContainer.register(CommentRepository, commentRepository);

// Auth service
const authService = new AuthService(userRepository);
DIContainer.register(AuthService, authService);

// Post service
const postService = new PostService(postRepository);
DIContainer.register(PostService, postService);

// User service
const userService = new UserService(
  userRepository,
  DIContainer.resolve(PostService)
);
DIContainer.register(UserService, userService);

// Mailing services
const mailgunService = new MailgunService();
DIContainer.register(MailgunService, mailgunService);
const sendgridService = new SendgridService();
DIContainer.register(SendgridService, sendgridService);
const mailingServiceFactory = new MailingServiceFactory(
  mailgunService,
  sendgridService
);
DIContainer.register(MailingServiceFactory, mailingServiceFactory);

// Comment service
const commentService = new CommentService(
  commentRepository,
  postService,
  mailingServiceFactory
);
DIContainer.register(CommentService, commentService);
