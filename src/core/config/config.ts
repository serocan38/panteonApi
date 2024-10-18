import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        migration: boolean;
        sync: boolean;
    };
    redis: {
        host: string;
        port: number;
    }
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key]
    if (!value && !defaultValue) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value || defaultValue!
}

const config: Config = {
    port: parseInt(getEnvVar("PORT", "3000")),
    nodeEnv: getEnvVar("NODE_ENV"),
    database: {
        host: getEnvVar("DB_HOST", "localhost"),
        port: parseInt(getEnvVar("DB_PORT", "3306"), 10),
        username: getEnvVar("DB_USER", "user"),
        password: getEnvVar("DB_PASSWORD", "password"),
        database: getEnvVar("DB_DB", "database"),
        migration: getEnvVar("DB_MIGRATION") === "true",
        sync: getEnvVar("DB_SYNC") === "true"
    },
    redis: {
        host: getEnvVar("REDIS_HOST", "localhost"),
        port: parseInt(getEnvVar("REDIS_PORT", "6379"), 10),
    }
};

export default config;
