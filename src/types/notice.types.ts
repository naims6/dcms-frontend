// ── Categories (matches backend enum exactly) ─────────────────────────────
export type NoticeCategory = "GENERAL" | "SCHOLARSHIP" | "JOB" | "RESULT";

// ── Statuses (matches backend enum exactly) ───────────────────────────────
export type NoticeStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// ── Core model ────────────────────────────────────────────────────────────
export interface Notice {
  id: string;
  category: NoticeCategory;
  subject: string;
  body: string;
  noticeDate: string;
  status: NoticeStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedNoticesResponse {
  data: Notice[];
  meta: NoticeMeta;
}

// ── Dashboard query params (supports all statuses + category + search) ────
export interface GetNoticesQueryParams {
  page?: number;
  limit?: number;
  category?: NoticeCategory;
  status?: NoticeStatus;
  search?: string;
}

// ── Public feed query params (no status filter — server always returns PUBLISHED) ──
export interface GetFeedQueryParams {
  page?: number;
  limit?: number;
  category?: NoticeCategory;
  search?: string;
}

// ── Mutation DTOs ─────────────────────────────────────────────────────────
export interface CreateNoticeDto {
  category: NoticeCategory;
  subject: string;
  body: string;
  noticeDate: string;
  status?: NoticeStatus;
}

export interface UpdateNoticeDto {
  category?: NoticeCategory;
  subject?: string;
  body?: string;
  noticeDate?: string;
}
