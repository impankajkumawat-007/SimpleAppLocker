import {NativeModules} from 'react-native';

interface LockedAppsModuleInterface {
  setLockedApps(packageNames: string[]): Promise<boolean>;
  getLockedApps(): Promise<string[]>;
  addLockedApp(packageName: string): Promise<boolean>;
  removeLockedApp(packageName: string): Promise<boolean>;
  isAppLocked(packageName: string): Promise<boolean>;
}

const {LockedAppsModule} = NativeModules;

export default LockedAppsModule as LockedAppsModuleInterface;
