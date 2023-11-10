import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Post, Comment],
  synchronize: true,
});

dataSource.initialize();

export * from './types';
