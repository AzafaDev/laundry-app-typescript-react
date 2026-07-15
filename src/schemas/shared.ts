import { z } from "zod";

export const emailField = z.string().trim().email("Alamat email tidak valid");

export const passwordField = z.string().trim().min(8, "Kata sandi minimal 8 karakter");
