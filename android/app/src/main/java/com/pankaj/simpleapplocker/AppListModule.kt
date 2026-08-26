package com.pankaj.simpleapplocker

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import java.io.ByteArrayOutputStream

class AppListModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppListModule"

    @ReactMethod
    fun getInstalledApps(includeSystemApps: Boolean, promise: Promise) {
        try {
            val packageManager = reactApplicationContext.packageManager
            val apps = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
            val result: WritableArray = Arguments.createArray()

            for (app in apps) {
                val isSystemApp = (app.flags and ApplicationInfo.FLAG_SYSTEM) != 0

                if (!includeSystemApps && isSystemApp) {
                    continue
                }

                if (app.packageName == reactApplicationContext.packageName) {
                    continue
                }

                val appInfo: WritableMap = Arguments.createMap()
                appInfo.putString("packageName", app.packageName)
                appInfo.putString("appName", packageManager.getApplicationLabel(app).toString())
                appInfo.putBoolean("isSystemApp", isSystemApp)

                try {
                    val icon = packageManager.getApplicationIcon(app.packageName)
                    val iconBase64 = drawableToBase64(icon)
                    appInfo.putString("icon", iconBase64)
                } catch (e: Exception) {
                    appInfo.putString("icon", "")
                }

                result.pushMap(appInfo)
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    private fun drawableToBase64(drawable: Drawable): String {
        val bitmap = drawableToBitmap(drawable)
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 70, outputStream)
        val byteArray = outputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.NO_WRAP)
    }

    private fun drawableToBitmap(drawable: Drawable): Bitmap {
        if (drawable is BitmapDrawable) {
            return drawable.bitmap
        }

        val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 48
        val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 48

        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)

        return bitmap
    }
}
