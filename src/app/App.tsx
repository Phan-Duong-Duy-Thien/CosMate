import AppRoutes from "@/app/routes"
import { ChatPopupProvider } from "@/features/chat/components/ChatPopupContext"
import { ChatPopup } from "@/features/chat/components/ChatPopup"
import { ConfigProvider } from "antd"

export default function App() {
  return (
    <ConfigProvider
      wave={{ disabled: false }}
    >
      <ChatPopupProvider>
        <AppRoutes />
        <ChatPopup />
      </ChatPopupProvider>
    </ConfigProvider>
  )
}
