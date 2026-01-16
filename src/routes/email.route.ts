import { Router } from "express";
import {
    scheduleEmail,
    sendEmailNow,
    listScheduledEmails,
    listSentEmails
} from "../controllers/email.controller";

export const emailRouter = Router();

emailRouter.post("/schedule", scheduleEmail);
emailRouter.post("/send-now", sendEmailNow);

emailRouter.get("/scheduled", listScheduledEmails);
emailRouter.get("/sent", listSentEmails);
