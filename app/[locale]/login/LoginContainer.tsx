import { translateString } from "@/lib/translate-server";
import LoginForm from "./LoginForm"; // Твой файл формы

export default async function LoginContainer({ locale }: { locale: string }) {
  const t = {
    title: await translateString("Ласкаво просимо", locale),
    subtitle: await translateString("Увійдіть до PACKLAB", locale),
    email: "Email",
    password: await translateString("Пароль", locale),
    button: await translateString("Увійти", locale),
    error: await translateString("Невірний email або пароль", locale),
  };

  return <LoginForm t={t} />;
}