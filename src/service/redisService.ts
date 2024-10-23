import { redisClient } from "../core/database/redis/redisClient";

export default class RedisService {
    public ALL_USERS_REDIS_KEY = "allUsers"
    public USER_KEY_PREFIX = "user:"

    async getKeys(pattern: string): Promise<string[]> {
        const keys = await redisClient.keys(pattern);
        return keys;
    }

    async getRank(value: string) {
        return await redisClient.zRevRank(this.ALL_USERS_REDIS_KEY, value,);
    }

    async getUserIds(value: string) {
        return await redisClient.zRangeWithScores(this.ALL_USERS_REDIS_KEY, 0, 99);
    }

    async getUserByRank(rank: number) {
        const result = await redisClient.zRangeWithScores(this.ALL_USERS_REDIS_KEY, rank, rank, { REV: true });
        return result[0];
    }

    async getTotalScoreFromLeaderboard(): Promise<number> {
        const allUsersWithScores = await redisClient.zRangeWithScores(this.ALL_USERS_REDIS_KEY, 0, -1);
        return allUsersWithScores.reduce((sum, user) => sum + Number(user.score), 0);
    }
}