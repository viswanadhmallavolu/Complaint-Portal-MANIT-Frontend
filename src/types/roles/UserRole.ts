export type BaseUserRole = 
  | 'student' 
  | 'admin' 
  | 'electric_admin' 
  | 'internet_admin' 
  | 'medical_admin'
  | 'cow'
  | `H${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}Admin`;

export type UserRole = BaseUserRole | null;

// Generate hostel admin roles dynamically
const generateHostelAdminRoles = () => {
  const roles: Record<string, string> = {};
  for (let i = 1; i <= 12; i++) {
    roles[`H${i}_ADMIN`] = `H${i}Admin`;
  }
  return roles;
};

export const USER_ROLES = {
  STUDENT: 'student' as const,
  ADMIN: 'admin' as const,
  ELECTRIC_ADMIN: 'electric_admin' as const,
  INTERNET_ADMIN: 'internet_admin' as const,
  MEDICAL_ADMIN: 'medical_admin' as const,
  COW: 'cow' as const,
  ...generateHostelAdminRoles()
};

const VALID_ROLES: BaseUserRole[] = Object.values(USER_ROLES);

export const isValidRole = (role: unknown): role is BaseUserRole =>
  typeof role === 'string' && VALID_ROLES.includes(role as BaseUserRole);