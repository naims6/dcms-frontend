"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  useNoticesQuery,
  useDeleteNoticeMutation,
  usePublishNoticeMutation,
  useUnpublishNoticeMutation,
} from "@/hooks/queries/use-notice-queries";
import { downloadNoticePdfApi } from "@/services/notice.service";
import {
  Notice,
  NoticeCategory,
  NoticeStatus,
} from "@/types/notice.types";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Megaphone, Plus, Pencil, Trash2, Download, Loader2,
  Search, Globe, EyeOff, ChevronLeft, ChevronRight, FileText,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";

// ── Constants ─────────────────────────────────────────────────────────────
const CATEGORIES: NoticeCategory[] = ["GENERAL", "SCHOLARSHIP", "JOB", "RESULT"];
const STATUSES: NoticeStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const LIMIT = 10;

// ── Status badge styles ───────────────────────────────────────────────────
const STATUS_STYLES: Record<NoticeStatus, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  DRAFT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  ARCHIVED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700",
};

export function NoticesManagement() {
  const t = useTranslations("Dashboard");
  const { toast, toastState, dismiss } = useToast();

  // ── Filters & pagination ──────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<NoticeCategory | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<NoticeStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput);

  const { data, isLoading, isError } = useNoticesQuery({
    page,
    limit: LIMIT,
    category: categoryFilter !== "ALL" ? categoryFilter : undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    search: debouncedSearch || undefined,
  });

  const notices = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: LIMIT, total: 0, totalPages: 1 };
  const totalPages = meta.totalPages || 1;

  // ── Mutations ─────────────────────────────────────────────────────
  const deleteMutation = useDeleteNoticeMutation();
  const publishMutation = usePublishNoticeMutation();
  const unpublishMutation = useUnpublishNoticeMutation();

  const isMutating =
    deleteMutation.isPending || publishMutation.isPending || unpublishMutation.isPending;

  // ── Delete confirm state ─────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  // ── Toggle & PDF state ────────────────────────────────────────────
  const [publishTargetId, setPublishTargetId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast("success", t("deleteSuccess"));
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const handleTogglePublish = async (n: Notice) => {
    try {
      setPublishTargetId(n.id);
      if (n.status === "PUBLISHED") {
        await unpublishMutation.mutateAsync(n.id);
        toast("success", t("unpublishSuccess"));
      } else {
        await publishMutation.mutateAsync(n.id);
        toast("success", t("publishSuccess"));
      }
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Operation failed.");
    } finally {
      setPublishTargetId(null);
    }
  };

  const handleDownload = async (n: Notice) => {
    try {
      setDownloadingId(n.id);
      const blob = await downloadNoticePdfApi(n.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${n.subject.slice(0, 40).replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast("error", "Failed to download PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {toastState && <Toast state={toastState} onDismiss={dismiss} />}

      {/* ── Header ───────────────────────────────────────────────── */}
      <DashboardPageHeader
        title={t("title")}
        description={t("subtitle")}
        icon={Megaphone}
        actions={
          <Button className="gap-2 w-full sm:w-auto" asChild>
            <Link href="/dashboard/notices/create">
              <Plus className="h-4 w-4" />
              {t("addNotice")}
            </Link>
          </Button>
        }
      />

      {/* ── Filters ──────────────────────────────────────────────── */}
      <Card className="border border-border/70 shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("search")}
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              className="pl-9 h-9"
            />
          </div>

          {/* Category */}
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v as NoticeCategory | "ALL"); setPage(1); }}>
            <SelectTrigger className="h-9 w-full sm:w-48"><SelectValue placeholder={t("filterCategory")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allCategories")}</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{t(`category.${c}`)}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as NoticeStatus | "ALL"); setPage(1); }}>
            <SelectTrigger className="h-9 w-full sm:w-40"><SelectValue placeholder={t("filterStatus")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allStatuses")}</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ── Table card ───────────────────────────────────────────── */}
      <Card className="border border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-border/50">
          <CardTitle className="text-base font-semibold">
            All Notices{" "}
            {!isLoading && (
              <span className="text-muted-foreground font-normal text-sm ml-1">({meta.total} total)</span>
            )}
          </CardTitle>
          <CardDescription className="text-xs">Manage, publish, and download notices from here.</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Loading notices...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-destructive gap-2">
              <FileText className="h-8 w-8 opacity-40" />
              <p className="text-sm">Failed to load notices. Please refresh.</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Megaphone className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("noNotices")}</p>
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <Link href="/dashboard/notices/create">
                  <Plus className="h-4 w-4" />{t("addNotice")}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="px-4 py-3 text-left font-semibold">{t("table.date")}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t("table.subject")}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t("table.category")}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t("table.status")}</th>
                    <th className="px-4 py-3 text-center font-semibold">{t("table.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(notice.noticeDate)}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <span className="font-medium text-foreground line-clamp-2">{notice.subject}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs font-medium">
                          {t(`category.${notice.category}`)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs ${STATUS_STYLES[notice.status]}`}>
                          {t(`status.${notice.status}`)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Publish / Unpublish — hidden for ARCHIVED */}
                          {notice.status !== "ARCHIVED" && (
                            <Button
                              size="sm" variant="outline"
                              className={`h-8 px-2.5 gap-1.5 text-xs ${
                                notice.status === "PUBLISHED"
                                  ? "text-amber-600 hover:text-amber-700 border-amber-200 hover:border-amber-300"
                                  : "text-emerald-600 hover:text-emerald-700 border-emerald-200 hover:border-emerald-300"
                              }`}
                              onClick={() => handleTogglePublish(notice)}
                              disabled={publishTargetId === notice.id}
                            >
                              {publishTargetId === notice.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : notice.status === "PUBLISHED"
                                  ? <EyeOff className="h-3.5 w-3.5" />
                                  : <Globe className="h-3.5 w-3.5" />}
                              {notice.status === "PUBLISHED" ? t("unpublishNotice") : t("publishNotice")}
                            </Button>
                          )}

                          {/* Edit */}
                          <Button size="sm" variant="outline" className="h-8 px-2.5 gap-1.5 text-xs" asChild>
                            <Link href={`/dashboard/notices/${notice.id}/edit`}>
                              <Pencil className="h-3.5 w-3.5" />{t("editNotice")}
                            </Link>
                          </Button>

                          {/* PDF Download */}
                          <Button
                            size="sm" variant="outline"
                            className="h-8 px-2.5 gap-1.5 text-xs text-primary hover:text-primary/80 border-primary/20 hover:border-primary/40"
                            onClick={() => handleDownload(notice)} disabled={downloadingId === notice.id}
                          >
                            {downloadingId === notice.id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Download className="h-3.5 w-3.5" />}
                            {t("downloadPdf")}
                          </Button>

                          {/* Delete */}
                          <Button
                            size="sm" variant="outline"
                            className="h-8 px-2.5 gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/40"
                            onClick={() => setDeleteTarget(notice)} disabled={isMutating}
                          >
                            <Trash2 className="h-3.5 w-3.5" />{t("deleteNotice")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && meta.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border/50 gap-3">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, meta.total)} of {meta.total} notices
              </p>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0"
                  onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {pageNumbers.map((p, idx) =>
                  p === "..." ? (
                    <span key={`e-${idx}`} className="h-8 w-8 flex items-center justify-center text-muted-foreground text-sm">…</span>
                  ) : (
                    <Button key={p} variant={page === p ? "default" : "outline"} size="sm"
                      className="h-8 w-8 p-0 text-xs" onClick={() => setPage(p as number)}>
                      {p}
                    </Button>
                  ),
                )}
                <Button variant="outline" size="sm" className="h-8 w-8 p-0"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Delete Confirm Dialog ─────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("deleteNotice")}
        description={
          <>
            {t("confirmDelete")}
            {deleteTarget && (
              <span className="mt-2 block font-medium text-foreground">
                &ldquo;{deleteTarget.subject}&rdquo;
              </span>
            )}
          </>
        }
        confirmLabel={t("deleteNotice")}
        cancelLabel={t("form.cancel")}
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}