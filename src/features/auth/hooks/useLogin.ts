import { useCallback, useState } from "react"

import { loginWithEmail, loginWithGoogle } from "@/services/authService"
import type { LoginFormValues } from "../types"

export function useLogin() {
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const handleEmailLogin = useCallback(async (values: LoginFormValues) => {
    setSubmitting(true)
    setFormError("")
    try {
      await loginWithEmail(values)
    } catch (error) {
      console.error(error)
      setFormError("Unable to sign in. Please try again.")
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
