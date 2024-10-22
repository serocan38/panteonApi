import { Response } from 'express';

class ResponseHelper {
    static sendSuccess(res: Response, message: string, data: any): Response {
        return res.status(200).json({ message, data });
    }

    static sendError(res: Response, message: string): Response {
        return res.status(500).json({ message });
    }
}

export default ResponseHelper;
