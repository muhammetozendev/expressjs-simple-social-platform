import { ForbiddenException } from '../../common/exceptions/forbidden.exception';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { IActiveUser } from '../auth/types/active-user.interface';
import { MailingServiceEnum } from '../mail/mailing-service.enum';
import { MailingServiceFactory } from '../mail/mailing-service.factory';
import { PostService } from '../post/post.service';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private postService: PostService,
    private mailingServiceFactory: MailingServiceFactory
  ) {}

  async getCommentById(id: number) {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async getCommentsByPostId(postId: number, limit: number, page: number) {
    const post = await this.postService.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.commentRepository.findWithPagination(+limit, +page, {
      where: { post: { id: postId } },
    });
  }

  async createComment(data: CreateCommentDto, user: IActiveUser) {
    const post = await this.postService.getPostWithUser(data.postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.commentRepository.save({
      content: data.content,
      post: { id: data.postId },
      user: { id: user.id },
    });

    // Get the mailing service
    const mailingService = this.mailingServiceFactory.getMailingService(
      MailingServiceEnum.SENDGRID
    );

    // Send mail
    await mailingService.sendMail({
      to: post.user.email, // Post owner email
      subject: `New comment from ${user.name}`,
      template: `
        <h1>New comment</h1>
        <p>${user.name} commented on your post</p>
        <p>Post title: ${post.title}</p>
        <p>Comment content: ${comment.content}</p>
      `,
    });

    return comment;
  }

  async updateComment(id: number, data: UpdateCommentDto, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }
    await this.commentRepository.update(id, data);
  }

  async deleteComment(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }
    await this.commentRepository.delete(id);
  }
}
