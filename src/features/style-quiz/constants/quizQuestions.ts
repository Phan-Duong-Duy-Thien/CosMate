import type { QuizQuestion } from "../types"

export const STYLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    key: "favoriteColor",
    question: "Nếu linh hồn bạn có màu sắc, nó sẽ tỏa ra ánh sáng nào?",
    options: [
      { id: "q1-a", label: "Đỏ nhiệt huyết", value: "Đỏ nhiệt huyết", emoji: "🔥" },
      { id: "q1-b", label: "Xanh băng giá", value: "Xanh băng giá", emoji: "❄️" },
      { id: "q1-c", label: "Xanh lá chữa lành", value: "Xanh lá chữa lành", emoji: "🌿" },
      { id: "q1-d", label: "Vàng hoàng gia", value: "Vàng hoàng gia", emoji: "👑" },
    ],
  },
  {
    id: "q2",
    key: "style",
    question: "Vũ khí đầu tiên bạn chọn khi bị kẹt vào dị giới?",
    options: [
      { id: "q2-a", label: "Đại kiếm", value: "Đại kiếm", emoji: "⚔️" },
      { id: "q2-b", label: "Trượng phép", value: "Trượng phép", emoji: "🪄" },
      { id: "q2-c", label: "Súng ngắm", value: "Súng ngắm", emoji: "🎯" },
      { id: "q2-d", label: "Sách ma thuật", value: "Sách ma thuật", emoji: "📖" },
    ],
  },
  {
    id: "q3",
    key: "hobby",
    question: "Cuối tuần lý tưởng của bạn?",
    options: [
      { id: "q3-a", label: "Nằm nhà cày anime", value: "Nằm nhà cày anime", emoji: "📺" },
      { id: "q3-b", label: "Lên đồ đi Fes", value: "Lên đồ đi Fes", emoji: "🎉" },
      { id: "q3-c", label: "Chơi thể thao", value: "Chơi thể thao", emoji: "🏃" },
      { id: "q3-d", label: "Vẽ tranh viết lách", value: "Vẽ tranh viết lách", emoji: "🎨" },
    ],
  },
  {
    id: "q4",
    key: "budgetRange",
    question: "Tình trạng ngân khố của bạn?",
    options: [
      { id: "q4-a", label: "Sinh viên ăn mì tôm", value: "Sinh viên ăn mì tôm", emoji: "🍜" },
      { id: "q4-b", label: "Rủng rỉnh hầu bao", value: "Rủng rỉnh hầu bao", emoji: "💸" },
      { id: "q4-c", label: "Phú nhị đại", value: "Phú nhị đại", emoji: "💎" },
    ],
  },
  {
    id: "q5",
    key: "gender",
    question: "Bạn muốn giáng trần dưới hình hài nào?",
    options: [
      { id: "q5-a", label: "Husbando", value: "Husbando", emoji: "🕴️" },
      { id: "q5-b", label: "Waifu", value: "Waifu", emoji: "👸" },
      { id: "q5-c", label: "Phi giới tính", value: "Phi giới tính", emoji: "✨" },
    ],
  },
]
