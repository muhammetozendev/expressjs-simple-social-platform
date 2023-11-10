import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { IPaginationResponse } from './pagination.interface';
import { asyncLocalStorage } from '../../../common/utils/db.utils';
import { dataSource } from '..';
import { Type } from '../../../common/types/type.interface';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

/** Type of id that can be used to find/update/delete a record */
export type IdType = string | number | string[] | number[];

/** Base repository that each repository class needs to implement */
export abstract class AbstractRepository<T extends ObjectLiteral> {
  constructor(private readonly entity: Type) {}

  /** Retrieve the typeorm repository. If there is an active transaction, the typeorm repository will wrap all queries within that transaction */
  protected getTypeOrmRepository() {
    return (asyncLocalStorage
      .getStore()
      ?.entityManager?.getRepository(this.entity) ??
      dataSource.getRepository(this.entity)) as Repository<T>;
  }

  /** Find many records with given options */
  async find(optinos: FindManyOptions<T>): Promise<T[]> {
    return await this.getTypeOrmRepository().find(optinos);
  }

  /** Find many records with given options using pagination */
  async findWithPagination(
    limit: number,
    page: number,
    options?: FindManyOptions<T>
  ): Promise<IPaginationResponse<T>> {
    const [data, total] = await this.getTypeOrmRepository().findAndCount({
      ...options,
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      count: total,
      pageCount: Math.ceil(total / limit),
      currentPage: page,
      limit,
      data,
    };
  }

  /** Find one record with given id or options */
  async findOne(criteria: FindOneOptions<T>): Promise<T | null> {
    return await this.getTypeOrmRepository().findOne(criteria);
  }

  /** Save a record. Create if it does not exists, update if it already exists in database */
  save(data: DeepPartial<T>): Promise<T>;
  save(data: DeepPartial<T[]>): Promise<T[]>;
  async save(data: DeepPartial<T | T[]>): Promise<T | T[]> {
    if (data instanceof Array) {
      return (await this.getTypeOrmRepository().save(data)) as T[];
    } else {
      return (await this.getTypeOrmRepository().save(data)) as T;
    }
  }

  /** Update a record with given id or options */
  async update(
    criteria: IdType | FindOptionsWhere<T>,
    data: DeepPartial<T>
  ): Promise<void> {
    await this.getTypeOrmRepository().update(criteria, data);
  }

  /** Upsert a record with given id or options */
  async upsert(
    data: DeepPartial<T>,
    conflictPaths: UpsertOptions<T>
  ): Promise<void> {
    await this.getTypeOrmRepository().upsert(data, conflictPaths);
  }

  /** Delete a record with given id or options */
  async delete(criteria: IdType | FindOptionsWhere<T>): Promise<void> {
    await this.getTypeOrmRepository().delete(criteria);
  }
}
