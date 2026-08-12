import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Formly | Conversational Web Forms & Builder",
  description: "Create elegant, high-converting, conversational typeform-style web forms with ease.",
  keywords: ["form builder", "typeform clone", "conversational forms", "nextjs", "fastapi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 antialiased font-sans min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
