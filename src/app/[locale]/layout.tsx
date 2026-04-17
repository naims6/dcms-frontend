import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import ScrollToTop from "@/components/shared/ScrollToTop";

const hindSiliguri = Hind_Siliguri({ 
  subsets: ["bengali", "latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans" 
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://dcms-dhanbari.edu.bd"
  ),
  title: {
    default: "Dhanbari Collegiate Model School | DCMS",
    template: "%s | Dhanbari Collegiate Model School"
  },
  description: "Dhanbari Collegiate Model School (DCMS) is a premier educational institution dedicated to empowering students through knowledge, discipline, and moral values. Discover our academic programs, admissions, and modern facilities.",
  keywords: [
    "DCMS", 
    "Dhanbari Collegiate Model School", 
    "School in Dhanbari", 
    "Dhanbari Education", 
    "Best School Tangail", 
    "Academic Excellence"
  ],
  authors: [{ name: "DCMS Development Team" }],
  creator: "Dhanbari Collegiate Model School",
  publisher: "DCMS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Dhanbari Collegiate Model School | DCMS",
    description: "Empowering students through high-quality education and moral values.",
    url: "/",
    siteName: "Dhanbari Collegiate Model School",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    type: "website",
    images: [
      {
        url: "/images/hero-school2.png",
        width: 1200,
        height: 630,
        alt: "Dhanbari Collegiate Model School Campus",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhanbari Collegiate Model School",
    description: "Empowering students through high-quality education and moral values.",
    images: ["/images/hero-school2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        hindSiliguri.variable,
      )}
    >
      <body className="antialiased min-h-full flex flex-col bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
