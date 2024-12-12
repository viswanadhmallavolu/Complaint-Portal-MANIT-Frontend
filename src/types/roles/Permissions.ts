import { BaseUserRole, USER_ROLES } from './UserRole';

export type Permission = 
  | 'view:complaints'
  | 'create:complaints'
  | 'manage:complaints'
  | 'view:dashboard'
  | 'manage:profile';

export const ROLE_PERMISSIONS: Record<BaseUserRole, Permission[]> = {
  [USER_ROLES.STUDENT]: [
    'view:complaints',
    'create:complaints',
    'manage:profile'
  ],
  [USER_ROLES.ADMIN]: [
    'view:complaints',
    'manage:complaints',
    'view:dashboard'
  ],
};