/**
 * pdf-download.ts
 *
 * Simple, reliable PDF utilities — no html2canvas, no color parsing issues.
 *
 *  - downloadReceiptAsPdf : draws the receipt directly with jsPDF text API
 *  - printNoticeDocument  : opens a clean print window for rich HTML content
 */

import type { AdmissionReceipt } from "@/types/admission";
import type { Notice } from "@/types/notice.types";

// ─── Shared helpers ────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
  return new Date(dateStr || Date.now()).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Receipt PDF ───────────────────────────────────────────────────────────────

/**
 * Builds and downloads the admission receipt as an A4 PDF.
 * Uses jsPDF's drawing API directly — no html2canvas, no CSS color issues.
 */
export async function downloadReceiptAsPdf(receipt: AdmissionReceipt) {
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210; // page width

  // ── Blue header ──
  pdf.setFillColor(29, 78, 216);
  pdf.rect(0, 0, W, 38, "F");

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(191, 219, 254);
  pdf.text("OFFICIAL RECEIPT", 20, 13);

  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("Dhaka Central Model School", 20, 23);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(191, 219, 254);
  pdf.text("Mirpur, Dhaka-1216  ·  admissions@dcms.edu.bd", 20, 31);

  // ── Receipt meta ──
  let y = 52;

  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(156, 163, 175);
  pdf.text("RECEIPT NO.", 20, y);
  pdf.text("DATE ISSUED", 90, y);
  pdf.text("STATUS", 162, y);

  y += 5;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(17, 24, 39);
  pdf.text(receipt.receiptNo || "—", 20, y);
  pdf.text(formatDate(receipt.issuedAt), 90, y);

  // Status pill
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(160, y - 5, 30, 7, 2, 2, "F");
  pdf.setFontSize(8);
  pdf.setTextColor(21, 128, 61);
  pdf.text(receipt.payment?.status || "PAID", 164, y);

  y += 10;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(20, y, 190, y);

  // ── Applicant ──
  y += 10;
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(156, 163, 175);
  pdf.text("APPLICANT", 20, y);

  y += 6;
  pdf.setFontSize(13);
  pdf.setTextColor(17, 24, 39);
  pdf.text(receipt.applicant?.fullName || "—", 20, y);

  y += 6;
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(107, 114, 128);
  pdf.text(receipt.applicant?.email || receipt.email || "—", 20, y);

  y += 5;
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(37, 99, 235);
  pdf.text(receipt.applicationNo || "—", 20, y);

  // ── Application details ──
  y += 12;
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(156, 163, 175);
  pdf.text("APPLICATION DETAILS", 20, y);

  y += 4;
  const detailRows: [string, string][] = [
    ["Class Applied For", receipt.applicant?.targetClassId || "—"],
    ["Phone",             receipt.applicant?.phone         || "—"],
    ["Father's Name",     receipt.applicant?.fatherName    || "—"],
    ["Mother's Name",     receipt.applicant?.motherName    || "—"],
    ["Review Status",     receipt.reviewStatus             || "—"],
  ];
  y = drawTable(pdf, detailRows, y);

  // ── Payment details ──
  y += 8;
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(156, 163, 175);
  pdf.text("PAYMENT DETAILS", 20, y);

  const method = receipt.payment?.cardType
    ? `${receipt.payment.provider} (${receipt.payment.cardType})`
    : receipt.payment?.provider || "—";

  y += 4;
  const paymentRows: [string, string][] = [
    ["Transaction ID",  receipt.payment?.tranId  || "—"],
    ["Payment Method",  method],
    ["Paid On",         formatDate(receipt.payment?.paidAt)],
    [`Amount (${receipt.payment?.currency || ""})`,
      Number(receipt.payment?.amount || 0).toFixed(2)],
  ];
  y = drawTable(pdf, paymentRows, y);

  // ── Footer ──
  pdf.setFillColor(249, 250, 251);
  pdf.rect(0, 277, W, 20, "F");
  pdf.setDrawColor(229, 231, 235);
  pdf.line(0, 277, W, 277);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(156, 163, 175);
  pdf.text(`Generated: ${new Date().toLocaleString("en-GB")}`, 20, 287);
  pdf.text("DCMS Admission System", 155, 287);

  pdf.save(`DCMS-Receipt-${receipt.applicationNo}.pdf`);
}

/** Draws a two-column label/value table and returns the new Y position. */
function drawTable(pdf: InstanceType<typeof import("jspdf").jsPDF>, rows: [string, string][], startY: number) {
  const rowH = 8;
  const tableH = rows.length * rowH + 4;

  pdf.setFillColor(249, 250, 251);
  pdf.setDrawColor(229, 231, 235);
  pdf.roundedRect(20, startY, 170, tableH, 2, 2, "FD");

  rows.forEach(([label, value], i) => {
    const ry = startY + 6 + i * rowH;

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(107, 114, 128);
    pdf.text(label, 25, ry);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(17, 24, 39);
    pdf.text(value, 120, ry);

    if (i < rows.length - 1) {
      pdf.setDrawColor(243, 244, 246);
      pdf.line(25, ry + 3, 185, ry + 3);
    }
  });

  return startY + tableH;
}

// ─── Notice print window ────────────────────────────────────────────────────────

/**
 * Opens a clean print window for a notice.
 * Uses the browser's native print-to-PDF — handles rich HTML perfectly.
 */
export function printNoticeDocument(notice: Notice) {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;

  const date = new Date(notice.noticeDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${notice.subject}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Georgia, serif;
      color: #111;
      background: white;
      padding: 20mm;
    }
    header {
      text-align: center;
      padding-bottom: 14px;
      border-bottom: 2px solid #111;
      margin-bottom: 20px;
    }
    header h1 {
      font-size: 22pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    header p {
      font-size: 10pt;
      color: #555;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .date { text-align: right; font-size: 11pt; margin-bottom: 18px; }
    .notice-label {
      text-align: center;
      margin-bottom: 18px;
    }
    .notice-label span {
      font-size: 13pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 6px;
      border-bottom: 2px solid #111;
      padding-bottom: 2px;
      padding-inline: 12px;
    }
    .subject {
      font-size: 13pt;
      font-weight: 700;
      margin-bottom: 24px;
      line-height: 1.4;
    }
    .body {
      font-size: 12pt;
      line-height: 1.85;
      text-align: justify;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Dhanbari Collegiate Model School</h1>
    <p>Dhanbari, Tangail</p>
  </header>
  <div class="date">Date: ${date}</div>
  <div class="notice-label"><span>Notice</span></div>
  <div class="subject"><strong>Subject:</strong> ${notice.subject}</div>
  <div class="body">${notice.body}</div>
  <script>
    window.onload = function () {
      window.print();
      window.onafterprint = function () { window.close(); };
    };
  </script>
</body>
</html>`);

  win.document.close();
}
