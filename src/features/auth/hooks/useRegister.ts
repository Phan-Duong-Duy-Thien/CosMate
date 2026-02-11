import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { message } from "antd"

import type { UserRole } from "@/types/auth"
import { VI } from "@/shared/i18n/vi"
import type { RegisterFormValues } from "../types"
import { register } from "../api/auth.api"

export function useRegister(role: UserRole) {
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const navigate = useNavigate()

  const handleRegister = useCallback(async (values: RegisterFormValues) => {
    setSubmitting(true)
    setFormError("")
    
    console.log("📝 Register attempt:", { username: values.username, email: values.email, role })
    
    try {
      // Call real register API
      const response = await register({
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
        fullName: values.fullName,
        role,
      })

      console.log("✅ Register response:", response)

      // Check response code (0 means success)
      if (response.code !== 0) {
        console.warn("⚠️ Registration failed with code:", response.code, response.message)
        setFormError(response.message || VI.auth.register.messages.registrationFailed)
        return
      }

      console.log("🎉 Registration successful, navigating to login...")

      // Show success message
      message.success(VI.auth.register.messages.registrationSuccess)

      // Navigate to login page (no auto-login, no token in response)
      navigate("/login")
    } catch (error) {
      console.error("❌ Registration error:", error)
      setFormError(VI.auth.register.messages.unableToRegister)
    } finally {
      setSubmitting(false)
    }
  }, [role, navigate])

  return {
    submitting,
    formError,
    handleRegister,
  }
}
