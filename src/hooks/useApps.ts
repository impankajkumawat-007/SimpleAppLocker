import {useState, useEffect, useCallback} from 'react';
import {AppListModule, LockedAppsModule} from '../native';
import type {AppInfo, AppFilter} from '../types';

export function useApps() {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [lockedApps, setLockedApps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const [installedApps, locked] = await Promise.all([
        AppListModule.getInstalledApps(true),
        LockedAppsModule.getLockedApps(),
      ]);

      const sortedApps = installedApps.sort((a, b) =>
        a.appName.toLowerCase().localeCompare(b.appName.toLowerCase()),
      );

      setApps(sortedApps);
      setLockedApps(new Set(locked));
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const toggleLock = useCallback(
    async (packageName: string) => {
      const isLocked = lockedApps.has(packageName);

      try {
        if (isLocked) {
          await LockedAppsModule.removeLockedApp(packageName);
          setLockedApps(prev => {
            const next = new Set(prev);
            next.delete(packageName);
            return next;
          });
        } else {
          await LockedAppsModule.addLockedApp(packageName);
          setLockedApps(prev => new Set(prev).add(packageName));
        }
      } catch (error) {
        console.error('Failed to toggle lock:', error);
      }
    },
    [lockedApps],
  );

  const unlockAllApps = useCallback(async () => {
    try {
      await LockedAppsModule.setLockedApps([]);
      setLockedApps(new Set());
    } catch (error) {
      console.error('Failed to unlock all apps:', error);
    }
  }, []);

  const lockApps = useCallback(async (packageNames: string[]) => {
    try {
      const currentLocked = Array.from(lockedApps);
      const newLocked = [...new Set([...currentLocked, ...packageNames])];
      await LockedAppsModule.setLockedApps(newLocked);
      setLockedApps(new Set(newLocked));
    } catch (error) {
      console.error('Failed to lock apps:', error);
    }
  }, [lockedApps]);

  const unlockApps = useCallback(async (packageNames: string[]) => {
    try {
      const toRemove = new Set(packageNames);
      const newLocked = Array.from(lockedApps).filter(pkg => !toRemove.has(pkg));
      await LockedAppsModule.setLockedApps(newLocked);
      setLockedApps(new Set(newLocked));
    } catch (error) {
      console.error('Failed to unlock apps:', error);
    }
  }, [lockedApps]);

  const filteredApps = apps.filter(app => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'user' && !app.isSystemApp) ||
      (filter === 'system' && app.isSystemApp);

    const matchesSearch =
      searchQuery === '' ||
      app.appName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getLockedAppsInfo = useCallback(() => {
    return apps.filter(app => lockedApps.has(app.packageName));
  }, [apps, lockedApps]);

  return {
    apps: filteredApps,
    allApps: apps,
    lockedApps,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    toggleLock,
    unlockAllApps,
    lockApps,
    unlockApps,
    getLockedAppsInfo,
    refresh: loadApps,
  };
}
