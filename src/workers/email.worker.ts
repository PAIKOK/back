import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env";
import { mysqlPool } from "../db/mysql";
import { sendEmail } from "../services/mailer.service";
import { RateLimiter } from "../services/rateLimiter.service";
import { emailQueue } from "../queues/email.queue";

// Dedicated Redis for worker
const workerRedis = new IORedis({
    host: env.redis.host,
    port: env.redis.port,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

// Provider limit (TEST VALUE)
const PROVIDER_LIMIT_PER_HOUR = 1;

const rateLimiter = new RateLimiter(
    workerRedis,
    PROVIDER_LIMIT_PER_HOUR
);

new Worker(
    "email-queue",
    async (job) => {
        const { emailJobId } = job.data;

        const [rows]: any = await mysqlPool.query(
            "SELECT * FROM email_jobs WHERE id = ?",
            [emailJobId]
        );

        if (!rows.length) {
            throw new Error("Email job not found");
        }

        const email = rows[0];

        // Redis key per provider (can be per-domain/provider later)
        const rateKey = "rate:provider:ethereal:hour";

        const allowed = await rateLimiter.tryConsume(rateKey);

        if (!allowed) {
            const waitSeconds = await rateLimiter.secondsUntilReset(rateKey);

            console.log(
                `⏳ Rate limit hit. Rescheduling email ${emailJobId} in ${waitSeconds}s`
            );

            // Re-schedule SAME job deterministically (no duplicates)
            await emailQueue.add(
                "send-email",
                { emailJobId },
                {
                    delay: waitSeconds * 1000,
                    jobId: `email_${email.idempotency_key}`
                }
            );

            return;
        }

        // Allowed → send
        await sendEmail(
            email.to_email,
            email.subject,
            email.body
        );

        await mysqlPool.query(
            "UPDATE email_jobs SET status = 'sent' WHERE id = ?",
            [emailJobId]
        );

        console.log(`✅ Email ${emailJobId} sent`);
    },
    {
        connection: workerRedis
    }
);

console.log("📨 Email worker started (rate limited)");
