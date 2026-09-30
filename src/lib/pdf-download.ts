/**
 * pdf-download.ts
 *
 * Lightweight, direct PDF generation system using jsPDF.
 * - No html2canvas or CSS color parsing (no "lab"/"oklch" bugs).
 * - Fast, 100% client-side generation without server round-trips.
 * - Reusable across all documents (receipts, notices, reports).
 */

import type { AdmissionReceipt } from "@/types/admission";
import type { Notice } from "@/types/notice.types";

// ─── Formatters ─────────────────────────────────────────────────────────────

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount?: number | null, currency = "BDT"): string {
  const value = Number(amount || 0).toFixed(2);
  return `${currency} ${value}`;
}

/** Converts rich HTML from Tiptap/WYSIWYG into clean plain text blocks */
function htmlToParagraphs(html: string): string[] {
  if (!html) return [];

  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "•  ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// ─── Reusable Table Drawer ──────────────────────────────────────────────────

function drawKeyValueTable(
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
  rows: [string, string][],
  startY: number,
  contentWidth: number,
  startX: number
): number {
  const rowHeight = 6.5;
  const tableHeight = rows.length * rowHeight + 3;

  // Background box with border
  pdf.setFillColor(249, 250, 251);
  pdf.setDrawColor(229, 231, 235);
  pdf.roundedRect(startX, startY, contentWidth, tableHeight, 1.5, 1.5, "FD");

  rows.forEach(([label, value], index) => {
    const rowY = startY + 5 + index * rowHeight;

    // Label (left-aligned)
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(107, 114, 128);
    pdf.text(label, startX + 4, rowY);

    // Value (right-aligned)
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(17, 24, 39);
    pdf.text(value, startX + contentWidth - 4, rowY, { align: "right" });

    // Inner divider line
    if (index < rows.length - 1) {
      pdf.setDrawColor(243, 244, 246);
      pdf.line(startX + 3, rowY + 2, startX + contentWidth - 3, rowY + 2);
    }
  });

  return startY + tableHeight;
}

// ─── 1. Admission Receipt PDF (Compact A5 Voucher Size) ────────────────────

export interface DownloadReceiptOptions {
  className?: string; // Human-readable class name (e.g. "Class 6")
}

/**
 * Generates and downloads a compact A5 admission voucher / receipt.
 * Dedicated slip size (148mm × 210mm) eliminates empty A4 space.
 */
export async function downloadReceiptAsPdf(
  receipt: AdmissionReceipt,
  options?: DownloadReceiptOptions
): Promise<void> {
  const { jsPDF } = await import("jspdf");

  // A5 dimensions: 148mm × 210mm
  const pdf = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });
  const pageWidth = 148;
  const pageHeight = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 120mm

  // 1. Header banner (DCMS Blue)
  pdf.setFillColor(29, 78, 216);
  pdf.rect(0, 0, pageWidth, 32, "F");

  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(191, 219, 254);
  pdf.text("OFFICIAL RECEIPT", margin, 11);

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("Dhaka Central Model School", margin, 19);

  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(191, 219, 254);
  pdf.text("Mirpur, Dhaka-1216  ·  admissions@dcms.edu.bd", margin, 26);

  // 2. Receipt metadata row
  let y = 42;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(156, 163, 175);
  pdf.text("RECEIPT NO.", margin, y);
  pdf.text("DATE ISSUED", margin + 44, y);
  pdf.text("STATUS", pageWidth - margin - 22, y);

  y += 5;
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(17, 24, 39);
  pdf.text(receipt.receiptNo || "—", margin, y);
  pdf.text(formatDate(receipt.issuedAt), margin + 44, y);

  // Status badge
  const status = receipt.payment?.status || "PAID";
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(pageWidth - margin - 24, y - 4.5, 24, 6, 1.5, 1.5, "F");
  pdf.setFontSize(7.5);
  pdf.setTextColor(21, 128, 61);
  pdf.text(status, pageWidth - margin - 12, y - 0.5, { align: "center" });

  y += 8;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(margin, y, pageWidth - margin, y);

  // 3. Applicant Information
  y += 8;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(156, 163, 175);
  pdf.text("APPLICANT", margin, y);

  y += 5;
  pdf.setFontSize(11);
  pdf.setTextColor(17, 24, 39);
  pdf.text(receipt.applicant?.fullName || "—", margin, y);

  y += 4.5;
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(107, 114, 128);
  pdf.text(receipt.applicant?.email || receipt.email || "—", margin, y);

  y += 4;
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(37, 99, 235);
  pdf.text(receipt.applicationNo || "—", margin, y);

  // 4. Application Details Table
  y += 8;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(156, 163, 175);
  pdf.text("APPLICATION DETAILS", margin, y);

  y += 3;
  const targetClass = options?.className || receipt.applicant?.targetClassId || "—";
  const applicationRows: [string, string][] = [
    ["Class Applied For", targetClass],
    ["Phone",             receipt.applicant?.phone         || "—"],
    ["Father's Name",     receipt.applicant?.fatherName    || "—"],
    ["Mother's Name",     receipt.applicant?.motherName    || "—"],
    ["Review Status",     receipt.reviewStatus             || "—"],
  ];
  y = drawKeyValueTable(pdf, applicationRows, y, contentWidth, margin);

  // 5. Payment Details Table
  y += 6;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(156, 163, 175);
  pdf.text("PAYMENT DETAILS", margin, y);

  y += 3;
  const paymentMethod = receipt.payment?.cardType
    ? `${receipt.payment.provider} (${receipt.payment.cardType})`
    : receipt.payment?.provider || "—";

  const paymentRows: [string, string][] = [
    ["Transaction ID",  receipt.payment?.tranId || "—"],
    ["Payment Method",  paymentMethod],
    ["Paid On",         formatDate(receipt.payment?.paidAt)],
    ["Amount Paid",     formatCurrency(receipt.payment?.amount, receipt.payment?.currency)],
  ];
  y = drawKeyValueTable(pdf, paymentRows, y, contentWidth, margin);

  // 6. Footer (pinned to bottom of A5 slip)
  pdf.setFillColor(249, 250, 251);
  pdf.rect(0, pageHeight - 14, pageWidth, 14, "F");
  pdf.setDrawColor(229, 231, 235);
  pdf.line(0, pageHeight - 14, pageWidth, pageHeight - 14);

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(156, 163, 175);
  pdf.text(`Generated: ${new Date().toLocaleString("en-GB")}`, margin, pageHeight - 5.5);
  pdf.text("DCMS Admission System", pageWidth - margin, pageHeight - 5.5, { align: "right" });

  pdf.save(`DCMS-Receipt-${receipt.applicationNo || receipt.receiptNo}.pdf`);
}

