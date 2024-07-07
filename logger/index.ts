import winston from "winston";

const buildDevLogger = require("./dev-Logger");
const buildProdLogger = require("./prod-Logger");

let logger: winston.Logger;
if (process.env.NODE_ENV !== "production") {
    logger = buildDevLogger();
} else {
    logger = buildProdLogger();
}
export default logger;
