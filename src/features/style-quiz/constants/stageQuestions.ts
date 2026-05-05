import type { Stage1Question, Stage2Question } from "../types"

export const FALLBACK_STAGE1_QUESTIONS: Stage1Question[] = [
  {
    question_id: "S1_Q1",
    question: "Lý do lớn nhất khiến bạn quyết định 'chốt sổ' cos một nhân vật là gì?",
    options: [
      { text: "Thiết kế quá đỉnh, thử thách làm đồ.", scores: { E: -1, A: -1, O: -1 } },
      { text: "Nhân vật đang hot, ra Fes có ngàn tấm ảnh xịn.", scores: { E: 2, A: 0, O: 1 } },
      { text: "Đồng điệu mãnh liệt về nội tâm.", scores: { E: -1, A: 2, O: 0 } },
      { text: "Nhóm rủ chạy project chung cho đủ mâm.", scores: { E: 1, A: 1, O: 1 } },
    ],
  },
  {
    question_id: "S1_Q2",
    question: "Quan điểm của bạn về độ 'Chuẩn Auth' (Canon) khi hóa thân?",
    options: [
      { text: "Giống 100% bản gốc, sai một ly đi một dặm.", scores: { E: 0, A: -1, O: -2 } },
      { text: "Giống 70-80% là được, quan trọng thần thái.", scores: { E: 0, A: 1, O: 1 } },
      { text: "Thích sáng tạo (AU), phá cách khác bản gốc.", scores: { E: 1, A: 0, O: 2 } },
    ],
  },
  {
    question_id: "S1_Q3",
    question: "Đêm trước ngày đi Fes, tình trạng của bạn thường là?",
    options: [
      { text: "Đồ đạc xếp sẵn từ 2 ngày trước, đắp mặt nạ ngủ sớm.", scores: { E: 0, A: 0, O: -2 } },
      { text: "Thức trắng đêm cày deadline, sửa đồ phút 89.", scores: { E: 0, A: 1, O: 2 } },
    ],
  },
  {
    question_id: "S1_Q4",
    question: "Đang đi Fes thì một phụ kiện đột nhiên gãy/rớt. Phản ứng của bạn?",
    options: [
      { text: "Đứng hình, hoảng loạn đi tìm bạn bè cầu cứu.", scores: { E: 0, A: 2, O: 0 } },
      { text: "Lôi đồ nghề thủ sẵn trong túi ra 'fix' ngay.", scores: { E: 0, A: -2, O: -1 } },
      { text: "Kệ nó luôn, tháo cho cân, diễn nét ngầu.", scores: { E: 0, A: 1, O: 1 } },
    ],
  },
  {
    question_id: "S1_Q5",
    question: "Có một nháy lạ mặt đến xin chụp ảnh bạn, bạn sẽ:",
    options: [
      { text: "Mừng húm, tạo đủ dáng bốc lửa, tương tác cực mạnh.", scores: { E: 2, A: 0, O: 0 } },
      { text: "Hơi ngại, tạo vài dáng an toàn, chuẩn mực.", scores: { E: -1, A: 0, O: -1 } },
      { text: "Hỏi kỹ chụp cho trang nào, yêu cầu set ánh sáng.", scores: { E: -1, A: -2, O: -1 } },
    ],
  },
  {
    question_id: "S1_Q6",
    question: "Thấy drama bóc phốt giới Cosplay trên mạng, bạn là?",
    options: [
      { text: "Đọc lướt, phân tích đúng sai rồi lướt đi, không xen vào.", scores: { E: -1, A: -2, O: 0 } },
      { text: "Bức xúc, lấy nick thật combat bảo vệ lẽ phải.", scores: { E: 1, A: 2, O: 0 } },
      { text: "Tag hội bạn thân vào để cùng buôn dưa lê.", scores: { E: 1, A: 0, O: 1 } },
    ],
  },
  {
    question_id: "S1_Q7",
    question: "Một bộ ảnh Cosplay thành công đối với bạn là khi?",
    options: [
      { text: "Lột tả 100% thần thái, ánh mắt và lore nhân vật.", scores: { E: 0, A: -1, O: -1 } },
      { text: "Ảo diệu, được bão like và share trên mọi mặt trận.", scores: { E: 2, A: 0, O: 1 } },
      { text: "Kỷ niệm quá trình cùng đồng đội làm đồ đầy tiếng cười.", scores: { E: 1, A: 2, O: 0 } },
    ],
  },
  {
    question_id: "S1_Q8",
    question: "Hậu Fes, bạn đăng ảnh lên mạng xã hội theo phong cách nào?",
    options: [
      { text: "Chỉnh sửa PTS kỹ lưỡng 3 ngày mới dám up.", scores: { E: -1, A: 0, O: -2 } },
      { text: "Up ngay album dìm hàng, meme kèm caption tấu hài.", scores: { E: 1, A: 0, O: 2 } },
      { text: "Viết bài sớ dài cảm ơn nháy, staff vô cùng tình cảm.", scores: { E: 1, A: 2, O: 0 } },
    ],
  },
]

