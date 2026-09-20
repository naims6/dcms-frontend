"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  Notice,
  NoticeCategory,
  NoticeStatus,
} from "@/types/notice.types";
import {
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
} from "@/hooks/queries/use-notice-queries";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/shared/Toast";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Megaphone,
  ArrowLeft,
  Save,
  Loader2,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────────────────────
const CATEGORIES: NoticeCategory[] = ["GENERAL", "SCHOLARSHIP", "JOB", "RESULT"];
const CREATE_STATUSES: NoticeStatus[] = ["DRAFT", "PUBLISHED"];

const CATEGORY_STYLES: Record<NoticeCategory, string> = {
  GENERAL: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  SCHOLARSHIP: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  JOB: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  RESULT: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
};

const STATUS_STYLES: Record<NoticeStatus, string> = {
  PUBLISHED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  DRAFT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  ARCHIVED: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

// ── Types ─────────────────────────────────────────────────────────────────
interface NoticeFormPageProps {
  mode: "create" | "edit";
  notice?: Notice | null;
}

export function NoticeFormPage({ mode, notice }: NoticeFormPageProps) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const { toast, toastState, dismiss } = useToast();

  const isEdit = mode === "edit";

  const todayISO = () => new Date().toISOString().split("T")[0];

  // ── Form state ───────────────────────────────────────────────
  const [subject, setSubject] = useState(notice?.subject ?? "");
  const [category, setCategory] = useState<NoticeCategory>(notice?.category ?? "GENERAL");
  const [status, setStatus] = useState<NoticeStatus>(notice?.status ?? "DRAFT");
  const [noticeDate, setNoticeDate] = useState(() =>
    notice?.noticeDate ? notice.noticeDate.split("T")[0] : todayISO(),
  );
  const [body, setBody] = useState(notice?.body ?? "");
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});

  const createMutation = useCreateNoticeMutation();
  const updateMutation = useUpdateNoticeMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  // ── Actions ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    const nextErrors: { subject?: string; body?: string } = {};
    if (!subject.trim()) nextErrors.subject = "Subject is required.";
    if (!stripHtml(body)) nextErrors.body = "Body is required.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    const noticeDateISO = new Date(noticeDate).toISOString();

    try {
      if (isEdit && notice) {
        await updateMutation.mutateAsync({
          id: notice.id,
          dto: {
            category,
            subject: subject.trim(),
            body: body.trim(),
            noticeDate: noticeDateISO,
          },
        });
        toast("success", "Notice updated successfully.");
      } else {
        await createMutation.mutateAsync({
          category,
          subject: subject.trim(),
          body: body.trim(),
          noticeDate: noticeDateISO,
          status,
        });
        toast("success", "Notice created successfully.");
      }
      router.push("/dashboard/notices");
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {toastState && <Toast state={toastState} onDismiss={dismiss} />}

      {/* ── Page header ──────────────────────────────────────── */}
      <DashboardPageHeader
        title={isEdit ? "Edit Notice" : "Create Notice"}
        description={
          isEdit
            ? "Update notice details and republish when ready."
            : "Compose a new notice and choose when to publish it."
        }
        icon={Megaphone}
        iconClassName="text-primary"
        actions={
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/dashboard/notices">
              <ArrowLeft className="h-4 w-4" />
              Back to Notices
            </Link>
          </Button>
        }
      />

      {/* ── Form + preview ────────────────────────────────────── */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Main form card */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Notice details</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {isEdit
                ? `Editing "${notice?.subject}"`
                : "Fill in the details below to draft a new notice."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Subject <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Annual Sports Day 2026"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={150}
                className="h-10 text-sm"
                autoFocus
              />
              <div className="flex items-center justify-between">
                {errors.subject ? (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.subject}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-[11px] text-muted-foreground">
                  {subject.length}/150
                </span>
              </div>
            </div>

            {/* Category / Status / Date */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Category</label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as NoticeCategory)}
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-sm">
                        {t(`category.${c}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Status</label>
                {isEdit ? (
                  <div className="flex h-10 items-center">
                    <Badge
                      variant="outline"
                      className={cn("gap-1 px-2.5 py-1 text-xs", STATUS_STYLES[notice?.status ?? "DRAFT"])}
                    >
                      {notice?.status}
                    </Badge>
                  </div>
                ) : (
                  <Select value={status} onValueChange={(v) => setStatus(v as NoticeStatus)}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CREATE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="text-sm">
                          {t(`status.${s}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Notice date</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={noticeDate}
                    onChange={(e) => setNoticeDate(e.target.value)}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Notice body <span className="text-destructive">*</span>
              </label>
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Write the full notice content here…"
                minHeight={240}
              />
              {errors.body && (
                <p className="flex items-center gap-1 text-[11px] text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.body}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Format your content with the toolbar — bold, lists, headings, links and more.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-2 border-t border-border/60 px-6 py-4">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link href="/dashboard/notices">Cancel</Link>
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isPending} className="min-w-[130px] gap-1.5">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEdit ? "Save Changes" : status === "PUBLISHED" ? "Create & Publish" : "Create Notice"}
            </Button>
          </CardFooter>
        </Card>

        {/* Preview panel */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <FileText className="h-4 w-4 text-primary" />
                Preview
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                Live preview of your notice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <span className="truncate">{subject.trim() || "Notice subject"}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={cn("px-2 py-0 text-[10px] font-bold", CATEGORY_STYLES[category])}
                >
                  {t(`category.${category}`)}
                </Badge>
                {!isEdit && (
                  <Badge
                    variant="outline"
                    className={cn("px-2 py-0 text-[10px] font-bold", STATUS_STYLES[status])}
                  >
                    {t(`status.${status}`)}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {noticeDate ? formatDate(noticeDate) : "No date set"}
              </p>

              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <div
                  className="notice-prose max-h-64 overflow-hidden text-sm"
                  dangerouslySetInnerHTML={{
                    __html: stripHtml(body) ? body : "<p>Your notice body will appear here…</p>",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}