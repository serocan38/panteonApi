import { client } from './redisClient';

class RedisService {
    async set(key: string, value: any): Promise<void> {
        try {
            await client.set(key, JSON.stringify(value));
            console.log(`Key set: ${key} -> ${JSON.stringify(value)}`);
        } catch (error) {
            console.error(`Error setting key ${key}:`, error);
        }
    }

    async get(key: string): Promise<any | null> {
        try {
            const value = await client.get(key);
            console.log(`Key fetched: ${key} -> ${value}`);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error getting key ${key}:`, error);
            return null;
        }
    }

    async del(key: string): Promise<void> {
        try {
            await client.del(key);
            console.log(`Key deleted: ${key}`);
        } catch (error) {
            console.error(`Error deleting key ${key}:`, error);
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const exists = await client.exists(key);
            console.log(`Key exists: ${key} -> ${exists}`);
            return exists === 1;
        } catch (error) {
            console.error(`Error checking existence of key ${key}:`, error);
            return false;
        }
    }

    async flushAll(): Promise<void> {
        try {
            await client.flushAll();
            console.log('All keys deleted from Redis');
        } catch (error) {
            console.error('Error flushing all keys from Redis:', error);
        }
    }
}

export default new RedisService();
