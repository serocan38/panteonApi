import { redisClient } from "../core/database/redis/redisClient";
import { Transaction } from "../entity/transaction";
import { User } from "../entity/user";
import { RedisModel, UserModel } from "../model/userModel";
import TransactionRepository from "../repositoy/transactionRepository";
import UserRepository from "../repositoy/userRepository";
import RedisService from "./redisService";

export default class LeaderboardService {
    private userRepository: UserRepository;
    private redisService = new RedisService()

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async getPlayerRankingAndNeighbors(userId: string) {
        try {
            const rank = await this.redisService.getRank(userId);
            if (!rank) {
                console.log("User not found")
                return;
            }
            const neighbors = await redisClient.zRangeWithScores(this.redisService.ALL_USERS_REDIS_KEY, rank - 3, rank + 2, { REV: true, });
            neighbors.forEach((neighbor: RedisModel, index) => {
                neighbor.rank = rank - 3 + index;
            });
            return neighbors as RedisModel[];
        } catch (error) {
            console.error('getPlayerRankingAndNeighbors ERROR:', error);
        }
    }

    async getTop100Users(): Promise<UserModel[]> {
        try {
            const userKeys = await this.redisService.getKeys(`${this.redisService.USER_KEY_PREFIX}*`);

            const userDataPromises = userKeys.map(key => redisClient.hGetAll(key));
            const usersData = await Promise.all(userDataPromises);

            const sortedUsers: UserModel[] = usersData
                .sort((a, b) => Number(b.score) - Number(a.score))
                .map((user, index) => ({
                    id: user.id,
                    username: user.username,
                    score: Number(user.score),
                    countryName: user.countryName,
                    rank: index + 1
                } as UserModel));

            return sortedUsers;
        } catch (error: any) {
            console.error("getTop100Users ERROR: " + error.message + "\nSTACK: " + error.stack)
            return []
        }
    }

    async setAllUsersScores(): Promise<void> {
        try {
            const users = await this.userRepository.getAllUsers();

            const multi = redisClient.multi();
            users.forEach(user => {
                const score = user.score;
                const value = user.id.toString();
                multi.zAdd(this.redisService.ALL_USERS_REDIS_KEY, { score, value });
            });

            await multi.exec();
            console.log('Redis user rankings updated successfully.');
        } catch (error: any) {
            console.error("Redis setUserScores ERROR: " + error.message)
        }
    }

    async updateLeaderboardUsers(): Promise<void> {
        try {
            const multi = redisClient.multi();
            const topUsers = await redisClient.zRangeWithScores(this.redisService.ALL_USERS_REDIS_KEY, 0, 99, { REV: true, });

            const userIds = topUsers.map(user => BigInt(user.value));
            const allUserInfos = await this.userRepository.getUsersByIds(userIds);

            topUsers.forEach((user, index) => {
                const { value, score } = user;
                const userInfo = allUserInfos.find(info => info.id.toString() === value);

                if (userInfo) {
                    const key = `user:${index}`;
                    const { username, country, id, balance } = userInfo;

                    multi.hSet(key, {
                        id: id.toString(),
                        username,
                        score: score,
                        countryName: country ? country.title : "",
                    });
                }
            });

            await multi.exec();
            console.log('Top users updated successfully.');
        } catch (error: any) {
            console.error("Redis updateTopUsers ERROR: " + error.message)
        }
    }

    async distributeRewards(topUsers: UserModel[]) {
        try {
            const transactionRepository = new TransactionRepository();
            const totalScore = await this.redisService.getTotalScoreFromLeaderboard();
            const totalRewards = totalScore * 0.02

            const firstPrice = totalRewards * 0.20;
            const secondPrice = totalRewards * 0.15;
            const thirdPrice = totalRewards * 0.10;

            const remainingReward = totalRewards - (firstPrice + secondPrice + thirdPrice);

            const pricePerRemainingUser = Math.trunc(remainingReward / 97);

            const transactions = topUsers.map((user, index) => {
                let price = 0;

                if (index === 0) {
                    price = firstPrice;
                } else if (index === 1) {
                    price = secondPrice;
                } else if (index === 2) {
                    price = thirdPrice;
                } else if (index < 100) {
                    price = pricePerRemainingUser;
                }

                const transaction = new Transaction();
                transaction.user = { id: BigInt(user.id) } as User
                transaction.value = price

                return transaction;
            });

            await transactionRepository.bulkInsert(transactions)
        } catch (error: any) {
            console.error("distributeRewards ERROR: " + error.message + "\nSTACK: " + error.stack)
            return []
        }
    }
}