/**
 * Mock shop policies data
 */

export interface ShopPolicy {
  title: string
  content: string
}

export const mockShopPolicies: ShopPolicy[] = [
  {
    title: "Điều kiện thuê",
    content: "• Khách hàng phải đặt cọc tiền mặt hoặc qua chuyển khoản trước khi nhận trang phục.\n• Thuê tối thiểu 1 ngày.\n• Đặt trước ít nhất 2 ngày để đảm bảo trang phục còn trống.",
  },
  {
    title: "Chính sách tiền cọc",
    content: "• Tiền cọc = 50% giá trị trang phục (tối thiểu 500.000 VNĐ).\n• Tiền cọc sẽ được hoàn trả đầy đủ khi trả trang phục đúng hạn và không có hư hỏng.\n• Nếu hủy đơn trước 3 ngày, hoàn cọc 100%; hủy trong vòng 3 ngày, mất cọc.",
  },
  {
    title: "Chính sách hư hỏng",
    content: "• Khách hàng chịu trách nhiệm về mọi hư hỏng trang phục trong thời gian thuê.\n• Hư nhẹ (nhăn, bẩn): phí vệ sinh 50.000 - 100.000 VNĐ.\n• Hư nặng (rách, gãy, hỏng hoàn toàn): bồi thường 100% giá trị trang phục.",
  },
  {
    title: "Phạt trả muộn",
    content: "• Trả muộn dưới 2 giờ: miễn phí.\n• Trả muộn trên 2 giờ đến 1 ngày: phí 50% giá thuê 1 ngày.\n• Trả muộn trên 1 ngày: phí 100% giá thuê 1 ngày + phí xử lý 50.000 VNĐ.",
  },
  {
    title: "Hủy/Hoàn tiền",
    content: "• Hủy trước 7 ngày: hoàn tiền 100% (trừ phí đặt cọc).\n• Hủy trước 3-7 ngày: hoàn tiền 50%.\n• Hủy dưới 3 ngày: không hoàn tiền.\n• Shop hủy đơn do force majeure: hoàn tiền 100% + bồi thường 10% giá trị đơn.",
  },
  {
    title: "Lưu ý khác",
    content: "• Vui lòng kiểm tra kỹ trang phục trước khi nhận và trả.\n• Không tẩy, ủi trang phục bằng máy (chỉ ủi tay nhẹ nếu cần).\n• Mang theo CMND/CCCD khi nhận và trả trang phục.",
  },
]

export function getMockShopPolicies(): ShopPolicy[] {
  return mockShopPolicies
}
