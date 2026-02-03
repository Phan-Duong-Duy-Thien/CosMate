export type LoginFormValues = {
  email: string
  password: string
}

export type EmailLoginPayload = {
  email: string
  password: string
}

export type RegisterFormValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export type EmailRegisterPayload = {
  fullName: string
  email: string
  password: string
}
