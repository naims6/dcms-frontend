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
};
