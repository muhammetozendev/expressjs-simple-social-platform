import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { PostService } from '../post/post.service';
import { UserRepository } from './user.repository';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postService: PostService
  ) {}

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async deactivate(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return await this.userRepository.update(user.id, {
      isActive: false,
    });
  }

  async activate(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    await this.userRepository.update(user.id, {
      isActive: true,
    });
  }

  async viewUser(id: number) {
    return await this.userRepository.findOne({
      where: { id, isActive: true },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
      },
    });
  }

  async viewUserPosts(userId: number, limit: number, page: number) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.postService.getPostsByUserId(userId, +limit, +page);
  }
}
