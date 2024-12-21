import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "../globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autorization - Titorelli",
  description: "Titorelli - an telegram antispam bot platform",
};

export default function AuthorizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={cn(geistSans.variable, geistMono.variable)}>
        {children}
      </body>
    </html>
  );
}
