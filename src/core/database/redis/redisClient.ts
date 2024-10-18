import { createClient } from 'redis';
import config from '../../config/config';

const { host, port } = config.redis
const client = createClient({
    url: `redis://${host}:${port}`,
});

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

const connectRedis = async () => {
    try {
        await client.connect();
        console.log('Redis connected');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

export { client, connectRedis };
