import { useCallback, useState } from "react"
import { message } from "antd"

import { ROLE } from "@/types/auth"
import { VI } from "@/shared/i18n/vi"
import { loginWithGoogle } from "@/services/authService"
import type { LoginFormValues } from "../types"
import { login } from "../api/auth.api"
import { saveAuth, getRoles } from "../services/tokenStorage"

export function useLogin() {
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const handleEmailLogin = useCallback(async (values: LoginFormValues): Promise<string[] | null> => {
    setSubmitting(true)
    setFormError("")
    
    console.log("🔐 Login attempt:", { usernameOrEmail: values.usernameOrEmail })
    
    try {
      // Call real login API
      const response = await login({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      })

      console.log("✅ Login response:", JSON.stringify(response))

      // Check response code (0 means success in this API)
      if (response.code !== 0) {
        console.warn("⚠️ Login failed with code:", response.code, response.message)
        setFormError(response.message || VI.auth.login.messages.loginFailed)
        return null
      }

      // Save token and decode roles
      if (!response.result.token) {
        console.error("❌ Login response missing token:", response.result)
        setFormError("Đăng nhập thất bại - không nhận được token!")
        return null
      }
      console.log("💾 About to save auth with rememberMe:", !!values.rememberMe)
      saveAuth(response.result, !!values.rememberMe)
      console.log("💾 After saveAuth - checking localStorage:")
      console.log("   cosmate_access_token:", localStorage.getItem('cosmate_access_token') ? "EXISTS ✓" : "MISSING ✗")
      console.log("💾 Token saved successfully")

      // Get user roles for redirect
      const roles = getRoles()
      console.log("👤 User roles:", roles)

      // Show success message
      message.success(VI.auth.login.messages.loginSuccess)

      // Return roles for redirect logic
      return roles
    } catch (error) {
      console.error("❌ Login error:", error)
      setFormError(VI.auth.login.messages.invalidCredentials)
      return null
    } finally {
      setSubmitting(false)
    }
  }, [])

  const handleGoogleLogin = useCallback(async () => {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error(error)
    } finally {
      setGoogleLoading(false)
    }
  }, [])

  return {
    submitting,
    googleLoading,
    formError,
    handleEmailLogin,
    handleGoogleLogin,
  }
}
