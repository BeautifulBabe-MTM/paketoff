import { translateString } from "@/lib/translate-server";
import RegisterPage from "./RegisterPage"; // Твой клиентский компонент ниже

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const t = {
    title: await translateString("Створити акаунт", locale),
    subtitle: await translateString("Приєднуйтесь до PACKLAB", locale),
    name: await translateString("Ім'я", locale),
    email: "Email",
    password: await translateString("Пароль", locale),
    button: await translateString("Зареєструватися", locale),
    loading: await translateString("Завантаження...", locale),
    alreadyHaveAccount: await translateString("Вже маєте акаунт?", locale),
    signIn: await translateString("Увійти", locale),
    success: await translateString("Успішно! Переходьте до входу.", locale),
  };

  return <RegisterPage t={t} />;
}