package com.pankaj.simpleapplocker

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AppLockerPackage : ReactPackage {
    @Suppress("OVERRIDE_DEPRECATION")
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            AppListModule(reactContext),
            LockedAppsModule(reactContext),
            PermissionsModule(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
