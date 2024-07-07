import { Request, Response } from "express";
import logger from "../../logger";
import { LoginUserInput, UserSignUpInput } from "../../validators/user.validator";
import { addUser, getUserByEmail } from "../../services/users/users.service";
import createHttpError from "http-errors";
import { comparePassword, hashPassword } from "../../utils/password.utils";


export const login = async (req: Request<{}, {}, LoginUserInput["body"]>, res: Response) => {
    try {
        const user = await getUserByEmail(req.body.email);
        if (!user) {
            return res.status(404).send(createHttpError.NotFound("User does not exist"));
        }
        const token = await user.generateAuthToken();
        const password = user.password;
        const isMatched = await comparePassword(req.body.password, password);
        if (!isMatched) {
            return res.status(401).send(createHttpError.Unauthorized("Invalid password"));
        }
        return res.status(200).send({
            token,
            user
        });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(error.message);
    }
}


export const register = async (req: Request<{}, {}, UserSignUpInput["body"]>, res: Response) => {
    try {
        const user = await getUserByEmail(req.body.email);
        if (user) {
            return res.status(409).send(createHttpError.Conflict("User already exists"));
        }
        const { email, name, password } = req.body
        const hashedPassword = await hashPassword(password);
        // @ts-ignore
        const newUser = await addUser({
            email,
            name,
            password: hashedPassword
        });
        const token = await newUser.generateAuthToken();
        return res.status(201).send({
            token,
            user: newUser
        });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(error.message);
    }
}