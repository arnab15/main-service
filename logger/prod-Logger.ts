import { format, createLogger, transports } from "winston";
const { timestamp, combine, errors, json } = format;
const winston = require("winston");

function buildProdLogger() {
    return createLogger({
        level: "info",
        format: combine(timestamp(), errors({ stack: true }), json()),
        defaultMeta: { service: "user-service" },
        transports: [
            new transports.Console(),
            new transports.File({
                filename: "log/error.log",
                level: "error",
            }),
        ],
        exceptionHandlers: [new transports.File({ filename: "log/exceptions.log" })],
        rejectionHandlers: [new transports.File({ filename: "log/rejections.log" })],
    });
}

module.exports = buildProdLogger;
