import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthLayout } from "@/components/auth-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestão Financeira Pessoal",
  description: "Sistema para controle financeiro pessoal de forma simples e eficiente",
  keywords: ["finanças", "gestão financeira", "controle de gastos", "orçamento"],
  authors: [{ name: "Sistema Financeiro" }],
  openGraph: {
    title: "Gestão Financeira Pessoal",
    description: "Sistema para controle financeiro pessoal de forma simples e eficiente",
    url: "https://chat.z.ai",
    siteName: "Gestão Financeira",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestão Financeira Pessoal",
    description: "Sistema para controle financeiro pessoal de forma simples e eficiente",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthLayout>
          {children}
        </AuthLayout>
        <Toaster />
      </body>
    </html>
  );
}