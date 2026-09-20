"use client";

import { useParams } from "next/navigation";
import { useNoticeDetailQuery } from "@/hooks/queries/use-notice-queries";
import { NoticeFormPage } from "@/components/dashboard/notices/notice-form-page";
import { Loader2, FileText } from "lucide-react";

export default function EditNoticePage() {
  const { id } = useParams<{ id: string }>();
  const { data: notice, isLoading, isError } = useNoticeDetailQuery(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !notice) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <FileText className="h-12 w-12 opacity-20" />
        <p className="text-sm">Failed to load this notice.</p>
      </div>
    );
  }

  return <NoticeFormPage mode="edit" notice={notice} />;
}