import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: "Too many requests from this IP, please try again later" }
})

export const productRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: "Too many requests from this IP, please try again later" }
})

export const orderRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: "Too many requests from this IP, please try again later" }
})