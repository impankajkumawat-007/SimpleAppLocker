import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchBar, AppItem} from '../components';
import {useApps} from '../hooks';
import type {AppInfo} from '../types';

export function LockedAppsScreen() {
  const insets = useSafeAreaInsets();
  const {allApps, lockedApps, loading, toggleLock, unlockApps, refresh} =
    useApps();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());

  const lockedAppsInfo = useMemo(() => {
    return allApps
      .filter(app => lockedApps.has(app.packageName))
      .filter(
        app =>
          searchQuery === '' ||
          app.appName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [allApps, lockedApps, searchQuery]);

  const allSelected =
    lockedAppsInfo.length > 0 &&
    lockedAppsInfo.every(app => selectedApps.has(app.packageName));

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedApps(new Set());
    } else {
      setSelectedApps(new Set(lockedAppsInfo.map(app => app.packageName)));
    }
  }, [allSelected, lockedAppsInfo]);

  const toggleSelect = useCallback((packageName: string) => {
    setSelectedApps(prev => {
      const next = new Set(prev);
      if (next.has(packageName)) {
        next.delete(packageName);
      } else {
        next.add(packageName);
      }
      return next;
    });
  }, []);

  const handleUnlockSelected = useCallback(async () => {
    if (selectedApps.size > 0) {
      await unlockApps(Array.from(selectedApps));
      setSelectedApps(new Set());
    }
  }, [selectedApps, unlockApps]);

  const renderItem = useCallback(
    ({item}: {item: AppInfo}) => (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          selectedApps.has(item.packageName) && styles.itemSelected,
        ]}
        onPress={() => toggleSelect(item.packageName)}
        onLongPress={() => toggleLock(item.packageName)}>
        <AppItem app={item} isLocked={true} onToggle={toggleLock} />
      </TouchableOpacity>
    ),
    [selectedApps, toggleSelect, toggleLock],
  );

  const keyExtractor = useCallback((item: AppInfo) => item.packageName, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
        <Text style={styles.title}>Locked Apps</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{lockedApps.size} apps</Text>
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search locked apps..."
      />

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={toggleSelectAll}>
          <View
            style={[styles.checkbox, allSelected && styles.checkboxChecked]}>
            {allSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.selectAllText}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>

        {selectedApps.size > 0 && (
          <TouchableOpacity
            style={styles.unlockButton}
            onPress={handleUnlockSelected}>
            <Text style={styles.unlockButtonText}>
              Unlock ({selectedApps.size})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {lockedAppsInfo.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No locked apps match your search'
              : 'No apps are locked yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? 'Try a different search term'
              : 'Go to All Apps to lock some apps'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={lockedAppsInfo}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              colors={['#6366F1']}
            />
          }
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#6366F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#888888',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  unlockButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
  },
  itemSelected: {
    backgroundColor: '#EEF2FF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});
