import { Request, Response } from "express";
import logger from "../../logger";
import createHttpError from "http-errors";
import { getUserById, updateUser } from "../../services/users/users.service";

export const userDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);
        res.send(user);
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        // @ts-ignore
        await updateUser(id, { role });
        res.send({ message: "User role updated successfully" });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}