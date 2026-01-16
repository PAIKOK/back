import { Request, Response } from "express";
import { mysqlPool } from "../db/mysql";
import { emailQueue } from "../queues/email.queue";

/**
 * Schedule email for future
 */
export async function scheduleEmail(req: Request, res: Response) {
    const { idempotencyKey, to, subject, body, scheduledAt } = req.body;

    if (!idempotencyKey || !to || !subject || !body || !scheduledAt) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const scheduledTime = Date.parse(scheduledAt);
    if (Number.isNaN(scheduledTime)) {
        return res.status(400).json({
            error: "scheduledAt must be ISO-8601 (e.g. 2026-01-16T13:45:00)"
        });
    }

    const delay = scheduledTime - Date.now();
    if (delay <= 0) {
        return res.status(400).json({ error: "scheduledAt must be in the future" });
    }

    try {
        const [result]: any = await mysqlPool.query(
            `
      INSERT INTO email_jobs
      (idempotency_key, to_email, subject, body, scheduled_at)
      VALUES (?, ?, ?, ?, ?)
      `,
            [idempotencyKey, to, subject, body, new Date(scheduledTime)]
        );

        const emailJobId = result.insertId;

        await emailQueue.add(
            "send-email",
            { emailJobId },
            {
                delay,
                jobId: `email_${idempotencyKey}`
            }
        );

        res.status(201).json({ message: "Email scheduled" });
    } catch (err: any) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({ message: "Duplicate request ignored" });
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * DEBUG — Send immediately
 */
export async function sendEmailNow(req: Request, res: Response) {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const [result]: any = await mysqlPool.query(
        `
    INSERT INTO email_jobs
    (idempotency_key, to_email, subject, body, scheduled_at)
    VALUES (?, ?, ?, ?, NOW())
    `,
        [`debug-${Date.now()}`, to, subject, body]
    );

    const emailJobId = result.insertId;

    await emailQueue.add(
        "send-email",
        { emailJobId },
        { jobId: `debug_${emailJobId}` }
    );

    res.json({ message: "Immediate email enqueued" });
}

/**
 * 📖 Read: Scheduled emails
 */
export async function listScheduledEmails(_req: Request, res: Response) {
    const [rows] = await mysqlPool.query(
        `
    SELECT id, to_email, subject, scheduled_at, status
    FROM email_jobs
    WHERE status = 'scheduled'
    ORDER BY scheduled_at ASC
    `
    );

    res.json(rows);
}

/**
 * 📖 Read: Sent emails
 */
export async function listSentEmails(_req: Request, res: Response) {
    const [rows] = await mysqlPool.query(
        `
    SELECT id, to_email, subject, scheduled_at, status
    FROM email_jobs
    WHERE status = 'sent'
    ORDER BY scheduled_at DESC
    `
    );

    res.json(rows);
}
