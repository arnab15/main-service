import { Request, Response, NextFunction } from "express";

import createError from "http-errors";
import JWT from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers["authorization"];
    const authToken = bearerToken?.split(" ")[1];
    if (!authToken) return res.status(401).send(createError.Unauthorized());
    if (authToken) {
        const tokenSecret = process.env.ACCESS_TOKEN_SECRET as string
        //@ts-ignore
        JWT.verify(authToken, tokenSecret, (err: any, payload: object) => {
            if (err) {
                const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                return res.status(401).send(createError.Unauthorized(message));
            }
            //@ts-ignore
            req.user = payload;
            next();
        });
        return;
    }
};
