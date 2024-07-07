import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const signJwtToken = (payload: any, expiresIn = "10d") => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn
    });
};