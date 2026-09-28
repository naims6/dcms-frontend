"use client";

import { useRouter } from "@/i18n/navigation";
import { Notice } from "@/types/notice.types";
import { useState } from "react";
import { downloadNoticePdfApi } from "@/services/notice.service";
import { ArrowLeft, Download, Loader2, Printer } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const SERIF_FONT = "'Times New Roman', Georgia, 'Hind Siliguri', serif";

interface NoticeViewPageProps {
  notice: Notice;
}

export function NoticeViewPage({ notice }: NoticeViewPageProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const blob = await downloadNoticePdfApi(notice.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${notice.subject.slice(0, 40).replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-background py-8 px-4 transition-colors duration-300 print:bg-white print:p-0 print:m-0">
      {/* Toolbar — hidden when printing */}
      <div className="max-w-[794px] mx-auto mb-4 flex items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
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
      </div>

      {/* A4 Paper / Document */}
      <div
        className="
          max-w-[794px] mx-auto
          bg-white text-gray-900 border border-gray-200/80 shadow-md
          dark:bg-card dark:text-card-foreground dark:border-border/60 dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]
          rounded-xs transition-colors duration-300
          print:bg-white! print:text-black! print:shadow-none! print:border-none! print:max-w-none! print:mx-0! print:rounded-none!
        "
        style={{ minHeight: "1123px" }}
      >
        <div className="p-12 sm:p-16 print:p-[20mm]">
          {/* Institutional Letterhead */}
          <header className="text-center pb-5 border-b-2 border-gray-900 dark:border-border print:border-black">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-wide text-gray-900 dark:text-foreground uppercase print:text-black"
              style={{ fontFamily: SERIF_FONT }}
            >
              Dhanbari Collegiate Model School
            </h1>
            <p
              className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground tracking-wider uppercase mt-1 font-medium print:text-black"
              style={{ fontFamily: SERIF_FONT }}
            >
              Dhanbari, Tangail
            </p>
          </header>

          {/* Date Row */}
          <div
            className="flex justify-end items-center mt-5 mb-6 text-sm text-gray-700 dark:text-muted-foreground font-medium print:text-black"
            style={{ fontFamily: SERIF_FONT }}
          >
            <span>Date: {formatDate(notice.noticeDate)}</span>
          </div>

          {/* Notice Heading */}
          <div className="text-center mb-6">
            <span
              className="inline-block text-base sm:text-lg font-bold uppercase tracking-[0.25em] text-gray-900 dark:text-foreground border-b-2 border-gray-900 dark:border-foreground pb-0.5 px-3 print:text-black print:border-black"
              style={{ fontFamily: SERIF_FONT }}
            >
              Notice
            </span>
          </div>

          {/* Subject Line */}
          <div
            className="mb-8 text-[13pt] sm:text-[14pt] text-gray-900 dark:text-foreground leading-snug font-bold print:text-black"
            style={{ fontFamily: SERIF_FONT }}
          >
            <span className="font-extrabold mr-2">Subject:</span>
            <span>{notice.subject}</span>
          </div>

          {/* Notice Body */}
          <div
            className="notice-prose text-gray-800 dark:text-foreground/90 text-[12pt] leading-[1.85] text-justify print:text-black"
            style={{ fontFamily: SERIF_FONT }}
            dangerouslySetInnerHTML={{ __html: notice.body }}
          />
        </div>
      </div>
    </div>
  );
}
