import { translateString } from "@/lib/translate-server";
import LoginForm from "./LoginForm"; // Твой файл формы

export default async function LoginContainer({ locale }: { locale: string }) {
  const t = {
    title: await translateString("Ласкаво просимо", locale),
    subtitle: await translateString("Увійдіть до PACKLAB", locale),
    email: "Email",
    emailError: await translateString("Введіть правильний email", locale),
    password: await translateString("Пароль", locale),
    passwordError: await translateString("Пароль має бути мінімум 6 символів", locale),
    button: await translateString("Увійти", locale),
    error: await translateString("Невірний email або пароль", locale),
    haveAnAcc: await translateString("Ще немає акаунта? ", locale),
    reg: await translateString("Зареєструватися", locale)
  };

  return <LoginForm t={t} />;
}