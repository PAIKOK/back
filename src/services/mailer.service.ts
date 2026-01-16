import nodemailer from "nodemailer";

console.log("✉️ Initializing SMTP transporter");

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },

    // 🔥 REQUIRED FOR ETHEREAL ON WINDOWS
    tls: {
        rejectUnauthorized: false
    }
});

export async function sendEmail(
    to: string,
    subject: string,
    body: string
) {
    console.log("📨 sendEmail called");

    const info = await transporter.sendMail({
        from: '"Email Scheduler" <no-reply@example.com>',
        to,
        subject,
        text: body
    });

    console.log("📬 sendMail resolved");

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("🔗 Ethereal Preview URL:", previewUrl);

    return info;
}
