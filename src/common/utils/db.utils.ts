import { Type } from '../types/type.interface';
import { AsyncLocalStorage } from 'async_hooks';
import { IStore } from '../../config/database/types/store.interface';
import { DIContainer } from '../../di-container';

export function getRepositoryInjectionToken(entity: Type) {
  return `${entity.name}_Repository`;
}

export function getRepository<T>(entity: Type<T>): T {
  return DIContainer.resolve(getRepositoryInjectionToken(entity));
}

export const asyncLocalStorage = new AsyncLocalStorage<IStore>();
