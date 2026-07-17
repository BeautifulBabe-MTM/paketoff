import { Metadata } from 'next';
import LoginContainer from "./LoginContainer";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LoginContainer locale={locale} />;
}