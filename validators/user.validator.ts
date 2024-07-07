import { TypeOf, z } from "zod";


export const signupValidator = z.object({
    body: z
        .object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
        })
        .strict(),
});
export const loginValidator = z.object({
    body: z
        .object({
            email: z.string().email(),
            password: z.string(),
        })
        .strict(),
});

export const validateUpdateUserRole = z.object({
    body: z
        .object({
            role: z.enum(["admin", "user"]),
        })
        .strict(),
});
export type LoginUserInput = Omit<TypeOf<typeof loginValidator>, "">;
export type UserSignUpInput = Omit<TypeOf<typeof signupValidator>, "">;
