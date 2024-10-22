import { DataSourceOptions } from "typeorm";
import config from "./config";

const { host, port, username, password, database, sync, migration } = config.database

export const ormConfig: DataSourceOptions = {
    type: "mysql",
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    synchronize: sync,
    migrationsRun: migration,
    logging: false,
    extra: {
        "charset": "utf8mb4",
        "collation": "utf8mb4_unicode_ci"
    },
    entities: ["src/entity/*.ts"],
};
