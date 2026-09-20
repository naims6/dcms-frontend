import { apiClient } from "@/lib/apiClient";
import {
  Notice,
  PaginatedNoticesResponse,
  GetNoticesQueryParams,
  GetFeedQueryParams,
  NoticeCategory,
  CreateNoticeDto,
  UpdateNoticeDto,
} from "@/types/notice.types";

// ── Shared config ──────────────────────────────────────────────────────────

/** Default feed view (also the ISR snapshot the homepage pre-renders). */
export const PUBLIC_FEED_DEFAULTS = {
  page: 1,
  limit: 5,
  category: "GENERAL" as NoticeCategory,
};

// ── Helpers ───────────────────────────────────────────────────────────────

/** Convert a params object to a Record<string, string>, skipping undefined values. */
function toQuery(params: Record<string, string | number | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ) as Record<string, string>;
}

/** Normalise the raw response envelope into a PaginatedNoticesResponse. */
function toPaginated(raw: { data?: Notice[]; meta?: PaginatedNoticesResponse["meta"] }): PaginatedNoticesResponse {
  return {
    data: raw.data ?? [],
    meta: raw.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
}

// ── Dashboard API (/api/v1/notices — requires auth) ───────────────────────

/** GET /notices — all notices (DRAFT, PUBLISHED, ARCHIVED), paginated. */
export async function getNoticesApi(params?: GetNoticesQueryParams): Promise<PaginatedNoticesResponse> {
  const query = toQuery({
    page: params?.page,
    limit: params?.limit,
    category: params?.category,
    status: params?.status,
    search: params?.search,
  });
  const raw = await apiClient.getRaw<{ data: Notice[]; meta: PaginatedNoticesResponse["meta"] }>(
    "/notices",
    { params: Object.keys(query).length ? query : undefined },
  );
  return toPaginated(raw);
}

/** GET /notices/:id — single notice, any status. */
export async function getNoticeByIdApi(id: string): Promise<Notice> {
  return apiClient.get<Notice>(`/notices/${id}`);
}

/** POST /notices */
export async function createNoticeApi(dto: CreateNoticeDto): Promise<Notice> {
  return apiClient.post<Notice>("/notices", dto);
}

/** PATCH /notices/:id */
export async function updateNoticeApi(id: string, dto: UpdateNoticeDto): Promise<Notice> {
  return apiClient.patch<Notice>(`/notices/${id}`, dto);
}

/** PATCH /notices/:id/publish — DRAFT → PUBLISHED */
export async function publishNoticeApi(id: string): Promise<Notice> {
  return apiClient.patch<Notice>(`/notices/${id}/publish`, {});
}

/** PATCH /notices/:id/unpublish — PUBLISHED → DRAFT */
export async function unpublishNoticeApi(id: string): Promise<Notice> {
  return apiClient.patch<Notice>(`/notices/${id}/unpublish`, {});
}

/** DELETE /notices/:id */
export async function deleteNoticeApi(id: string): Promise<{ id: string }> {
  return apiClient.delete<{ id: string }>(`/notices/${id}`);
}

/** GET /notices/:id/download-pdf — binary PDF response */
export async function downloadNoticePdfApi(id: string): Promise<Blob> {
  return apiClient.getBlob(`/notices/${id}/download-pdf`);
}

// ── Public Feed API (/api/v1/notices/feed — no auth, PUBLISHED only) ──────

/**
 * GET /notices/feed — published notices only, paginated.
 *
 * Used by BOTH data flows, so it's the single source of truth:
 *  - server (ISR):  `await getNoticeFeedApi(PUBLIC_FEED_DEFAULTS)` in the page
 *  - client (query): `useNoticeFeedQuery(params)` → `getNoticeFeedApi(params)`
 *
 */
export async function getNoticeFeedApi(
  params?: GetFeedQueryParams,
  revalidate: number = 60,
): Promise<PaginatedNoticesResponse> {
  const query = toQuery({
    page: params?.page,
    limit: params?.limit,
    category: params?.category,
    search: params?.search,
  });
  const raw = await apiClient.getRaw<{ data: Notice[]; meta: PaginatedNoticesResponse["meta"] }>(
    "/notices/feed",
    {
      params: Object.keys(query).length ? query : undefined,
      next: { revalidate },
    },
  );
  return toPaginated(raw);
}

/** GET /notices/feed/:id — single published notice. Returns 404 for draft/archived. */
export async function getNoticeFeedByIdApi(id: string): Promise<Notice> {
  return apiClient.get<Notice>(`/notices/feed/${id}`);
}
