import { DataSource } from "typeorm"
import { ormConfig } from "../config/ormConfig"

const dataSource = new DataSource(ormConfig)

export const connectDB = async () => {
    try {
        await dataSource.initialize()
        console.debug("Database connection established")
    }
    catch (error) {
        console.error("Error connecting to database", error)
        throw error
    }
}

export const disconnectDB = async () => {
    try {
        await dataSource.destroy()
        console.debug("Database connection closed")
    }
    catch (error) {
        console.error("Error closing database connection", error)
        throw error
    }
}

export default dataSource