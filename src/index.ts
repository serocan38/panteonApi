import config from './core/config/config';
import { getTimeDiffNow } from './core/utils/timeUtils';
import server from "./app"

const { port, nodeEnv } = config;
const startTime = Date.now()

export const startApplication = async () => {
    console.debug(`[${nodeEnv}] Application is starting...`)
    const app = await server.startServer()

    app.listen(port, () => {
        const executionTime = getTimeDiffNow(startTime)
        console.log(`Server is running on http://localhost:${port} - NODE_ENV: "${nodeEnv}"`);
        console.debug("It took " + String(executionTime) + "s to launch the app.")
    })
    console.debug(`[${nodeEnv}] Application started...`)
    return app
}

void startApplication()