import AppRoutes from "@/app/routes"
import { ChatPopupProvider } from "@/features/chat/components/ChatPopupContext"
import { ChatPopup } from "@/features/chat/components/ChatPopup"

export default function App() {
  return (
    <ChatPopupProvider>
      <AppRoutes />
      <ChatPopup />
    </ChatPopupProvider>
  )
}
