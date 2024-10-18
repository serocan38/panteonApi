import express from 'express';
import routes from './routes/index';
import { connectDB, disconnectDB } from './core/database/database';
import { requestLoggerMiddleware } from './core/middleware/requestLoggerMiddleware';
import { connectRedis } from './core/database/redis/redisClient';

const app = express();

const startServer = async () => {
    console.debug("Server is starting...")

    await connectDB();
    await connectRedis();


    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLoggerMiddleware);

    app.use('/api', routes);

    console.debug("Server is started...");
    return app
}

const stopServer = async () => {
    console.debug("Server is stopping...");
    await disconnectDB();
    console.debug("Server is stopped...");
}

export default {
    startServer,
    stopServer
}