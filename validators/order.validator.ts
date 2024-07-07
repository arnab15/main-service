import { TypeOf, z } from "zod";


export const createOrderValidationSchema = z.object({
    body: z
        .object({
            products: z.array(z.string()),
            address: z.string(),
        })
        .strict(),
});

export const updateOrderStatusValidationSchema = z.object({
    body: z
        .object({
            status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
        })
        .strict(),
});
export type CreateOrderInput = Omit<TypeOf<typeof createOrderValidationSchema>, "">;
