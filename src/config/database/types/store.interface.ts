import { EntityManager } from 'typeorm';

export interface IStore {
  entityManager?: EntityManager;
}
