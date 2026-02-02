const ALLOWED_EMAIL =
  process.env.ALLOWED_EMAIL ?? "mengzhou44@gmail.com";
const ALLOWED_PASSWORD =
  process.env.ALLOWED_PASSWORD ?? "password123";

export function validateCredentials(
  email: string,
  password: string
): boolean {
  return email === ALLOWED_EMAIL && password === ALLOWED_PASSWORD;
}
