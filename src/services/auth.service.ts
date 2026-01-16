import jwt from "jsonwebtoken";

export interface JwtPayload {
    email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signJwt(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyJwt(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
