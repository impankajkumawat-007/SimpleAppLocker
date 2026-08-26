import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface Props {
  title: string;
  description: string;
  isGranted: boolean;
  onPress: () => void;
}

export function PermissionCard({title, description, isGranted, onPress}: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, isGranted && styles.granted]}
      onPress={onPress}
      disabled={isGranted}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.status, isGranted && styles.statusGranted]}>
            <Text style={[styles.statusText, isGranted && styles.statusTextGranted]}>
              {isGranted ? 'Granted' : 'Required'}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
      {!isGranted && (
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  granted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  status: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FF9800',
  },
  statusGranted: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusTextGranted: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  arrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 20,
    color: '#FF9800',
  },
});
