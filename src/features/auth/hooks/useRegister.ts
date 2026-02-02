import { useCallback, useState } from "react"

import { registerWithEmail } from "@/services/authService"
import type { RegisterFormValues } from "../types"

export function useRegister() {
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const handleRegister = useCallback(async (values: RegisterFormValues) => {
    setSubmitting(true)
    setFormError("")
    try {
      await registerWithEmail({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
    } catch (error) {
      console.error(error)
      setFormError("Unable to create account. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }, [])

  return {
    submitting,
    formError,
    handleRegister,
  }
}
