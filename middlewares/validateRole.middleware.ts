import { Request, Response, NextFunction } from "express";
import * as userService from "../services/users/users.service";
import createHttpError from "http-errors";
const validateRole =
    (role: "admin" | "user") =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = req.user.id;
                const user = await userService.getUserById(userId);
                if (!user) {
                    return res.status(404).send(createHttpError.NotFound("User not found"));
                }
                if (!user.role.includes(role)) {
                    return res.status(403).send(createHttpError.Forbidden("Access denied"));
                }
                next();
            } catch (e: any) {
                return res.status(400).send(e.errors);
            }
        };

export default validateRole;
