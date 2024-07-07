import logger from "../logger";
import { CreateOrderInput } from "../validators/order.validator";
import { kafkaClient } from "./client";
import { topics } from "./topics";

export async function producePlaceOrder(orderDetails: CreateOrderInput["body"]) {
    const producer = kafkaClient.producer();

    console.log("Connecting Producer");
    await producer.connect();
    console.log("Producer Connected Successfully");

    await producer.send({
        topic: topics.orderCreate,
        messages: [
            {
                partition: 0,
                key: "order-create",
                value: JSON.stringify(orderDetails),
            },
        ],
    });
    console.log("Order Created Successfully");
    await producer.disconnect();
}
export async function produceUpdateOrderStatus({ id, status }: { id: string, status: string }) {
    const producer = kafkaClient.producer();
    await producer.connect();
    await producer.send({
        topic: topics.orderStatusUpdate,
        messages: [
            {
                partition: 0,
                key: "order-status-update",
                value: JSON.stringify({ id, status }),
            },
        ],
    });
    logger.info("Order Status Update produced Successfully");
    await producer.disconnect();
}
