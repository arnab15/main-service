import { TypeOf, z } from "zod";


export const productSchema = z.object({
    body: z
        .object({
            name: z.string(),
            description: z.string(),
            price: z.number(),
            category: z.string(),
        })
        .strict(),
});
export const updateProductValidationSchema = z.object({
    body: z
        .object({
            name: z.string().optional(),
            description: z.string().optional(),
            price: z.number().optional(),
            category: z.string().optional(),
        })
        .strict(),
});
export type ProductInput = Omit<TypeOf<typeof productSchema>, "">;
