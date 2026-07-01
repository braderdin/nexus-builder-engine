import { z } from "zod";

// Start: User Registration Schema Verification
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain alphanumeric characters and underscores" }),
  email: z
    .string()
    .email({ message: "Please provide a valid enterprise or personal email address" }),
  password: z
    .string()
    .min(8, { message: "Security standard requires password to be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one numeric character" }),
  requireTwoFactor: z
    .boolean()
    .default(true), // Enforces strict initial 2FA registration as planned
});
// End: User Registration Schema Verification

// Start: User Login Credentials Schema Verification
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email structure" }),
  password: z
    .string()
    .min(1, { message: "Password field execution requires a value" }),
  twoFactorCode: z
    .string()
    .length(6, { message: "Two-Factor Authentication token must be exactly 6 digits" })
    .optional(), // Dynamically validated conditional to account status
});
// End: User Login Credentials Schema Verification