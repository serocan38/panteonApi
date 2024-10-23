import { Request, Response, Router } from 'express';
import LeaderboardController from '../controller/leaderboardController';
import UserController from '../controller/userController';

const router = Router();
const leaderboardController = new LeaderboardController()
const userController = new UserController()

router.get('/getLeaderboard/:id?', (req: Request, res: Response) => {
    leaderboardController.getLeaderboardWithSpesificUser(req, res)
});

router.get('/getLeaderboardUser/:id', (req: Request, res: Response) => {
    leaderboardController.getLeaderboardUser(req, res)
});

router.get('/autocomplete/:searchTerm', (req: Request, res: Response) => {
    userController.searchUsers(req, res)
});

export default router;
