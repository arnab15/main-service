import { kafkaClient } from "./client";
import { topics } from "./topics";
import * as orderService from "../services/orders/orders.service";
import logger from "../logger";
export async function consumeMessage() {
    try {
        const consumer = kafkaClient.consumer({ groupId: "order-group" });
        await consumer.connect();
        await consumer.subscribe({ topics: [topics.orderCreate, topics.orderStatusUpdate], fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                logger.info(
                    `Topic:[${topic}]: PART:${partition}:`, message.key?.toString(), message.value?.toString()
                );
                const data = JSON.parse(message.value?.toString() || "{}")
                if (topic === topics.orderCreate) {
                    const order = await orderService.createOrder(data);
                    logger.info(message.value?.toString());
                    logger.info("Order Created Successfully", order);
                } else if (topic === topics.orderStatusUpdate) {
                    await orderService.updateOrderStatus(data.id, data.status);
                    logger.info(message.value?.toString());
                    logger.info("Order Status Updated Successfully");
                }
            },
        });
    } catch (error: any) {
        logger.error(error.message, error);
    }

}