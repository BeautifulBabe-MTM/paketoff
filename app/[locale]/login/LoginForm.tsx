"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "@/lib/zod";
import { loginAction } from "@/actions/auth";
import { useState } from "react";
import { usePathname } from "next/navigation";

type LoginInput = z.infer<typeof LoginSchema>;

// Добавим интерфейс для типизации t, чтобы TypeScript не ругался
interface LoginFormProps {
    t: {
        title: string;
        subtitle: string;
        email: string;
        password: string;
        button: string;
        error: string;
    };
}

export default function LoginForm({ t }: LoginFormProps) {
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'uk';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginInput) => {
        setError(null);
        const result = await loginAction(data);
        if (result?.error) {
            setError(t.error); // Используем перевод ошибки
            return;
        }

        if (result?.success) {
            window.location.href = `/${locale}/`;
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <div className="w-full max-w-sm space-y-8 rounded-2xl p-8 bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {t.title}
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {t.subtitle}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            {...register("email")}
                            placeholder={t.email}
                            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder={t.password}
                            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full p-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity"
                    >
                        {isSubmitting ? "..." : t.button}
                    </button>
                </form>
            </div>
        </div>
    );
}