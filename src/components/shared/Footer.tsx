"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navMenuItems } from "@/constants/navMenuItems";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";

const Footer = () => {
  const t = useTranslations("Footer");
  const navT = useTranslations("Navbar");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background/70 backdrop-blur-2xl border-t border-primary/10 dark:border-primary/20 mt-auto">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: School Info */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              {t("description")}
            </p>
            <div className="mt-2 flex flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <p>
                <strong className="font-medium text-neutral-900 dark:text-neutral-200">
                  {t("addressTitle")}
                </strong>{" "}
                {t("address")}
              </p>
              <p>
                <strong className="font-medium text-neutral-900 dark:text-neutral-200">
                  {t("phoneTitle")}
                </strong>{" "}
                {t("phone")}
              </p>
              <p>
                <strong className="font-medium text-neutral-900 dark:text-neutral-200">
                  {t("emailTitle")}
                </strong>{" "}
                {t("email")}
              </p>
            </div>
          </div>

          {/* Column 2: Important Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-primary dark:text-primary/90 tracking-tight">
              {t("importantLinks")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {navMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-primary transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {navT(item.labelKey)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-primary dark:text-primary/90 tracking-tight">
              {t("quickLinks")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {["studentPortal", "noticeBoard", "events", "careers"].map(
                (key) => (
                  <li key={key}>
                    <Link
                      href={`/${key.toLowerCase()}`}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-primary transition-colors" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {t(
                          key as
                            | "studentPortal"
                            | "noticeBoard"
                            | "events"
                            | "careers",
                        )}
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter & Socials */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-primary dark:text-primary/90 tracking-tight">
              {t("newsletterTitle")}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t("newsletterDesc")}
            </p>
            <form
              className="flex flex-col gap-2 mt-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder={t("newsletterPlaceholder")}
                className="bg-white/80 dark:bg-primary/5 border-primary/20 dark:border-primary/20 placeholder:text-muted-foreground/60"
                required
              />
              <Button type="submit" className="w-full">
                {t("subscribe")}
              </Button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all text-neutral-500"
              >
                <FaFacebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all text-neutral-500"
              >
                <FaTwitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all text-neutral-500"
              >
                <FaYoutube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-primary/10 dark:border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col items-center gap-3">
          {/* Developer credit */}
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 flex-wrap justify-center">
            Developed{" "}
            <span className="text-red-500 animate-pulse text-base">❤️</span> by{" "}
            <a
              href="https://www.facebook.com/naim.sorker6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-all duration-200"
            >
              <FaFacebook className="h-3.5 w-3.5" />
              Naim Sorker
            </a>
          </p>

          {/* Copyright & Links row */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-neutral-400 dark:text-neutral-500">
            <p className="text-center">
              {t("copyright", { year: currentYear })}
            </p>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">
              ·
            </span>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
