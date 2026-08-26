import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import type {AppFilter} from '../types';

interface Props {
  activeFilter: AppFilter;
  onFilterChange: (filter: AppFilter) => void;
  counts: {
    all: number;
    user: number;
    system: number;
  };
}

const filters: {key: AppFilter; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'user', label: 'User Apps'},
  {key: 'system', label: 'System Apps'},
];

export function FilterTabs({activeFilter, onFilterChange, counts}: Props) {
  return (
    <View style={styles.container}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.key}
          style={[styles.tab, activeFilter === filter.key && styles.activeTab]}
          onPress={() => onFilterChange(filter.key)}>
          <Text
            style={[
              styles.tabText,
              activeFilter === filter.key && styles.activeTabText,
            ]}>
            {filter.label}
          </Text>
          <Text
            style={[
              styles.count,
              activeFilter === filter.key && styles.activeCount,
            ]}>
            {counts[filter.key]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    marginLeft: 6,
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  activeCount: {
    color: '#6366F1',
    backgroundColor: '#FFFFFF',
  },
});
