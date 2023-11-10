import { ForbiddenException } from '../../common/exceptions/forbidden.exception';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';

export class PostService {
  constructor(private postRepository: PostRepository) {}

  async getPostById(id: number) {
    return await this.postRepository.findOne({ where: { id } });
  }

  async getPostsByUserId(userId: number, limit: number, page: number) {
    return await this.postRepository.findWithPagination(+limit, +page, {
      where: { user: { id: userId } },
    });
  }

  async getPosts(limit: number, page: number) {
    return await this.postRepository.findWithPagination(+limit, +page);
  }

  async getPostWithUser(postId: number) {
    return await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: { user: true },
    });
  }

  async createPost(data: CreatePostDto, userId: number) {
    return await this.postRepository.save({
      content: data.content,
      title: data.title,
      user: { id: userId },
    });
  }

  async updatePost(id: number, data: UpdatePostDto, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user.id !== userId) {
      throw new ForbiddenException('You are not the owner of this post');
    }
    await this.postRepository.update(id, data);
  }

  async deletePost(id: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user.id !== userId) {
      throw new ForbiddenException('You are not the owner of this post');
    }
    await this.postRepository.delete(id);
  }
}
