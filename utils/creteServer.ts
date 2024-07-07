import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from "../routes";
dotenv.config();
function createServer() {
    const app = express();
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/api", mainRouter)
    app.get("/", (req, res) => {
        res.send({
            message: "Hello World",
        });
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
        res.send({
            error: {
                status: 404,
                message: "Invalid route",
            },
        });
    });

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.send({
            error: {
                status: err.status || 500,
                message: err.message,
            },
        });
    });
    return app
}
export default createServer