import { useCallback, useState } from "react"
import { message } from "antd"

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

      console.log("✅ Login response:", response)

      // Check response code (0 means success in this API)
      if (response.code !== 0) {
        console.warn("⚠️ Login failed with code:", response.code, response.message)
        setFormError(response.message || "Login failed. Please try again.")
        return null
      }

      // Save token and decode roles
      saveAuth(response.result)
      console.log("💾 Token saved successfully")

      // Get roles from decoded JWT
      const roles = getRoles()
      console.log("👤 User roles:", roles)

      // Show success message
      message.success("Login successful! Welcome back to CosMate 🎉")

      // Return roles for redirect logic
      return roles
    } catch (error) {
      console.error("❌ Login error:", error)
      setFormError("Unable to sign in. Please check your credentials and try again.")
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
