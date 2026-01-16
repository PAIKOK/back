export type EmailJobStatus = "scheduled" | "sent" | "failed";

export interface EmailJob {
    id: number;
    idempotency_key: string;
    to_email: string;
    subject: string;
    body: string;
    scheduled_at: Date;
    status: EmailJobStatus;
}
