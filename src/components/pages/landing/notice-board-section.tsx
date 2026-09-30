"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import {
  Megaphone,
  GraduationCap,
  Briefcase,
  BarChart2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import { useNoticeFeedQuery } from "@/hooks/queries/use-notice-queries";
import { NoticeCategory, PaginatedNoticesResponse } from "@/types/notice.types";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";

type TabId = NoticeCategory; // "GENERAL" | "SCHOLARSHIP" | "JOB" | "RESULT"

const TABS: { id: TabId; labelKey: "general" | "scholarship" | "job" | "result"; icon: React.ElementType }[] = [
  { id: "GENERAL",    labelKey: "general",    icon: Megaphone     },
  { id: "SCHOLARSHIP",labelKey: "scholarship", icon: GraduationCap },
  { id: "JOB",        labelKey: "job",         icon: Briefcase     },
  { id: "RESULT",     labelKey: "result",      icon: BarChart2     },
];

const ENTRIES_OPTIONS = [5, 10, 25];

interface NoticeBoardSectionProps {
  hideTitle?: boolean;
  /** ISR snapshot of the default feed, rendered by the page server-side. */
  initialFeed?: PaginatedNoticesResponse;
}

export function NoticeBoardSection({ hideTitle = false, initialFeed }: NoticeBoardSectionProps) {
  const t = useTranslations("NoticeBoard");
  const { toastState, dismiss } = useToast();

  const [activeTab, setActiveTab]         = useState<TabId>("GENERAL");
  const [searchInput, setSearchInput]     = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [page, setPage]                   = useState(1);

  const debouncedSearch = useDebounce(searchInput);

  // Public feed — no auth, published-only.
  const { data, isLoading, isError } = useNoticeFeedQuery(
    {
      page,
      limit: entriesPerPage,
      category: activeTab,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    },
    initialFeed,
  );

  const notices    = data?.data ?? [];
  const meta       = data?.meta ?? { page: 1, limit: entriesPerPage, total: 0, totalPages: 1 };
  const totalPages = meta.totalPages || 1;

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setSearchInput("");
    setPage(1);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (page >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <section className="w-full py-12 md:py-16 bg-muted/30">
      {toastState && <Toast state={toastState} onDismiss={dismiss} />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {!hideTitle && (
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              {t("title")}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        )}

        {/* ── Category Tabs ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]"
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/80"
                  }
                `}
              >
                <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span>{t(`categories.${tab.labelKey}`)}</span>
              </button>
            );
          })}
        </div>

        {/* ── Table Card ───────────────────────────────────────────── */}
        <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto">
              <span>{t("show")}</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setPage(1); }}
              >
                {ENTRIES_OPTIONS.map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <span>{t("entriesPerPage")}</span>
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder={t("search")}
                className="pl-9 w-full sm:w-64 h-9"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* ── Table ────────────────────────────────────────────── */}
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm w-[18%] sm:w-[15%]">{t("table.date")}</th>
                  <th className="py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm border-l border-white/20">{t("table.title")}</th>
                  <th className="py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm w-[24%] sm:w-[18%] text-center border-l border-white/20">{t("table.attachment")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <span className="text-sm">Loading notices...</span>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-destructive text-sm">
                      Failed to load notices. Please try again later.
                    </td>
                  </tr>
                ) : notices.length > 0 ? (
                  notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium align-top whitespace-nowrap">
                        {formatDate(notice.noticeDate)}
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-xs sm:text-sm leading-relaxed border-l border-border/40 align-top">
                        {notice.subject}
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-center border-l border-border/40 align-middle">
                        <div className="flex items-center justify-center">
                          <Link
                            href={`/notice/${notice.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                            title={t("table.viewDetails")}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{t("table.viewDetails")}</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground text-sm">
                      No notices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ───────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-muted/20 border-t border-border/50 gap-4">
            <p className="text-sm text-muted-foreground">
              {t("pagination.showing")}{" "}
              {meta.total === 0 ? 0 : (page - 1) * entriesPerPage + 1}{" "}
              {t("pagination.to")}{" "}
              {Math.min(page * entriesPerPage, meta.total)}{" "}
              {t("pagination.of")} {meta.total} {t("pagination.entries")}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((num, idx) =>
                num === "..." ? (
                  <span key={`dots-${idx}`} className="px-2 text-xs text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${num}`}
                    onClick={() => setPage(Number(num))}
                    className={`
                      inline-flex items-center justify-center h-8 min-w-[2rem] px-2 rounded-md text-xs font-medium transition-colors
                      ${
                        page === num
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "border border-border bg-card text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
