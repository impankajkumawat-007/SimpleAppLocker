import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type TabId = 'all' | 'locked';

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  lockedCount: number;
}

export function TabBar({activeTab, onTabChange, lockedCount}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom + 8}]}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
        onPress={() => onTabChange('all')}>
        <Text style={[styles.tabIcon, activeTab === 'all' && styles.activeTabIcon]}>
          📱
        </Text>
        <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
          All Apps
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'locked' && styles.activeTab]}
        onPress={() => onTabChange('locked')}>
        <View style={styles.tabIconContainer}>
          <Text style={[styles.tabIcon, activeTab === 'locked' && styles.activeTabIcon]}>
            🔒
          </Text>
          {lockedCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {lockedCount > 99 ? '99+' : lockedCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabText, activeTab === 'locked' && styles.activeTabText]}>
          Locked
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#6366F1',
    marginTop: -1,
  },
  tabIconContainer: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.5,
  },
  activeTabIcon: {
    opacity: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888888',
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
