import { createClient } from 'redis';
import config from '../../config/config';

const { host, port } = config.redis
const redisClient = createClient({
    url: `redis://${host}:${port}`,
});

redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

const multi = redisClient.multi()

export { redisClient, connectRedis, multi };