import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PermissionCard} from '../components';
import type {PermissionStatus} from '../hooks/usePermissions';

interface Props {
  status: PermissionStatus;
  onOpenAccessibility: () => void;
  onOpenOverlay: () => void;
  onOpenSecurity: () => void;
}

export function SetupScreen({
  status,
  onOpenAccessibility,
  onOpenOverlay,
  onOpenSecurity,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 20}]}>
        <Text style={styles.title}>Setup Required</Text>
        <Text style={styles.subtitle}>
          Please grant the following permissions to enable app locking
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <PermissionCard
          title="Device Lock"
          description="A PIN, pattern, or password must be set on your device to use App Locker."
          isGranted={status.deviceSecure}
          onPress={onOpenSecurity}
        />

        <PermissionCard
          title="Accessibility Service"
          description="Required to detect when apps are opened. Find 'Simple App Locker' in the list and enable it."
          isGranted={status.accessibilityEnabled}
          onPress={onOpenAccessibility}
        />

        <PermissionCard
          title="Display Over Other Apps"
          description="Required to show the lock screen when a protected app is opened."
          isGranted={status.overlayEnabled}
          onPress={onOpenOverlay}
        />
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 16}]}>
        <Text style={styles.footerText}>
          Tap on each permission to open its settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#F5F5F5',
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});
