import { translateString } from "@/lib/translate-server";
import RegisterForm from "./RegisterPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const t = {
    title: await translateString("Створити акаунт", locale),
    subtitle: await translateString("Приєднуйтесь до PACKLAB", locale),
    
    name: await translateString("Ім'я", locale),
    nameError: await translateString("Ім'я має бути мінімум 2 символи", locale),
    email: "Email",
    emailError: await translateString("Введіть правильний email", locale),
    password: await translateString("Пароль", locale),
    passwordError: await translateString("Пароль має бути мінімум 6 символів", locale),
    
    button: await translateString("Зареєструватися", locale),
    loading: await translateString("Завантаження...", locale),
    error: await translateString("Сталася помилка", locale),
    success: await translateString("Успішно! Переходьте до входу.", locale),
    
    alreadyHaveAccount: await translateString("Вже маєте акаунт?", locale),
    signIn: await translateString("Увійти", locale),
  };

  return <RegisterForm t={t} />;
}