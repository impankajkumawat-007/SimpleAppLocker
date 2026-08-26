import React, {useState} from 'react';
import {StatusBar, ActivityIndicator, View, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {usePermissions, useApps} from './src/hooks';
import {SetupScreen, AppListScreen, LockedAppsScreen} from './src/screens';
import {TabBar} from './src/components';
import type {TabId} from './src/components';

function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const {lockedApps} = useApps();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.screenContainer}>
        {activeTab === 'all' ? <AppListScreen /> : <LockedAppsScreen />}
      </View>
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lockedCount={lockedApps.size}
      />
    </View>
  );
}

function AppContent() {
  const {
    status,
    loading,
    allPermissionsGranted,
    openAccessibilitySettings,
    openOverlaySettings,
    openSecuritySettings,
  } = usePermissions();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!allPermissionsGranted) {
    return (
      <SetupScreen
        status={status}
        onOpenAccessibility={openAccessibilitySettings}
        onOpenOverlay={openOverlaySettings}
        onOpenSecurity={openSecuritySettings}
      />
    );
  }

  return <MainScreen />;
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  mainContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});

export default App;
