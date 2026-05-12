import AppRoutes from "@/app/routes"
import { ChatPopupProvider } from "@/features/chat/components/ChatPopupContext"
import { ChatPopup } from "@/features/chat/components/ChatPopup"
import { ConfigProvider } from "antd"
import type { FormProps } from "antd"

/** Dấu * bắt buộc hiển thị sau nhãn, thống nhất toàn app (antd Form). */
const formRequiredMark: NonNullable<FormProps["requiredMark"]> = (label, { required }) => (
  <>
    {label}
    {required ? <span className="text-destructive"> *</span> : null}
  </>
)

const appFontStack =
  '"Inter",ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'

export default function App() {
  return (
    <ConfigProvider
      form={{ requiredMark: formRequiredMark }}
      wave={{ disabled: false }}
      theme={{
        token: {
          fontFamily: appFontStack,
        },
      }}
    >
      <ChatPopupProvider>
        <AppRoutes />
        <ChatPopup />
      </ChatPopupProvider>
    </ConfigProvider>
  )
}
