import type { EmailLoginPayload } from "@/features/auth/types"
import type { EmailRegisterPayload } from "@/features/auth/types"

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function loginWithEmail(data: EmailLoginPayload): Promise<void> {
  await delay(600)
  console.log("loginWithEmail", data)
}

export async function loginWithGoogle(): Promise<void> {
  await delay(500)
  console.log("loginWithGoogle")
}

export async function registerWithEmail(data: EmailRegisterPayload): Promise<void> {
  await delay(700)
  console.log("registerWithEmail", data)
}
