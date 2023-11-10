import { AbstractRepository } from '../../config/database';
import { Post } from '../../config/database/entities/post.entity';

export class PostRepository extends AbstractRepository<Post> {
  constructor() {
    super(Post);
  }
}
