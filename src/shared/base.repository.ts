import { HttpStatus } from '@nestjs/common';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ExceptionCustom } from './exception/custom.exception';

export abstract class BaseRepository<T extends AbstractEntity> {
    constructor(private readonly genericRepository: Repository<T>) {}

    get repoInstance() {
        return this.genericRepository;
    }

    async save(entity: T): Promise<T> {
        try {
            const entityCreate = await this.genericRepository.save(entity);

            return entityCreate;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async saveAll(entity: T[]): Promise<T[]> {
        try {
            const entityCreate = await this.genericRepository.save(entity);
            return entityCreate;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async update(id: number | string, entity: T | any): Promise<T | null> {
        try {
            await this.genericRepository.update(id, entity as any);
            return entity || null;
        } catch (error: any) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async delete(id: number | string | string[] | number[]): Promise<boolean> {
        try {
            await this.genericRepository.delete(id);
            return true;
        } catch (error: any) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async getById(id: number | string): Promise<T | null> {
        try {
            const criteria = { where: { id } as unknown as FindOptionsWhere<T> };
            const entityById = await this.genericRepository.findOne(criteria);
            return entityById;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async getManyById(ids: string[] | number[]): Promise<T[]> {
        try {
            const criteria = { where: { id: In(ids as unknown as any) } as unknown as FindOptionsWhere<T> };
            const entityGetMany = await this.genericRepository.find(criteria);

            return entityGetMany;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
