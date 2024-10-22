import { Request, Response, Router } from 'express';
import LeaderboardController from '../controller/leaderboardController';

const router = Router();
const leaderboardController = new LeaderboardController()

router.get('/getLeadership/:id?', leaderboardController.getLeaderboardWithSpesificUser);

export default router;
