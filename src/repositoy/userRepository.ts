import { In, Like } from "typeorm";
import BaseRepository from "../core/repository/baseRepository"
import { User } from "../entity/user"
import { databaseManager } from "../core/database/databaseManager";
import { GET_ALL_USERS } from "../constants/queryConstants";
import { UserModel } from "../model/userModel";

export default class UserRepository extends BaseRepository<User> {
    protected getEntity() {
        return User
    }

    async getUsersByIds(userIds: BigInt[]): Promise<User[]> {
        return await this.selectEntity(['id', 'username', 'country.title'], [{ id: In(userIds) }], ['country', 'balance'], true)
    }

    async getUserById(id: BigInt): Promise<User> {
        return await this.selectOne(['id', 'username', 'country.title'], [{ id }], ['country', 'balance'], true)
    }

    async getAllUsers(): Promise<UserModel[]> {
        return await databaseManager.runQuery(GET_ALL_USERS);
    }

    async searchUsers(searchTerm: string): Promise<UserModel[]> {
        const expression = { username: Like(`%${searchTerm}%`) }
        const users = await this.selectEntity(['id', 'username'], expression, ['country', "balance"]);
        const userModels = users.map(i => {
            return { id: i.id.toString(), username: i.username, score: i.balance.weeklyBalance, countryName: i.country?.title } as UserModel
        })
        return userModels
    }
}