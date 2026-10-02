"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { downloadNoticePdf } from "@/lib/pdf-download";
import { sanitizeHtml } from "@/lib/sanitize-html";
import type { Notice } from "@/types/notice.types";

const SERIF = "'Times New Roman', Georgia, 'Hind Siliguri', serif";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface NoticeViewPageProps {
  notice: Notice;
}

export function NoticeViewPage({ notice }: NoticeViewPageProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadNoticePdf(notice);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-background py-8 px-4">

      {/* Toolbar */}
      <div className="max-w-[794px] mx-auto mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Download PDF</span>
        </button>
      </div>

      {/* Notice paper preview */}
      <div
        className="max-w-[794px] mx-auto bg-white text-gray-900 border border-gray-200 shadow-md rounded-sm"
        style={{ minHeight: "1123px" }}
      >
        <div className="p-12 sm:p-16">

          {/* Letterhead */}
          <header className="text-center pb-5 border-b-2 border-gray-900">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-wide text-gray-900 uppercase"
              style={{ fontFamily: SERIF }}
            >
              Dhanbari Collegiate Model School
            </h1>
            <p
              className="text-xs sm:text-sm text-gray-600 tracking-wider uppercase mt-1 font-medium"
              style={{ fontFamily: SERIF }}
            >
              Dhanbari, Tangail
            </p>
          </header>

          {/* Date */}
          <div
            className="flex justify-end mt-5 mb-6 text-sm text-gray-700 font-medium"
            style={{ fontFamily: SERIF }}
          >
            Date: {formatDate(notice.noticeDate)}
          </div>

          {/* Notice heading */}
          <div className="text-center mb-6">
            <span
              className="inline-block text-base sm:text-lg font-bold uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-0.5 px-3"
              style={{ fontFamily: SERIF }}
            >
              Notice
            </span>
          </div>

          {/* Subject */}
          <div
            className="mb-8 text-[13pt] sm:text-[14pt] text-gray-900 leading-snug font-bold"
            style={{ fontFamily: SERIF }}
          >
            <span className="font-extrabold mr-2">Subject:</span>
            {notice.subject}
          </div>

          {/* Body */}
          <div
            className="notice-prose text-gray-800 text-[12pt] leading-[1.85] text-justify"
            style={{ fontFamily: SERIF }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(notice.body) }}
          />

        </div>
      </div>

    </div>
  );
}
