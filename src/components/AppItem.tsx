import React, {memo} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import type {AppInfo} from '../types';

interface Props {
  app: AppInfo;
  isLocked: boolean;
  onToggle: (packageName: string) => void;
}

function AppItem({app, isLocked, onToggle}: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(app.packageName)}
      activeOpacity={0.7}>
      {app.icon ? (
        <Image
          source={{uri: `data:image/png;base64,${app.icon}`}}
          style={styles.icon}
        />
      ) : (
        <View style={[styles.icon, styles.defaultIcon]}>
          <Text style={styles.defaultIconText}>
            {app.appName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.appName} numberOfLines={1}>
          {app.appName}
        </Text>
        <Text style={styles.packageName} numberOfLines={1}>
          {app.packageName}
        </Text>
        {app.isSystemApp && <Text style={styles.systemBadge}>System</Text>}
      </View>
      <View style={[styles.lockIndicator, isLocked && styles.locked]}>
        <Text style={styles.lockIcon}>{isLocked ? '🔒' : '🔓'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  defaultIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366F1',
  },
  defaultIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  packageName: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  systemBadge: {
    fontSize: 10,
    color: '#FFFFFF',
    backgroundColor: '#888888',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  lockIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locked: {
    backgroundColor: '#E8F5E9',
  },
  lockIcon: {
    fontSize: 18,
  },
});

export default memo(AppItem);
