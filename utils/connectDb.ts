import mongoose from "mongoose";
import logger from "../logger";
import dotenv from "dotenv";
dotenv.config();
const dbURL = process.env.MONGO_DB_URL as string;

async function connectDb() {
  mongoose
    .connect(dbURL)
    .then(() => {
      logger.info(`Mongoose default connection is open ✅`);
    })
    .catch((err) => {
      logger.error("Unable to connect to data base ❌", err);
    });
  mongoose.connection.on("disconnected", function () {
    console.warn("Mongoose default connection is disconnected ❗");
  });
}

export default connectDb;
