"use server";

import { signIn } from "@/lib/auth";
import { LoginSchema } from "@/lib/zod";
import { AuthError } from "next-auth";

export async function loginAction(data: { email: string; password: string }) {
  const validatedFields = LoginSchema.safeParse(data);
  
  if (!validatedFields.success) {
    return { error: "Неправильний формат даних" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", { 
      email, 
      password, 
      redirectTo: "/" 
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Невірний email або пароль" };
    }
    throw error;
  }
}