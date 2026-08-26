import {useState, useEffect, useCallback} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {PermissionsModule} from '../native';

export interface PermissionStatus {
  accessibilityEnabled: boolean;
  overlayEnabled: boolean;
  deviceSecure: boolean;
}

export function usePermissions() {
  const [status, setStatus] = useState<PermissionStatus>({
    accessibilityEnabled: false,
    overlayEnabled: false,
    deviceSecure: false,
  });
  const [loading, setLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    try {
      const [accessibilityEnabled, overlayEnabled, deviceSecure] =
        await Promise.all([
          PermissionsModule.isAccessibilityServiceEnabled(),
          PermissionsModule.canDrawOverlays(),
          PermissionsModule.isDeviceSecure(),
        ]);

      setStatus({accessibilityEnabled, overlayEnabled, deviceSecure});
    } catch (error) {
      console.error('Failed to check permissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPermissions();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [checkPermissions]);

  const openAccessibilitySettings = useCallback(async () => {
    await PermissionsModule.openAccessibilitySettings();
  }, []);

  const openOverlaySettings = useCallback(async () => {
    await PermissionsModule.openOverlaySettings();
  }, []);

  const openSecuritySettings = useCallback(async () => {
    await PermissionsModule.openSecuritySettings();
  }, []);

  const allPermissionsGranted =
    status.accessibilityEnabled && status.overlayEnabled && status.deviceSecure;

  return {
    status,
    loading,
    allPermissionsGranted,
    openAccessibilitySettings,
    openOverlaySettings,
    openSecuritySettings,
    refresh: checkPermissions,
  };
}
