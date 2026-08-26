import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  lockedCount: number;
}

export function Header({lockedCount}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top + 12}]}>
      <Text style={styles.title}>App Locker</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{lockedCount} locked</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
