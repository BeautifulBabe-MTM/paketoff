"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/register";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RegisterPage({ t }: { t: any }) {
  const { locale } = useParams();
  const [state, action, isPending] = useActionState(registerAction, undefined);

  const inputClass = "w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm space-y-8 rounded-2xl p-8 bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t.title}</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
        </div>

        <form action={action} className="space-y-4">
          <input name="name" placeholder={t.name} className={inputClass} required />
          <input name="email" type="email" placeholder={t.email} className={inputClass} required />
          <input name="password" type="password" placeholder={t.password} className={inputClass} required />

          {state?.error && <p className="text-center text-red-500 text-sm">{state.error}</p>}
          {state?.success && <p className="text-center text-emerald-500 text-sm">{t.success}</p>}

          <button 
            disabled={isPending} 
            className="w-full p-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity"
          >
            {isPending ? t.loading : t.button}
          </button>

          <div className="text-center text-sm">
            <span className="text-zinc-500">{t.alreadyHaveAccount} </span>
            <Link href={`/${locale}/login`} className="text-emerald-600 dark:text-emerald-500 font-bold hover:underline">
              {t.signIn}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}