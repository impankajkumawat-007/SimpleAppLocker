import React, {useCallback} from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet, RefreshControl} from 'react-native';
import {Header, SearchBar, FilterTabs, AppItem} from '../components';
import {useApps} from '../hooks';
import type {AppInfo} from '../types';

export function AppListScreen() {
  const {
    apps,
    allApps,
    lockedApps,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    toggleLock,
    refresh,
  } = useApps();

  const counts = {
    all: allApps.length,
    user: allApps.filter(a => !a.isSystemApp).length,
    system: allApps.filter(a => a.isSystemApp).length,
  };

  const renderItem = useCallback(
    ({item}: {item: AppInfo}) => (
      <AppItem
        app={item}
        isLocked={lockedApps.has(item.packageName)}
        onToggle={toggleLock}
      />
    ),
    [lockedApps, toggleLock],
  );

  const keyExtractor = useCallback(
    (item: AppInfo) => item.packageName,
    [],
  );

  if (loading && allApps.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header lockedCount={lockedApps.size} />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FilterTabs
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />
      <FlatList
        data={apps}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});
