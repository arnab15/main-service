import { Kafka } from 'kafkajs'
import dotenv from 'dotenv'
dotenv.config();
const kafkaURL = process.env.KAFKA_URL as string;
export const kafkaClient = new Kafka({
    clientId: 'my-app',
    brokers: [kafkaURL,],
})