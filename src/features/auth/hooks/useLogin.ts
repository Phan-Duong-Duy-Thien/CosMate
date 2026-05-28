import { useCallback, useState } from "react"
import { message } from "antd"

import { VI } from "@/shared/i18n/vi"
import type { LoginFormValues } from "../types"
import { googleLogin, login } from "../api/auth.api"
import { saveAuth, getRoles } from "../services/tokenStorage"
import { applyFieldErrors, extractFieldErrors } from "@/shared/utils/formValidationErrors"
import { extractApiErrorMessage } from "@/shared/utils/apiError"
import type { FormInstance } from "antd"

export function useLogin() {
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const handleEmailLogin = useCallback(async (values: LoginFormValues, form?: FormInstance<LoginFormValues>): Promise<string[] | null> => {
    setSubmitting(true)
    setFormError("")

    console.log("🔐 Login attempt:", { usernameOrEmail: values.usernameOrEmail })

    try {
      const response = await login({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      })

      console.log("✅ Login response:", JSON.stringify(response))

      if (response.code !== 0) {
        console.warn("⚠️ Login failed with code:", response.code, response.message)
        setFormError(response.message || VI.auth.login.messages.loginFailed)
        return null
      }

      if (!response.result.token) {
        console.error("❌ Login response missing token:", response.result)
        setFormError("Đăng nhập thất bại - không nhận được token!")
        return null
      }
      saveAuth(response.result, !!values.rememberMe)
      console.log("💾 Token saved successfully")

      const roles = getRoles()
      console.log("👤 User roles:", roles)

      message.success(VI.auth.login.messages.loginSuccess)

      return roles
    } catch (error: unknown) {
      console.error("❌ Login error:", error)
      const fieldErrors = extractFieldErrors(error)
      if (fieldErrors && form) {
        applyFieldErrors(form, fieldErrors)
        setFormError("")
        return null
      }
      setFormError(extractApiErrorMessage(error, VI.auth.login.messages.invalidCredentials))
      return null
    } finally {
      setSubmitting(false)
    }
  }, [])

  const handleGoogleLogin = useCallback(async (idToken: string): Promise<string[] | null> => {
    setSubmitting(true)
    setFormError("")

    try {
      const response = await googleLogin({
        idToken,
        code: "",
        redirectUri: "",
      })

      if (response.code !== 0) {
        setFormError(response.message || VI.auth.login.messages.loginFailed)
        return null
      }

      if (!response.result.token) {
        setFormError(VI.auth.login.messages.loginMissingToken)
        return null
      }

      // Google login is treated as persistent by default.
      saveAuth(response.result, true)
      const roles = getRoles()
      message.success(VI.auth.login.messages.loginSuccess)
      return roles
    } catch (error: unknown) {
      setFormError(extractApiErrorMessage(error, VI.auth.login.messages.invalidCredentials))
      return null
    } finally {
      setSubmitting(false)
    }
  }, [])

  return {
    submitting,
    formError,
    handleEmailLogin,
    handleGoogleLogin,
  }
}
