import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

/**
 * Dummy login (for assignment)
 * Replace with Google OAuth in real systems
 */
export function login(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email required" });
    }

    const token = jwt.sign(
        { email },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
}
