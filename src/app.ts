import express from "express";
import { emailRouter } from "./routes/email.route";
import { authRouter } from "./routes/auth.route";

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/emails", emailRouter);
