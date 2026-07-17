import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Package, Clock, ShieldCheck } from "lucide-react";
import { translateString } from "@/lib/translate-server";

interface ProfilePageProps {
    params: Promise<{ locale: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const session = await auth();
    const { locale } = await params;

    if (!session) {
        redirect(`/${locale}/login`);
    }

    const t = {
        title: await translateString("Профіль", locale),
        user: await translateString("Користувач", locale),
        activity: await translateString("Активність", locale),
        activeOrders: await translateString("Активних замовлень", locale),
        profileVerified: await translateString("Профіль підтверджено", locale),
        historyEmpty: await translateString("Історія замовлень поки що порожня.", locale),
        makeOrder: await translateString("Зробіть своє перше замовлення в PACKLAB.", locale),
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4">
            <div className="mx-auto max-w-2xl">
                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

                    <div className="bg-zinc-100/50 dark:bg-zinc-950/50 p-8 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border-2 border-emerald-500/20">
                                <User className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                                    {session.user?.name || t.user}
                                </h1>
                                <p className="text-sm font-mono text-zinc-600 dark:text-zinc-300">{session.user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div>
                            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">{t.activity}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                                    <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold mb-1">
                                        <Package className="h-4 w-4 text-emerald-500" /> 0
                                    </div>
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">{t.activeOrders}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                                    <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold mb-1">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">{t.profileVerified}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900">
                            <Clock className="h-8 w-8 text-zinc-400 dark:text-zinc-600 mb-3" />
                            <p className="text-sm text-zinc-700 dark:text-zinc-200 font-medium">
                                {t.historyEmpty}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                {t.makeOrder}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}