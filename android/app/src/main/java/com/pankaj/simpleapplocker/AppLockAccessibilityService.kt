package com.pankaj.simpleapplocker

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.view.accessibility.AccessibilityEvent

class AppLockAccessibilityService : AccessibilityService() {

    companion object {
        private const val PREFS_NAME = "AppLockerPrefs"
        private const val LOCKED_APPS_KEY = "locked_apps"
        private const val UNLOCKED_SESSION_KEY = "unlocked_session"
    }

    private var unlockedApps = mutableSetOf<String>()
    private var currentForegroundPackage: String? = null

    private val screenOffReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == Intent.ACTION_SCREEN_OFF) {
                unlockedApps.clear()
                saveUnlockedSession()
            }
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()

        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            notificationTimeout = 100
        }
        serviceInfo = info

        loadUnlockedSession()

        val filter = IntentFilter(Intent.ACTION_SCREEN_OFF)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(screenOffReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(screenOffReceiver, filter)
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            return
        }

        val packageName = event.packageName?.toString() ?: return

        if (packageName == applicationContext.packageName) {
            return
        }

        if (packageName == "com.android.systemui" ||
            packageName == "com.google.android.permissioncontroller" ||
            packageName.contains("launcher") ||
            packageName.contains("settings")) {
            return
        }

        if (packageName == currentForegroundPackage) {
            return
        }

        currentForegroundPackage = packageName

        if (isAppLocked(packageName) && !isAppUnlockedInSession(packageName)) {
            launchLockScreen(packageName)
        }
    }

    override fun onInterrupt() {
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(screenOffReceiver)
        } catch (e: Exception) {
        }
    }

    private fun isAppLocked(packageName: String): Boolean {
        val prefs = applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val lockedApps = prefs.getStringSet(LOCKED_APPS_KEY, emptySet()) ?: emptySet()
        return lockedApps.contains(packageName)
    }

    private fun isAppUnlockedInSession(packageName: String): Boolean {
        val prefs = applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val sessionUnlockedApps = prefs.getStringSet(UNLOCKED_SESSION_KEY, emptySet()) ?: emptySet()
        return sessionUnlockedApps.contains(packageName)
    }

    private fun launchLockScreen(packageName: String) {
        val intent = Intent(this, LockScreenActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            putExtra(LockScreenActivity.EXTRA_PACKAGE_NAME, packageName)
        }
        startActivity(intent)
    }

    fun onAppUnlocked(packageName: String) {
        unlockedApps.add(packageName)
        saveUnlockedSession()
    }

    private fun saveUnlockedSession() {
        val prefs = applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putStringSet(UNLOCKED_SESSION_KEY, unlockedApps).apply()
    }

    private fun loadUnlockedSession() {
        val prefs = applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        unlockedApps = prefs.getStringSet(UNLOCKED_SESSION_KEY, emptySet())?.toMutableSet() ?: mutableSetOf()
    }
}
