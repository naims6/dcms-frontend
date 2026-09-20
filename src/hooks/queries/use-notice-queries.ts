import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNoticesApi,
  getNoticeByIdApi,
  getNoticeFeedApi,
  getNoticeFeedByIdApi,
  createNoticeApi,
  updateNoticeApi,
  publishNoticeApi,
  unpublishNoticeApi,
  deleteNoticeApi,
  PUBLIC_FEED_DEFAULTS,
} from "@/services/notice.service";
import { queryKeys } from "@/lib/query-keys";
import {
  CreateNoticeDto,
  GetFeedQueryParams,
  GetNoticesQueryParams,
  PaginatedNoticesResponse,
  UpdateNoticeDto,
} from "@/types/notice.types";

// ── Dashboard queries (auth required, all statuses) ───────────────────────

/** Paginated list of all notices (DRAFT, PUBLISHED, ARCHIVED). */
export function useNoticesQuery(params?: GetNoticesQueryParams) {
  return useQuery({
    queryKey: queryKeys.notices.list(params as Record<string, unknown>),
    queryFn: () => getNoticesApi(params),
  });
}

/** Single notice by ID — any status. */
export function useNoticeDetailQuery(id: string | null) {
  return useQuery({
    queryKey: queryKeys.notices.detail(id ?? ""),
    queryFn: () => getNoticeByIdApi(id!),
    enabled: Boolean(id),
  });
}

// ── Public feed queries (no auth, PUBLISHED only) ─────────────────────────

// How long the feed stays "fresh" so the ISR snapshot isn't immediately
// re-fetched by every visitor's browser.
const FEED_STALE_TIME_MS = 60 * 1000;

/**
 * Paginated list of published notices — for the homepage / public notice board.
 *
 * `initialData` is the ISR snapshot passed down from the page. It's only used
 * while the board is in its default view (the exact params the server
 * pre-rendered); switching tabs/search/page still fetches fresh data.
 */
export function useNoticeFeedQuery(
  params?: GetFeedQueryParams,
  initialData?: PaginatedNoticesResponse,
) {
  const isDefaultView =
    (params?.page ?? PUBLIC_FEED_DEFAULTS.page) === PUBLIC_FEED_DEFAULTS.page &&
    (params?.limit ?? PUBLIC_FEED_DEFAULTS.limit) === PUBLIC_FEED_DEFAULTS.limit &&
    (params?.category ?? PUBLIC_FEED_DEFAULTS.category) === PUBLIC_FEED_DEFAULTS.category &&
    !params?.search;

  return useQuery({
    queryKey: queryKeys.notices.feed(params as Record<string, unknown>),
    queryFn: () => getNoticeFeedApi(params),
    initialData: isDefaultView ? initialData : undefined,
    staleTime: FEED_STALE_TIME_MS,
  });
}

/** Single published notice by ID — returns 404 for draft/archived. */
export function useNoticeFeedDetailQuery(id: string | null) {
  return useQuery({
    queryKey: queryKeys.notices.feedDetail(id ?? ""),
    queryFn: () => getNoticeFeedByIdApi(id!),
    enabled: Boolean(id),
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────

/** Create a new notice. */
export function useCreateNoticeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateNoticeDto) => createNoticeApi(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notices.all }),
  });
}

/** Update an existing notice. */
export function useUpdateNoticeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateNoticeDto }) => updateNoticeApi(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.notices.all });
      qc.invalidateQueries({ queryKey: queryKeys.notices.detail(id) });
    },
  });
}

/** Publish a notice (DRAFT → PUBLISHED). */
export function usePublishNoticeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishNoticeApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notices.all }),
  });
}

/** Unpublish a notice (PUBLISHED → DRAFT). */
export function useUnpublishNoticeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unpublishNoticeApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notices.all }),
  });
}

/** Delete a notice permanently. */
export function useDeleteNoticeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNoticeApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notices.all }),
  });
}
