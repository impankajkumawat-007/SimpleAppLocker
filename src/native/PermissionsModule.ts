import {NativeModules} from 'react-native';

interface PermissionsModuleInterface {
  isAccessibilityServiceEnabled(): Promise<boolean>;
  openAccessibilitySettings(): Promise<boolean>;
  canDrawOverlays(): Promise<boolean>;
  openOverlaySettings(): Promise<boolean>;
  isDeviceSecure(): Promise<boolean>;
  openSecuritySettings(): Promise<boolean>;
}

const {PermissionsModule} = NativeModules;

export default PermissionsModule as PermissionsModuleInterface;
