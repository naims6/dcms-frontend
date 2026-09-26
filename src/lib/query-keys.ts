export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: Record<string, unknown>) => ["users", "list", params || {}] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  rbac: {
    all: ["rbac"] as const,
    roles: () => ["rbac", "roles"] as const,
    roleDetail: (id: string) => ["rbac", "roles", id] as const,
    permissions: () => ["rbac", "permissions"] as const,
  },
  notices: {
    all: ["notices"] as const,
    list: (params?: Record<string, unknown>) => ["notices", "list", params || {}] as const,
    detail: (id: string) => ["notices", "detail", id] as const,
    feed: (params?: Record<string, unknown>) => ["notices", "feed", params || {}] as const,
    feedDetail: (id: string) => ["notices", "feed", id] as const,
  },
  students: {
    all: ["students"] as const,
    list: (params?: Record<string, unknown>) => ["students", "list", params || {}] as const,
    detail: (id: string) => ["students", "detail", id] as const,
  },
  classes: {
    all: ["classes"] as const,
    list: () => ["classes", "list"] as const,
  },
};
