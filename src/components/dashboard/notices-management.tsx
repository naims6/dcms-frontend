"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useNoticesQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
  usePublishNoticeMutation,
  useUnpublishNoticeMutation,
} from "@/hooks/queries/use-notice-queries";
import { downloadNoticePdfApi } from "@/services/notice.service";
import {
  Notice,
  NoticeCategory,
  NoticeStatus,
  CreateNoticeDto,
  UpdateNoticeDto,
} from "@/types/notice.types";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Megaphone, Plus, Pencil, Trash2, Download, Loader2,
  Search, Globe, EyeOff, ChevronLeft, ChevronRight, FileText,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────
const CATEGORIES: NoticeCategory[] = ["GENERAL", "SCHOLARSHIP", "JOB", "RESULT"];
const STATUSES: NoticeStatus[]     = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const LIMIT = 10;

const defaultForm: CreateNoticeDto = {
  category: "GENERAL",
  subject: "",
  body: "",
  noticeDate: "",
  status: "DRAFT",
};

// ── Status badge styles ───────────────────────────────────────────────────
const STATUS_STYLES: Record<NoticeStatus, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  DRAFT:     "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  ARCHIVED:  "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700",
};

export default function DashboardNoticesPage() {
  const t = useTranslations("Dashboard");
  const { toast, toastState, dismiss } = useToast();

  // ── Filters & pagination ──────────────────────────────────────────
  const [searchInput,     setSearchInput]     = useState("");
  const [categoryFilter,  setCategoryFilter]  = useState<NoticeCategory | "ALL">("ALL");
  const [statusFilter,    setStatusFilter]    = useState<NoticeStatus | "ALL">("ALL");
  const [page,            setPage]            = useState(1);

  const debouncedSearch = useDebounce(searchInput);

  const { data, isLoading, isError } = useNoticesQuery({
    page,
    limit: LIMIT,
    category: categoryFilter !== "ALL" ? categoryFilter : undefined,
    status:   statusFilter   !== "ALL" ? statusFilter   : undefined,
    search:   debouncedSearch || undefined,
  });

  const notices    = data?.data ?? [];
  const meta       = data?.meta ?? { page: 1, limit: LIMIT, total: 0, totalPages: 1 };
  const totalPages = meta.totalPages || 1;

  // ── Mutations ─────────────────────────────────────────────────────
  const createMutation    = useCreateNoticeMutation();
  const updateMutation    = useUpdateNoticeMutation();
  const deleteMutation    = useDeleteNoticeMutation();
  const publishMutation   = usePublishNoticeMutation();
  const unpublishMutation = useUnpublishNoticeMutation();

  const isMutating =
    createMutation.isPending || updateMutation.isPending ||
    deleteMutation.isPending || publishMutation.isPending ||
    unpublishMutation.isPending;

  // ── Form dialog ───────────────────────────────────────────────────
  const [formOpen,       setFormOpen]       = useState(false);
  const [editingNotice,  setEditingNotice]  = useState<Notice | null>(null);
  const [form,           setForm]           = useState<CreateNoticeDto>(defaultForm);
  const [formError,      setFormError]      = useState<string | null>(null);

  // ── Delete dialog ─────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  // ── PDF state ─────────────────────────────────────────────────────
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // ── Helpers ───────────────────────────────────────────────────────
  const todayISO = () => new Date().toISOString().split("T")[0];

  const openCreate = () => {
    setEditingNotice(null);
    setForm({ ...defaultForm, noticeDate: todayISO() });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (n: Notice) => {
    setEditingNotice(n);
    setForm({ category: n.category, subject: n.subject, body: n.body, noticeDate: n.noticeDate.split("T")[0], status: n.status });
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!form.subject.trim()) { setFormError("Subject is required."); return; }
    if (!form.body.trim())    { setFormError("Body is required.");    return; }
    setFormError(null);

    try {
      const noticeDate = new Date(form.noticeDate).toISOString();
      if (editingNotice) {
        const dto: UpdateNoticeDto = { category: form.category, subject: form.subject, body: form.body, noticeDate };
        await updateMutation.mutateAsync({ id: editingNotice.id, dto });
        toast("success", "Notice updated successfully.");
      } else {
        await createMutation.mutateAsync({ ...form, noticeDate });
        toast("success", "Notice created successfully.");
      }
      setFormOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

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
      if (n.status === "PUBLISHED") {
        await unpublishMutation.mutateAsync(n.id);
        toast("success", t("unpublishSuccess"));
      } else {
        await publishMutation.mutateAsync(n.id);
        toast("success", t("publishSuccess"));
      }
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Operation failed.");
    }
  };

  const handleDownload = async (n: Notice) => {
    try {
      setDownloadingId(n.id);
      const blob = await downloadNoticePdfApi(n.id);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Button onClick={openCreate} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {t("addNotice")}
        </Button>
      </div>

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
              <Button variant="outline" size="sm" onClick={openCreate} className="gap-1.5">
                <Plus className="h-4 w-4" />{t("addNotice")}
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
                              disabled={isMutating}
                            >
                              {publishMutation.isPending || unpublishMutation.isPending
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : notice.status === "PUBLISHED"
                                  ? <EyeOff className="h-3.5 w-3.5" />
                                  : <Globe className="h-3.5 w-3.5" />}
                              {notice.status === "PUBLISHED" ? t("unpublishNotice") : t("publishNotice")}
                            </Button>
                          )}

                          {/* Edit */}
                          <Button
                            size="sm" variant="outline" className="h-8 px-2.5 gap-1.5 text-xs"
                            onClick={() => openEdit(notice)} disabled={isMutating}
                          >
                            <Pencil className="h-3.5 w-3.5" />{t("editNotice")}
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

      {/* ── Create / Edit Dialog ────────────────────────────────── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              {editingNotice ? t("form.editTitle") : t("form.createTitle")}
            </DialogTitle>
            <DialogDescription>
              {editingNotice ? "Update the notice details below." : "Fill in the details to create a new notice."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                {t("form.subject")} <span className="text-destructive">*</span>
              </label>
              <Input placeholder={t("form.subjectPlaceholder")} value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t("form.category")}</label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as NoticeCategory }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{t(`category.${c}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t("form.status")}</label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as NoticeStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notice Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t("form.noticeDate")}</label>
              <Input type="date" value={form.noticeDate}
                onChange={(e) => setForm((f) => ({ ...f, noticeDate: e.target.value }))} />
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                {t("form.body")} <span className="text-destructive">*</span>
              </label>
              <Textarea placeholder={t("form.bodyPlaceholder")} value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={6} className="resize-y" />
              <p className="text-xs text-muted-foreground">HTML tags are supported in the body.</p>
            </div>

            {formError && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{formError}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setFormOpen(false)}
              disabled={createMutation.isPending || updateMutation.isPending}>
              {t("form.cancel")}
            </Button>
            <Button onClick={handleFormSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{t("form.saving")}</>
                : t("form.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />{t("deleteNotice")}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {t("confirmDelete")}
              {deleteTarget && (
                <span className="block mt-2 font-medium text-foreground">&ldquo;{deleteTarget.subject}&rdquo;</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>
              {t("form.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Deleting...</>
                : t("deleteNotice")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
