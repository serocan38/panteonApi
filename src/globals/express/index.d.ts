import { Logger } from "winston"
import { AuthenticationPayload } from "../../lib/globals"

declare global {
    namespace Express {
        export interface Request {
            logger: Logger;
            customValidationResult?: any;
        }
    }
}