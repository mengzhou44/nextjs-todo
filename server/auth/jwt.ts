import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h";

if (process.env.NODE_ENV === "production" && !JWT_SECRET) {
  console.warn(
    "JWT_SECRET is not set in production. Set it in .env.local (for npm start) or in your deployment env."
  );
}
const secret = JWT_SECRET ?? "todo-app-secret";

export function signToken(payload: { email: string }): string {
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, secret) as { email: string };
    return decoded;
  } catch {
    return null;
  }
}
