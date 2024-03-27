// export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  name?: string;
  nickname?: string;
  avatar?: string;
  introduction?: string;
  userId?: string;
  rooturl?: string;
  city?: string;
  company?: string;
  sessionTimeout?: boolean;
}
