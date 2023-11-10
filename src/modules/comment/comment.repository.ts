import { AbstractRepository } from '../../config/database';
import { Comment } from '../../config/database/entities/comment.entity';

export class CommentRepository extends AbstractRepository<Comment> {
  constructor() {
    super(Comment);
  }
}
