# Email Scheduler Backend

Production-style backend email scheduler built with:

- Node.js + TypeScript
- Express
- BullMQ + Redis (no cron jobs)
- MySQL
- Nodemailer (Ethereal for testing)
- JWT authentication

## Architecture

- API server enqueues email jobs
- Worker process consumes jobs
- Redis stores delayed jobs & rate limits
- MySQL persists email state (restart-safe)

## Features

- Schedule emails via API
- Restart-safe delayed delivery
- Idempotent job handling
- Separate API & worker processes
- Provider rate limiting (reschedule instead of fail)
- Read APIs for scheduled/sent emails
- JWT-protected routes

## Setup

### 1. Install dependencies
```bash
npm install
