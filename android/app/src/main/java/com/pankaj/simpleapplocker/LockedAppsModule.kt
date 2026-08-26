package com.pankaj.simpleapplocker

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableArray

class LockedAppsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val PREFS_NAME = "AppLockerPrefs"
        const val LOCKED_APPS_KEY = "locked_apps"
    }

    override fun getName(): String = "LockedAppsModule"

    private fun getPreferences(): SharedPreferences {
        return reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    @ReactMethod
    fun setLockedApps(packageNames: ReadableArray, promise: Promise) {
        try {
            val prefs = getPreferences()
            val editor = prefs.edit()
            val set = mutableSetOf<String>()

            for (i in 0 until packageNames.size()) {
                packageNames.getString(i)?.let { set.add(it) }
            }

            editor.putStringSet(LOCKED_APPS_KEY, set)
            editor.apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getLockedApps(promise: Promise) {
        try {
            val prefs = getPreferences()
            val set = prefs.getStringSet(LOCKED_APPS_KEY, emptySet()) ?: emptySet()
            val result: WritableArray = Arguments.createArray()

            for (packageName in set) {
                result.pushString(packageName)
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun addLockedApp(packageName: String, promise: Promise) {
        try {
            val prefs = getPreferences()
            val set = prefs.getStringSet(LOCKED_APPS_KEY, mutableSetOf())?.toMutableSet() ?: mutableSetOf()
            set.add(packageName)

            val editor = prefs.edit()
            editor.putStringSet(LOCKED_APPS_KEY, set)
            editor.apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun removeLockedApp(packageName: String, promise: Promise) {
        try {
            val prefs = getPreferences()
            val set = prefs.getStringSet(LOCKED_APPS_KEY, mutableSetOf())?.toMutableSet() ?: mutableSetOf()
            set.remove(packageName)

            val editor = prefs.edit()
            editor.putStringSet(LOCKED_APPS_KEY, set)
            editor.apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun isAppLocked(packageName: String, promise: Promise) {
        try {
            val prefs = getPreferences()
            val set = prefs.getStringSet(LOCKED_APPS_KEY, emptySet()) ?: emptySet()
            promise.resolve(set.contains(packageName))
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
