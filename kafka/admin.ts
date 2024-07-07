import logger from "../logger";
import { kafkaClient } from "./client";
import { topics } from "./topics";

export async function initKafka() {
    const admin = kafkaClient.admin();
    logger.info("Admin connecting...");
    admin.connect();
    logger.info("Admin Connection Success...");

    logger.info("Creating Topics...");
    await admin.createTopics({
        topics: [
            {
                topic: topics.orderCreate,
                numPartitions: 1,
            },
            {
                topic: topics.orderStatusUpdate,
                numPartitions: 1,
            },
        ],
    });
    logger.info("Topic Created...");

    logger.info("Disconnecting Admin..");
    await admin.disconnect();
}
