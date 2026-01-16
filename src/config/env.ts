export const env = {
    port: Number(process.env.PORT || 3000),
    nodeEnv: process.env.NODE_ENV || "development",

    db: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        name: process.env.DB_NAME!
    },

    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379)
    }
};
