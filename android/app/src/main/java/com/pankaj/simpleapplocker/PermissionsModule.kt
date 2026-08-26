package com.pankaj.simpleapplocker

import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PermissionsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "PermissionsModule"

    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        try {
            val am = reactApplicationContext.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            val enabledServices = am.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK)

            for (service in enabledServices) {
                val serviceId = service.resolveInfo.serviceInfo.packageName + "/" + service.resolveInfo.serviceInfo.name
                if (serviceId.contains(reactApplicationContext.packageName)) {
                    promise.resolve(true)
                    return
                }
            }
            promise.resolve(false)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun openAccessibilitySettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun canDrawOverlays(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                promise.resolve(Settings.canDrawOverlays(reactApplicationContext))
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun openOverlaySettings(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + reactApplicationContext.packageName)
                )
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                reactApplicationContext.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun isDeviceSecure(promise: Promise) {
        try {
            val keyguardManager = reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as android.app.KeyguardManager
            promise.resolve(keyguardManager.isDeviceSecure)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun openSecuritySettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_SECURITY_SETTINGS)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
