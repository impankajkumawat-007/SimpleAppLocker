import {NativeModules} from 'react-native';
import type {AppInfo} from '../types';

interface AppListModuleInterface {
  getInstalledApps(includeSystemApps: boolean): Promise<AppInfo[]>;
}

const {AppListModule} = NativeModules;

export default AppListModule as AppListModuleInterface;
