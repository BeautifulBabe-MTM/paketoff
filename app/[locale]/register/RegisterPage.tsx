"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RegisterSchema } from "@/lib/zod";
import { registerAction } from "@/actions/register";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type RegisterInput = z.infer<typeof RegisterSchema>;

interface RegisterFormProps {
  t: {
    title: string;
    subtitle: string;
    name: string;
    nameError: string;
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
    button: string;
    error: string;
    loading: string; // Добавлено
    success: string; // Добавлено
    alreadyHaveAccount: string;
    signIn: string;
  };
}

export default function RegisterForm({ t }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'uk';

  const schema = useMemo(() => z.object({
    name: z.string().min(2, { message: t.nameError }),
    email: z.string().email({ message: t.emailError }),
    password: z.string().min(6, { message: t.passwordError }),
  }), [t.nameError, t.emailError, t.passwordError]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    const result = await registerAction(data); // Убедись, что экшен возвращает { error }
    if (result?.error) {
      setError(t.error);
      return;
    }

    // Редирект или успех
    window.location.href = `/${locale}/login`;
  };

  const inputClass = "w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm space-y-8 rounded-2xl p-8 bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t.title}</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register("name")} placeholder={t.name} className={inputClass} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <input {...register("email")} placeholder={t.email} className={inputClass} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <input {...register("password")} type="password" placeholder={t.password} className={inputClass} />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button disabled={isSubmitting} type="submit" className="w-full p-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity">
            {isSubmitting ? "..." : t.button}
          </button>

          <div className="text-center text-sm">
            <span className="text-zinc-500">{t.alreadyHaveAccount} </span>
            <Link href={`/${locale}/login`} className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
              {t.signIn}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}