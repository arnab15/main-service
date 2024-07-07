import express, { NextFunction, Request, Response } from "express";
import connectDb from "./utils/connectDb";
import dotenv from "dotenv";
import { initKafka } from "./kafka/admin";
import createServer from "./utils/creteServer";
dotenv.config();
const PORT = process.env.PORT || 5001;
const app = createServer();

initKafka();
app.listen(PORT, async () => {
  console.log(`Server is running on port, ${PORT}`)
  await connectDb();
});
