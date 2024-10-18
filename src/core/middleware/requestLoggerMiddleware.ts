import morgan from "morgan"
import json from "morgan-json"
import { NextFunction, Request, Response } from "express"

const logFormat = json({
    method: ":method",
    remoteAddr: ":remote-addr",
    forwardedFor: ":req[x-forwarded-for]",
    url: ":url",
    status: ":status",
    userAgent: ":user-agent",
    reqContentLength: ":req[content-length]",
    resContentLength: ":res[content-length]",
    responseTime: ":response-time"
})
export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    return morgan(logFormat)(req, res, next)
}