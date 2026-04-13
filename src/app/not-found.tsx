import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import NotFoundPage from '@/app/[locale]/not-found';
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/[locale]/globals.css";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

// Statically load the default english translations for the root layout fallback
import enMessages from '../../messages/en.json';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function GlobalNotFound() {
  return (
    <html
      lang={routing.defaultLocale}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="antialiased min-h-full flex flex-col bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <NextIntlClientProvider locale={routing.defaultLocale} messages={enMessages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NotFoundPage />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
