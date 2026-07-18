import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "The password must be at least 6 characters long"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Ім'я має бути мінімум 2 символи"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "The password must be at least 6 characters long"),
});