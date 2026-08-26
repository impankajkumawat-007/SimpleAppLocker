package com.pankaj.simpleapplocker

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

class LockScreenActivity : FragmentActivity() {

    companion object {
        const val EXTRA_PACKAGE_NAME = "extra_package_name"
        private const val PREFS_NAME = "AppLockerPrefs"
        private const val UNLOCKED_SESSION_KEY = "unlocked_session"
    }

    private var lockedPackageName: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }

        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        lockedPackageName = intent.getStringExtra(EXTRA_PACKAGE_NAME)

        if (lockedPackageName == null) {
            finish()
            return
        }

        showBiometricPrompt()
    }

    private fun showBiometricPrompt() {
        val executor = ContextCompat.getMainExecutor(this)

        val biometricManager = BiometricManager.from(this)
        val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or
                BiometricManager.Authenticators.BIOMETRIC_WEAK or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL

        when (biometricManager.canAuthenticate(authenticators)) {
            BiometricManager.BIOMETRIC_SUCCESS -> {
            }
            BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE,
            BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE,
            BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                goToHome()
                return
            }
            else -> {
            }
        }

        val callback = object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                if (errorCode == BiometricPrompt.ERROR_USER_CANCELED ||
                    errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON ||
                    errorCode == BiometricPrompt.ERROR_CANCELED) {
                    goToHome()
                } else {
                    goToHome()
                }
            }

            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                onUnlockSuccess()
            }

            override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
            }
        }

        val biometricPrompt = BiometricPrompt(this, executor, callback)

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle(getString(R.string.lock_screen_title))
            .setSubtitle(getString(R.string.lock_screen_subtitle))
            .setAllowedAuthenticators(authenticators)
            .build()

        biometricPrompt.authenticate(promptInfo)
    }

    private fun onUnlockSuccess() {
        lockedPackageName?.let { packageName ->
            addToUnlockedSession(packageName)
        }
        finish()
    }

    private fun addToUnlockedSession(packageName: String) {
        val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val unlockedApps = prefs.getStringSet(UNLOCKED_SESSION_KEY, mutableSetOf())?.toMutableSet() ?: mutableSetOf()
        unlockedApps.add(packageName)
        prefs.edit().putStringSet(UNLOCKED_SESSION_KEY, unlockedApps).apply()
    }

    private fun goToHome() {
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        startActivity(intent)
        finish()
    }

    override fun onBackPressed() {
        goToHome()
    }
}
