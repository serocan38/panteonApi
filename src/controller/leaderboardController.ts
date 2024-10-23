import { Request, Response } from 'express';
import LeaderboardService from '../service/leaderBoardService';
import UserRepository from '../repositoy/userRepository';
import { UserModel } from '../model/userModel';
import ResponseHelper from '../core/helper/responseHelper';
import RedisService from '../service/redisService';

class LeaderboardController {
    private leaderboardService: LeaderboardService;
    private userRepository = new UserRepository
    private redisService = new RedisService()
    constructor() {
        this.leaderboardService = new LeaderboardService(this.userRepository);
    }

    public getLeaderboardWithSpesificUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            let users = await this.leaderboardService.getTop100Users();

            if (id) {
                const isUserInTop100 = users.some(i => i.id.toString() === id);
                if (!isUserInTop100) {
                    const neighborUsers = await this.leaderboardService.getPlayerRankingAndNeighbors(id)
                    if (neighborUsers) {
                        const ids = neighborUsers.map(i => BigInt(i.value));
                        const neighborUserList = await this.userRepository.getUsersByIds(ids);
                        const neighborUserModelList = neighborUserList.map(i => {
                            const idString = i.id.toString();
                            const neighborUser = neighborUsers.find(u => u.value === idString)
                            return {
                                id: idString,
                                username: i.username,
                                countryName: i.country?.title,
                                score: neighborUser?.score,
                                rank: neighborUser?.rank,
                            } as UserModel
                        }).sort((a, b) => b.score - a.score)
                        users = users.concat(neighborUserModelList);
                    }
                }
            }
            return ResponseHelper.sendSuccess(res, 'success', users);
        } catch (error: any) {
            console.error(error.message);
            return ResponseHelper.sendError(res, 'error');
        }
    };

    public getLeaderboardUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHelper.sendError(res, 'Missing Parameters');
            }
            const rank = await this.redisService.getRank(id);

            if (!rank) {
                return ResponseHelper.sendError(res, 'User not found');
            }

            const redisUser = await this.redisService.getUserByRank(rank);
            const dbUser = await this.userRepository.getUserById(BigInt(redisUser.value))
            const user: UserModel = {
                id: redisUser.value,
                score: redisUser.score,
                username: dbUser.username,
                countryName: dbUser.country?.title,
                rank
            }
            return ResponseHelper.sendSuccess(res, 'success', user);
        } catch (error: any) {
            console.error(error.message);
            return ResponseHelper.sendError(res, 'error');
        }
    };
}

export default LeaderboardController;
