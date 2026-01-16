import { Queue } from "bullmq";
import { redis } from "./redis";

export interface EmailQueuePayload {
    emailJobId: number;
}

export const emailQueue = new Queue<EmailQueuePayload>("email-queue", {
    connection: redis
});
