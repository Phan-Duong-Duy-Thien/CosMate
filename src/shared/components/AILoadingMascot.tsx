import { Typography } from "antd"
import aiMascot from "@/assets/ai-mascot.png"

const { Text } = Typography

interface AILoadingMascotProps {
  text?: string
}

export default function AILoadingMascot({ text = "Bé Mèo AI đang suy nghĩ..." }: AILoadingMascotProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <img
        src={aiMascot}
        alt="AI Mascot"
        className="h-28 w-28 animate-bounce object-contain [animation-duration:1.6s]"
      />
      <Text className="text-sm font-medium text-pink-500">
        {text}
      </Text>
    </div>
  )
}
