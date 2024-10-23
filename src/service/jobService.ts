import TransactionRepository from "../repositoy/transactionRepository";
import LeaderboardService from "./leaderBoardService";

export default class JobService {
    private leaderboardService: LeaderboardService;

    constructor(leaderboardService: LeaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    async leadershipHandler() {
        await this.leaderboardService.setAllUsersScores()
        await this.leaderboardService.updateLeaderboardUsers()
    }

    async resetAndRewardUsers() {
        const transactionRepository = new TransactionRepository();

        const top100Users = await this.leaderboardService.getTop100Users()
        await this.leaderboardService.distributeRewards(top100Users);
        await transactionRepository.resetWeeklyBalance()
        await this.leadershipHandler();
    }
}