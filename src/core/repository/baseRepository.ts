import { EntityTarget, FindOptionsWhere, In, Repository } from "typeorm"
import BaseEntityModel from "../model/baseEntity"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { databaseManager } from "../database/databaseManager";
import { STATUS } from "../enum/baseEnum";

type SelectOption = {
    select?: string[],
    where?: any,
    relations?: any
}

export default abstract class BaseRepository<T extends BaseEntityModel> {
    protected repository: Repository<T>
    private dataSource = databaseManager.getDataSource();

    constructor() {
        this.repository = this.dataSource.getRepository<T>(this.getEntity())
    }

    protected abstract getEntity(): EntityTarget<T>

    async create(entity: T): Promise<T> {
        return this.repository.save(entity)
    }

    async update(entity: T): Promise<T> {
        return this.repository.save(entity)
    }

    async delete(entity: T): Promise<T> {
        return this.repository.softRemove(entity)
    }

    async recover(entity: T): Promise<T> {
        return this.repository.recover(entity)
    }

    async find(
        conditions: FindOptionsWhere<T> = {},
        orderBy: 'ASC' | 'DESC' = "ASC",
    ): Promise<T[]> {
        return await this.repository.createQueryBuilder('entity')
            .where(conditions)
            .orderBy(orderBy)
            .getMany();
    }

    public async select(selectedColumns?: string[], expression?: any, relations?: any, isActive = false, isMultiple = false): Promise<T[] | T | null> {
        const options: SelectOption = {};
        if (relations)
            options.relations = relations
        if (selectedColumns)
            options.select = selectedColumns;
        if (expression)
            options.where = expression;

        if (isActive) {
            if (options.where) {
                options.where.status = STATUS.ACTIVE;
            } else {
                options.where = { status: STATUS.ACTIVE };
            }
        }

        try {
            if (isMultiple) {
                return await this.repository.find(options as any);
            }
            return await this.repository.findOne(options as any);
        } catch (error: any) {
            console.error(". Entity name is \"" + String((this.getEntity() as any).name) + "\"", error.message, error.stack);
            return null;
        }
    }

    public async selectEntity(selectedColumns?: string[], expression?: any, relations?: any, isActive = false): Promise<T[]> {
        return (await this.select(selectedColumns, expression, relations, isActive, true)) as T[];
    }

    public async selectOne(selectedColumns?: string[], expression?: any, relations?: any, isActive = false): Promise<T> {
        return (await this.select(selectedColumns, expression, relations, isActive, false)) as T;
    }

    public async selectById(key: number, selectedColumns?: string[], isActive?: boolean) {
        return await this.selectOne(selectedColumns, { id: key }, undefined, isActive);
    }

    public async selectActive(selectedColumns: string[], expression: any, relations?: any) {
        expression = expression ?? {}
        expression.status = STATUS.ACTIVE;
        return await this.selectEntity(selectedColumns, expression, relations);
    }


    //BULK

    async bulkInsert(entities: QueryDeepPartialEntity<T>[]): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .insert()
            .into(this.getEntity())
            .values(entities)
            .execute();
    }

    async bulkUpdate(ids: bigint[], updateFields: QueryDeepPartialEntity<T>): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update(this.getEntity())
            .set(updateFields)
            .whereInIds(ids)
            .execute();
    }

    async bulkUpdateInBatches(ids: bigint[], updateFields: QueryDeepPartialEntity<T>, batchSize = 1000): Promise<void> {
        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize);
            await this.repository
                .createQueryBuilder()
                .update(this.getEntity())
                .set(updateFields)
                .whereInIds(batch)
                .execute();
        }
    }

    async bulkDelete(ids: bigint[]): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .delete()
            .from(this.getEntity())
            .whereInIds(ids)
            .execute();
    }

    async bulkDeleteByIds(ids: bigint[]): Promise<void> {
        await this.repository.createQueryBuilder()
            .softDelete()
            .from(this.getEntity())
            .where("id IN (:...ids)", { ids })
            .execute();
    }

    async bulkRecover(entities: T[]): Promise<void> {
        const ids = entities.map(entity => entity.id);
        await this.repository.createQueryBuilder()
            .restore()
            .from(this.getEntity())
            .where("id IN (:...ids)", { ids })
            .execute();
    }


    // Run SQL query
    async runQuery(query: string, parameters: any[] = []): Promise<any> {
        return this.dataSource.query(query, parameters);
    }

}