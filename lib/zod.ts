import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Введіть правильний email"),
  password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Ім'я має бути мінімум 2 символи"),
  email: z.string().email("Введіть правильний email"),
  password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
});