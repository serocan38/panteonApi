import { redisClient } from "../core/database/redis/redisClient";
import { Transaction } from "../entity/transaction";
import { UserModel } from "../model/userModel";
import TransactionRepository from "../repositoy/transactionRepository";

export default class RedisService {
    public ALL_USERS_REDIS_KEY = "allUsers"
    public USER_KEY_PREFIX = "user:"

    async getKeys(pattern: string): Promise<string[]> {
        const keys = await redisClient.keys(pattern);
        return keys;
    }

    async getRank(value: string) {
        return await redisClient.zRank(this.ALL_USERS_REDIS_KEY, value);
    }

    async getUserIds(value: string) {
        return await redisClient.zRangeWithScores(this.ALL_USERS_REDIS_KEY, 0, 99);
    }

    async getTotalScoreFromLeaderboard(): Promise<number> {
        const allUsersWithScores = await redisClient.zRangeWithScores(this.ALL_USERS_REDIS_KEY, 0, -1);
        return allUsersWithScores.reduce((sum, user) => sum + Number(user.score), 0);
    }
}