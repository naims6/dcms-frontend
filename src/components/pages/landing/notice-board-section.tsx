"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Megaphone,
  GraduationCap,
  Briefcase,
  BarChart2,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import { useNoticeFeedQuery } from "@/hooks/queries/use-notice-queries";
import { downloadNoticePdfApi } from "@/services/notice.service";
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
  const { toast, toastState, dismiss } = useToast();

  const [activeTab, setActiveTab]         = useState<TabId>("GENERAL");
  const [searchInput, setSearchInput]     = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [page, setPage]                   = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

  const handleDownload = async (noticeId: string, subject: string) => {
    try {
      setDownloadingId(noticeId);
      const blob = await downloadNoticePdfApi(noticeId);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${subject.slice(0, 40).replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast("error", "Failed to download PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <section className={`w-full ${hideTitle ? "pb-16 pt-8 md:pb-24 md:pt-12" : "py-16 md:py-24"} bg-background`}>
      {toastState && <Toast state={toastState} onDismiss={dismiss} />}

      <div className="container mx-auto px-4">

        {!hideTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
              {t("sectionTitle")}
            </h2>
            <div className="w-16 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
        )}

        <div className="border border-border/60 bg-card rounded-xl shadow-md overflow-hidden flex flex-col">

          {/* ── Tabs ────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-2 bg-muted/60">
            {TABS.map(({ id, labelKey, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                    : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{t(`tabs.${labelKey}`)}</span>
              </button>
            ))}
          </div>

          {/* ── Controls ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-background border-b border-border/50 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <select
                className="bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setPage(1); }}
              >
                {ENTRIES_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
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
                  <th className="py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm w-[22%] sm:w-[15%] text-center border-l border-white/20">{t("table.attachment")}</th>
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
                      <td className="py-2 px-1 sm:px-4 text-center border-l border-border/40 align-middle">
                        <button
                          onClick={() => handleDownload(notice.id, notice.subject)}
                          disabled={downloadingId === notice.id}
                          className="inline-flex flex-col items-center justify-center text-primary hover:text-primary/70 transition-colors group mt-1 sm:mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <span className="text-[10px] sm:text-xs font-semibold uppercase leading-tight">
                            {t("table.viewDetails")}
                          </span>
                          <div className="bg-primary/10 p-1 sm:p-1.5 rounded-full mt-1 group-hover:bg-primary/20">
                            {downloadingId === notice.id
                              ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                              : <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                          </div>
                        </button>
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
            <div className="flex bg-background border border-border rounded-md overflow-hidden">
              <button
                className="px-3 py-1 border-r border-border hover:bg-muted text-muted-foreground disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span key={`e-${idx}`} className="px-3 py-1 border-r border-border text-muted-foreground flex items-center text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`px-3 py-1 border-r border-border transition-colors text-sm ${
                      page === p ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                className="px-3 py-1 hover:bg-muted text-muted-foreground disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
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
