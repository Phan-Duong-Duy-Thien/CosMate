import type { PoseReferenceItem } from "../types"

export const POSE_TIPS = [
  "Tip: Biểu cảm khuôn mặt quyết định 50% cái hồn nhân vật đó nha! 🐾",
  "Tip: Đừng quên ủi đồ cosplay trước khi pose dáng, nếp nhăn là kẻ thù của khung hình! 😸",
  "Tip: Make up đậm hơn bình thường một chút để lên ảnh không bị nhạt nhé! 🐾",
  "Tip: Hít một hơi thật sâu, thả lỏng vai và tự tin tỏa sáng nào! ✨😸",
  "Tip: Góc máy chụp từ dưới lên sẽ giúp chân bạn trông dài hơn đó! 🐾",
  "Tip: Tay đặt gần mặt và nghiêng cằm nhẹ sẽ giúp ảnh có chiều sâu hơn đó meow! 😺",
]

export const POSE_REFERENCE_LIST: PoseReferenceItem[] = [
  {
    id: "naruto-1",
    characterName: "Naruto",
    imageUrl: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sasuke-1",
    characterName: "Sasuke",
    imageUrl: "https://images.unsplash.com/photo-1612528443702-f6741f70a049?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hinata-1",
    characterName: "Hinata",
    imageUrl: "https://images.unsplash.com/photo-1542204637-e67bc7d41e48?auto=format&fit=crop&w=800&q=80",
  },
]

export const POSE_SCORE_ASSETS = {
  loading: "/src/assets/mascot-pose.png",
  bad: "/src/assets/mascot-pose-bad.png",
  good: "/src/assets/mascot-pose-good.png",
  veryGood: "/src/assets/mascot-pose-verygood.png",
  perfect: "/src/assets/mascot-pose-100.png",
}
