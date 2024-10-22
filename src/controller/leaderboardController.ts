import { Request, Response } from 'express';
import LeaderboardService from '../service/leaderBoardService';
import UserRepository from '../repositoy/userRepository';
import { UserModel } from '../model/userModel';
import ResponseHelper from '../core/helper/responseHelper';

class LeaderboardController {
    private leaderboardService: LeaderboardService;
    private userRepository = new UserRepository
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
                            return {
                                id: i.id.toString(),
                                username: i.username,
                                countryName: i.country?.title,
                                score: i.balance?.weeklyBalance
                            } as UserModel
                        }).sort((a, b) => b.score - a.score)
                        users = users.concat(neighborUserModelList);
                    }
                }
            }
            ResponseHelper.sendSuccess(res, 'success', users);
        } catch (error) {
            console.error(error);
            ResponseHelper.sendError(res, 'error');
        }
    };
}

export default LeaderboardController;
