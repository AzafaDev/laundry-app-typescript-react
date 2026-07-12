import { z } from "zod";

export const emailField = z.string().trim().email("Invalid email address");

export const passwordField = z.string().trim().min(8, "Password must be at least 8 characters");
