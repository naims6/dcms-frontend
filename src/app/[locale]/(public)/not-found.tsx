import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full min-h-[75vh] p-6 text-center animate-in fade-in duration-700 relative overflow-hidden bg-white dark:bg-neutral-950">
      {/* Elegant Architectural Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02] dark:opacity-[0.015]">
        <span className="text-[20rem] sm:text-[28rem] font-black tracking-tighter leading-none">404</span>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 mb-8 shadow-sm">
          <Search className="h-8 w-8" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
          {t("title")}
        </h1>
        
        <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10 leading-relaxed max-w-md mx-auto">
          {t("description")}
        </p>

        <div className="w-12 h-1 bg-primary/20 dark:bg-primary/20 rounded-full mb-10" />
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <Button size="lg" className="rounded-xl shadow-sm hover:shadow-md transition-all w-full sm:w-auto px-8 gap-2.5 h-12 text-base font-medium" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              {t("backHome")}
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl w-full sm:w-auto px-8 h-12 text-base font-medium border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 shadow-sm" asChild>
            <Link href="/contact">
              {t("contactSupport")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
