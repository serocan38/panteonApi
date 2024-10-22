import { DataSource } from "typeorm";
import { ormConfig } from "../config/ormConfig";

class DatabaseManager {
    private dataSource: DataSource;

    constructor() {
        this.dataSource = new DataSource(ormConfig);
    }

    public async connect(): Promise<void> {
        try {
            await this.dataSource.initialize();
            console.debug("Database connection established");
        } catch (error) {
            console.error("Error connecting to database", error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.dataSource.destroy();
            console.debug("Database connection closed");
        } catch (error) {
            console.error("Error closing database connection", error);
            throw error;
        }
    }

    public async runQuery(query: string, parameters: any[] = []): Promise<any> {
        return this.dataSource.query(query, parameters);
    }

    public getDataSource(): DataSource {
        return this.dataSource;
    }
}

export const databaseManager = new DatabaseManager();
