import express from 'express';
import routes from './routes/index';
import { requestLoggerMiddleware } from './core/middleware/requestLoggerMiddleware';
import { connectRedis } from './core/database/redis/redisClient';
import { databaseManager } from './core/database/databaseManager';
import JobService from './service/jobService';
import JobScheduler from './jobs/job';
import LeaderboardService from './service/leaderBoardService';
import UserRepository from './repositoy/userRepository';

const app = express();

const userRepository = new UserRepository();
const leaderboardService = new LeaderboardService(userRepository);
const jobService = new JobService(leaderboardService);
const jobScheduler = new JobScheduler(jobService);

const startServer = async () => {
    console.debug("Server is starting...");

    try {
        await databaseManager.connect();
        await connectRedis();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(requestLoggerMiddleware);

        app.use('/api', routes);

        jobScheduler.start();
        console.debug("Server is started...");
        return app;

    } catch (error) {
        console.error("Error during server startup:", error);
        process.exit(1);
    }
};

const stopServer = async () => {
    console.debug("Server is stopping...");
    try {
        await databaseManager.disconnect();
        console.debug("Server is stopped...");
    } catch (error) {
        console.error("Error during server shutdown:", error);
    }
};

export default {
    startServer,
    stopServer
};