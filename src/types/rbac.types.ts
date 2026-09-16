export interface Permission {
  id: string;
  name: string;
  description: string | null;
}

export interface RolePermission {
  permission: Permission;
}

export interface SimpleRole {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions?: Permission[];
  _count?: {
    userRoles?: number;
  };
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionNames?: string[];
}

export interface UpdateRoleDto {
  description?: string;
  permissionNames?: string[];
}

export interface AssignRoleDto {
  roleId: string;
}

export interface UserWithRoles {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  status: string;
  roles: Array<string | SimpleRole>;
  permissions?: string[];
  createdAt?: string;
  studentProfile?: {
    id: string;
    studentId: string;
    classId: string | null;
    rollNumber: number | null;
    gender: string | null;
    status: string;
  } | null;
  teacherProfile?: {
    id: string;
    employeeId: string;
    gender: string | null;
    status: string;
  } | null;
}

export interface PaginatedUsersResponse {
  data: UserWithRoles[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
