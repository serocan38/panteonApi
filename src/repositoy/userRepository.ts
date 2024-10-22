import { In } from "typeorm";
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

    async getAllUsers(): Promise<UserModel[]> {
        return await databaseManager.runQuery(GET_ALL_USERS);
    }
}