// ─── 2. Notice PDF (Standard A4 Letterhead Direct Download) ─────────────────

/**
 * Directly downloads an official school notice as an A4 PDF.
 * Formatted as official school circular with letterhead, date, subject, and body.
 */
export async function downloadNoticePdf(notice: Notice): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2; // 170mm

  let y = 24;

  // 1. Institutional Letterhead Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(17, 24, 39);
  pdf.text("Dhanbari Collegiate Model School", pageWidth / 2, y, { align: "center" });

  y += 6.5;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(107, 114, 128);
  pdf.text("Dhanbari, Tangail", pageWidth / 2, y, { align: "center" });

  y += 5.5;
  pdf.setDrawColor(31, 41, 55);
  pdf.setLineWidth(0.4);
  pdf.line(margin, y, pageWidth - margin, y);

  // 2. Date row
  y += 9;
  pdf.setFontSize(9.5);
  pdf.setTextColor(75, 85, 99);
  pdf.text(`Date: ${formatDate(notice.noticeDate)}`, pageWidth - margin, y, { align: "right" });

  // 3. NOTICE Title Badge
  y += 11;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(17, 24, 39);
  pdf.text("NOTICE", pageWidth / 2, y, { align: "center" });

  // Underline beneath NOTICE
  const titleWidth = pdf.getTextWidth("NOTICE");
  pdf.setLineWidth(0.5);
  pdf.line(pageWidth / 2 - titleWidth / 2 - 4, y + 2, pageWidth / 2 + titleWidth / 2 + 4, y + 2);

  // 4. Subject line
  y += 13;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(17, 24, 39);
  const subjectLines = pdf.splitTextToSize(`Subject: ${notice.subject}`, contentWidth);
  pdf.text(subjectLines, margin, y);
  y += subjectLines.length * 6 + 4;

  // 5. Notice Body Paragraphs
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(31, 41, 55);

  const paragraphs = htmlToParagraphs(notice.body);

  for (const para of paragraphs) {
    const lines = pdf.splitTextToSize(para, contentWidth);
    const blockHeight = lines.length * 5.5;

    // Check page break
    if (y + blockHeight > pageHeight - margin - 15) {
      pdf.addPage();
      y = margin;
    }

    pdf.text(lines, margin, y);
    y += blockHeight + 4;
  }

  // File slug
  const filename = `${notice.subject.slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, "_") || "Notice"}.pdf`;
  pdf.save(filename);
}
