export interface IScheduledEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  scheduledAt: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IScheduleEmailRequest {
  to: string;
  subject: string;
  body: string;
  scheduledAt: Date;
}

export interface IHealthCheck {
  status: 'ok' | 'error';
  timestamp: Date;
  uptime: number;
}
