export interface AppInfo {
  packageName: string;
  appName: string;
  icon: string;
  isSystemApp: boolean;
}

export type AppFilter = 'all' | 'user' | 'system';