export const FALLBACK_STAGE2_QUESTIONS: Stage2Question[] = [
  {
    question_id: "S2_Q9",
    question: "Khi chuẩn bị 'nhập vai', mức độ tìm hiểu Lore của bạn ở mức nào?",
    options: [
      { text: "Đọc sạch manga, nhớ cả ngày sinh, nhóm máu.", scores: { E: 0, A: -1, O: -2 } },
      { text: "Xem highlight ngầu ngầu, nắm cái 'vibe' là đủ.", scores: { E: 1, A: 0, O: 1 } },
      { text: "Chế luôn AU, tự suy nghĩ cốt truyện riêng.", scores: { E: 0, A: 1, O: 2 } },
    ],
  },
  {
    question_id: "S2_Q10",
    question: "Thói quen sắm đồ Cosplay của bạn?",
    options: [
      { text: "Soi từng link Taobao, tính toán ship hời nhất.", scores: { E: 0, A: -1, O: -1 } },
      { text: "Chốt đơn hàng có sẵn cho lẹ, đắt tí miễn đỡ chờ.", scores: { E: 1, A: 0, O: 1 } },
      { text: "Tự craft vũ khí, giáp trụ. Cực nhưng độc nhất.", scores: { E: 0, A: -1, O: 1 } },
    ],
  },
  {
    question_id: "S2_Q11",
    question: "Có fan lao tới xin ôm vì bạn cos bias của họ. Bạn sẽ:",
    options: [
      { text: "Ôm lại nhiệt tình, xưng hô chuẩn nhân vật và nhảy múa!", scores: { E: 2, A: 1, O: 0 } },
      { text: "Giật mình nhẹ, hơi bối rối nhưng vẫn cười hiền.", scores: { E: -1, A: 1, O: 0 } },
      { text: "Kéo khoảng cách ra, giữ nét mặt ngầu lòi lạnh lùng.", scores: { E: -1, A: -1, O: 0 } },
    ],
  },
  {
    question_id: "S2_Q12",
    question: "Trong một Project Group Cosplay, bạn rơi vào vị trí nào?",
    options: [
      { text: "Leader gõ đầu chạy deadline mua đồ, book nháy.", scores: { E: 1, A: -1, O: -1 } },
      { text: "Cây hài chuyên tạo meme dìm hàng mọi người.", scores: { E: 1, A: 1, O: 1 } },
      { text: "NPC trầm tính, giao việc gì làm nấy.", scores: { E: -1, A: 1, O: -1 } },
    ],
  },
  {
    question_id: "S2_Q13",
    question: "Bị ai đó chê 'Cos không giống bản gốc', bạn phản ứng sao?",
    options: [
      { text: "Block ngay, cười khẩy lướt qua.", scores: { E: -1, A: 0, O: 1 } },
      { text: "Soạn sớ phân tích góc mặt combat lại.", scores: { E: 1, A: -1, O: -1 } },
      { text: "Bề ngoài tỏ ra không sao, về nhà buồn mất mấy ngày.", scores: { E: -1, A: 2, O: 0 } },
    ],
  },
  {
    question_id: "S2_Q14",
    question: "Quá trình Makeup đối với bạn là?",
    options: [
      { text: "Ngồi tỉ mẩn 3-4 tiếng đo tỷ lệ contour.", scores: { E: 0, A: -1, O: -2 } },
      { text: "Lẹ làng trong 45 phút là xong.", scores: { E: 1, A: 0, O: 1 } },
      { text: "Nhịn ăn sáng book thợ makeup xịn cho an tâm.", scores: { E: 0, A: 1, O: -1 } },
    ],
  },
  {
    question_id: "S2_Q15",
    question: "Mục đích sâu thẳm khiến bạn đam mê Cosplay là gì?",
    options: [
      { text: "Tỏa sáng, được mọi người công nhận.", scores: { E: 2, A: 0, O: 0 } },
      { text: "Sống một cuộc đời vĩ đại/phi thường hơn.", scores: { E: 0, A: 1, O: 2 } },
      { text: "Tình bạn, những mối quan hệ ý nghĩa gặp được.", scores: { E: 1, A: 2, O: 0 } },
      { text: "Tạo ra tác phẩm nghệ thuật thỏa mãn thẩm mỹ.", scores: { E: 0, A: -1, O: -1 } },
    ],
  },
]
