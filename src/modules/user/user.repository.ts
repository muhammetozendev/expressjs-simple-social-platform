import {
  FindOptions,
  FindOneOptions,
  DeepPartial,
  FindOptionsWhere,
  Document,
} from 'typeorm';
import {
  AbstractRepository,
  IPaginationResponse,
  IdType,
} from '../../config/database';
import { User } from '../../config/database/entities/user.entity';

export class UserRepository extends AbstractRepository<User> {
  constructor() {
    super(User);
  }
}
