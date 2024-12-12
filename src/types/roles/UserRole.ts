export type BaseUserRole = 'student' | 'admin';

export type UserRole = BaseUserRole | null;

export const isValidRole = (role: unknown): role is BaseUserRole => {
  return role === 'student' || role === 'admin';
};

export const USER_ROLES = {
  STUDENT: 'student' as const,
  ADMIN: 'admin' as const,
};