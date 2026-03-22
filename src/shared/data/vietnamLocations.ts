/**
 * Vietnam Administrative Divisions Dataset
 *
 * Post-2025 merger structure (after July 2025 administrative reform).
 * Single source of truth for all Vietnam location data in the frontend.
 *
 * Used by: address forms, service area selection, and any future location-dependent features.
 * Structure: province (63 units) → districts → wards (hierarchical)
 *
 * Province codes follow the official standard (QCVN 108:2015/BTTTT).
 * District codes are local indices within each province's district list.
 */
import type { VietnamCity, VietnamDistrict } from './vietnamLocations.types';

// Re-export types for consumers
export type { VietnamCity, VietnamDistrict };

// =============================================================================
// VIETNAM CITIES / PROVINCES
// =============================================================================

export const vietnamCities: VietnamCity[] = [
  // Code 01 - Hà Nội
  {
    code: 1,
    name: 'Hà Nội',
    districts: [
      { code: 1, name: 'Ba Đình' },
      { code: 2, name: 'Hoàn Kiếm' },
      { code: 3, name: 'Tây Hồ' },
      { code: 4, name: 'Long Biên' },
      { code: 5, name: 'Cầu Giấy' },
      { code: 6, name: 'Đống Đa' },
      { code: 7, name: 'Hai Bà Trưng' },
      { code: 8, name: 'Thanh Xuân' },
      { code: 9, name: 'Hoàng Mai' },
      { code: 10, name: 'Sóc Sơn' },
      { code: 11, name: 'Đông Anh' },
      { code: 12, name: 'Gia Lâm' },
      { code: 13, name: 'Nam Từ Liêm' },
      { code: 14, name: 'Thanh Trì' },
      { code: 15, name: 'Bắc Từ Liêm' },
      { code: 16, name: 'Hà Đông' },
      { code: 17, name: 'Ba Vì' },
      { code: 18, name: 'Chương Mỹ' },
      { code: 19, name: 'Đan Phượng' },
      { code: 20, name: 'Đông Hưng' },
      { code: 21, name: 'Hoài Đức' },
      { code: 22, name: 'Mỹ Đức' },
      { code: 23, name: 'Phú Xuyên' },
      { code: 24, name: 'Phúc Thọ' },
      { code: 25, name: 'Quốc Oai' },
      { code: 26, name: 'Sơn Tây' },
      { code: 27, name: 'Thạch Thất' },
      { code: 28, name: 'Thanh Oai' },
      { code: 29, name: 'Thường Tín' },
      { code: 30, name: 'Ứng Hòa' },
    ],
  },
  // Code 02 - Hồ Chí Minh
  {
    code: 2,
    name: 'Hồ Chí Minh',
    districts: [
      { code: 1, name: 'Quận 1' },
      { code: 2, name: 'Quận 3' },
      { code: 3, name: 'Quận 4' },
      { code: 4, name: 'Quận 5' },
      { code: 5, name: 'Quận 6' },
      { code: 6, name: 'Quận 7' },
      { code: 7, name: 'Quận 8' },
      { code: 8, name: 'Quận 10' },
      { code: 9, name: 'Quận 11' },
      { code: 10, name: 'Quận 12' },
      { code: 11, name: 'Bình Thạnh' },
      { code: 12, name: 'Gò Vấp' },
      { code: 13, name: 'Phú Nhuận' },
      { code: 14, name: 'Tân Bình' },
      { code: 15, name: 'Tân Phú' },
      { code: 16, name: 'Thủ Đức' },
      { code: 17, name: 'Bình Tân' },
      { code: 18, name: 'Bình Chánh' },
      { code: 19, name: 'Cần Giờ' },
      { code: 20, name: 'Củ Chi' },
      { code: 21, name: 'Hóc Môn' },
      { code: 22, name: 'Nhà Bè' },
    ],
  },
  // Code 03 - Hải Phòng
  {
    code: 3,
    name: 'Hải Phòng',
    districts: [
      { code: 1, name: 'Hồng Bàng' },
      { code: 2, name: 'Ngô Quyền' },
      { code: 3, name: 'Lê Chân' },
      { code: 4, name: 'Hải An' },
      { code: 5, name: 'Kiến An' },
      { code: 6, name: 'Đồ Sơn' },
      { code: 7, name: 'Dương Kinh' },
      { code: 8, name: 'An Dương' },
      { code: 9, name: 'An Lão' },
      { code: 10, name: 'Bạch Long Vĩ' },
      { code: 11, name: 'Cát Hải' },
      { code: 12, name: 'Kiến Thụy' },
      { code: 13, name: 'Tiên Lãng' },
      { code: 14, name: 'Thủy Nguyên' },
      { code: 15, name: 'Vĩnh Bảo' },
    ],
  },
  // Code 04 - Đà Nẵng
  {
    code: 4,
    name: 'Đà Nẵng',
    districts: [
      { code: 1, name: 'Hải Châu' },
      { code: 2, name: 'Thanh Khê' },
      { code: 3, name: 'Sơn Trà' },
      { code: 4, name: 'Ngũ Hành Sơn' },
      { code: 5, name: 'Liên Chiểu' },
      { code: 6, name: 'Cẩm Lệ' },
      { code: 7, name: 'Hòa Vang' },
      { code: 8, name: 'Hoàng Sa' },
    ],
  },
  // Code 05 - Hà Giang
  {
    code: 5,
    name: 'Hà Giang',
    districts: [
      { code: 1, name: 'Hà Giang' },
      { code: 2, name: 'Đồng Văn' },
      { code: 3, name: 'Mèo Vạc' },
      { code: 4, name: 'Yên Minh' },
      { code: 5, name: 'Quản Bạ' },
      { code: 6, name: 'Bắc Mê' },
      { code: 7, name: 'Hoàng Su Phì' },
      { code: 8, name: 'Xín Mần' },
      { code: 9, name: 'Bắc Quang' },
      { code: 10, name: 'Vị Xuyên' },
    ],
  },
  // Code 06 - Cao Bằng
  {
    code: 6,
    name: 'Cao Bằng',
    districts: [
      { code: 1, name: 'Cao Bằng' },
      { code: 2, name: 'Bảo Lạc' },
      { code: 3, name: 'Bảo Lâm' },
      { code: 4, name: 'Hạ Lang' },
      { code: 5, name: 'Quảng Uyên' },
      { code: 6, name: 'Thạch An' },
      { code: 7, name: 'Trà Lĩnh' },
      { code: 8, name: 'Trùng Khánh' },
      { code: 9, name: 'Hà Quảng' },
      { code: 10, name: 'Nguyên Bình' },
      { code: 11, name: 'Hòa An' },
    ],
  },
  // Code 07 - Bắc Kạn
  {
    code: 7,
    name: 'Bắc Kạn',
    districts: [
      { code: 1, name: 'Bắc Kạn' },
      { code: 2, name: 'Pác Nặm' },
      { code: 3, name: 'Ba Bể' },
      { code: 4, name: 'Ngân Sơn' },
      { code: 5, name: 'Bạch Thông' },
      { code: 6, name: 'Chợ Đồn' },
      { code: 7, name: 'Chợ Mới' },
      { code: 8, name: 'Na Rì' },
    ],
  },
  // Code 08 - Tuyên Quang
  {
    code: 8,
    name: 'Tuyên Quang',
    districts: [
      { code: 1, name: 'Tuyên Quang' },
      { code: 2, name: 'Lâm Bình' },
      { code: 3, name: 'Nà Hang' },
      { code: 4, name: 'Chiêm Hóa' },
      { code: 5, name: 'Hàm Yên' },
      { code: 6, name: 'Yên Sơn' },
      { code: 7, name: 'Sơn Dương' },
    ],
  },
  // Code 09 - Lào Cai
  {
    code: 9,
    name: 'Lào Cai',
    districts: [
      { code: 1, name: 'Lào Cai' },
      { code: 2, name: 'Bát Xát' },
      { code: 3, name: 'Mường Khương' },
      { code: 4, name: 'Si Ma Cai' },
      { code: 5, name: 'Bắc Hà' },
      { code: 6, name: 'Văn Bàn' },
      { code: 7, name: 'Sa Pa' },
      { code: 8, name: 'Bảo Thắng' },
      { code: 9, name: 'Bảo Yên' },
    ],
  },
  // Code 10 - Điện Biên
  {
    code: 10,
    name: 'Điện Biên',
    districts: [
      { code: 1, name: 'Điện Biên Phủ' },
      { code: 2, name: 'Mường Lay' },
      { code: 3, name: 'Mường Nhé' },
      { code: 4, name: 'Mường Chà' },
      { code: 5, name: 'Tủa Chùa' },
      { code: 6, name: 'Tuần Giáo' },
      { code: 7, name: 'Điện Biên' },
      { code: 8, name: 'Điện Biên Đông' },
      { code: 9, name: 'Mường Ảng' },
      { code: 10, name: 'Nậm Pồ' },
    ],
  },
  // Code 11 - Lai Châu
  {
    code: 11,
    name: 'Lai Châu',
    districts: [
      { code: 1, name: 'Lai Châu' },
      { code: 2, name: 'Tam Đường' },
      { code: 3, name: 'Mường Tè' },
      { code: 4, name: 'Sìn Hồ' },
      { code: 5, name: 'Tân Uyên' },
      { code: 6, name: 'Phong Thổ' },
      { code: 7, name: 'Nậm Nhùn' },
    ],
  },
  // Code 12 - Sơn La
  {
    code: 12,
    name: 'Sơn La',
    districts: [
      { code: 1, name: 'Sơn La' },
      { code: 2, name: 'Quỳnh Nhai' },
      { code: 3, name: 'Thuận Châu' },
      { code: 4, name: 'Mường La' },
      { code: 5, name: 'Phù Yên' },
      { code: 6, name: 'Bắc Yên' },
      { code: 7, name: 'Mai Sơn' },
      { code: 8, name: 'Yên Châu' },
      { code: 9, name: 'Mộc Châu' },
      { code: 10, name: 'Sông Mã' },
      { code: 11, name: 'Sốp Cộp' },
      { code: 12, name: 'Vân Hồ' },
    ],
  },
  // Code 13 - Yên Bái
  {
    code: 13,
    name: 'Yên Bái',
    districts: [
      { code: 1, name: 'Yên Bái' },
      { code: 2, name: 'Nghĩa Lộ' },
      { code: 3, name: 'Trạm Tấu' },
      { code: 4, name: 'Mù Căng Chải' },
      { code: 5, name: 'Trấn Yên' },
      { code: 6, name: 'Văn Chấn' },
      { code: 7, name: 'Văn Yên' },
      { code: 8, name: 'Yên Bình' },
      { code: 9, name: 'Lục Yên' },
    ],
  },
  // Code 14 - Thái Nguyên
  {
    code: 14,
    name: 'Thái Nguyên',
    districts: [
      { code: 1, name: 'Thái Nguyên' },
      { code: 2, name: 'Sông Công' },
      { code: 3, name: 'Phổ Yên' },
      { code: 4, name: 'Võ Nhai' },
      { code: 5, name: 'Đại Từ' },
      { code: 6, name: 'Phú Bình' },
      { code: 7, name: 'Định Hóa' },
      { code: 8, name: 'Bình Xuyên' },
      { code: 9, name: 'Hữu Lũng' },
      { code: 10, name: 'Phú Lương' },
    ],
  },
  // Code 15 - Lạng Sơn
  {
    code: 15,
    name: 'Lạng Sơn',
    districts: [
      { code: 1, name: 'Lạng Sơn' },
      { code: 2, name: 'Tràng Định' },
      { code: 3, name: 'Bình Gia' },
      { code: 4, name: 'Văn Lãng' },
      { code: 5, name: 'Cao Lộc' },
      { code: 6, name: 'Hữu Lũng' },
      { code: 7, name: 'Chi Lăng' },
      { code: 8, name: 'Lộc Bình' },
      { code: 9, name: 'Đình Lập' },
      { code: 10, name: 'Hải Lăng' },
    ],
  },
  // Code 16 - Quảng Ninh
  {
    code: 16,
    name: 'Quảng Ninh',
    districts: [
      { code: 1, name: 'Hạ Long' },
      { code: 2, name: 'Móng Cái' },
      { code: 3, name: 'Cẩm Phả' },
      { code: 4, name: 'Uông Bí' },
      { code: 5, name: 'Hải Hà' },
      { code: 6, name: 'Bình Liêu' },
      { code: 7, name: 'Đầm Hà' },
      { code: 8, name: 'Hải Hưng' },
      { code: 9, name: 'Tiên Yên' },
      { code: 10, name: 'Ba Chẽ' },
      { code: 11, name: 'Vân Đồn' },
      { code: 12, name: 'Hoành Bồ' },
      { code: 13, name: 'Yên Hưng' },
      { code: 14, name: 'Đông Triều' },
      { code: 15, name: 'Quảng Yên' },
    ],
  },
  // Code 17 - Bắc Giang
  {
    code: 17,
    name: 'Bắc Giang',
    districts: [
      { code: 1, name: 'Bắc Giang' },
      { code: 2, name: 'Yên Thế' },
      { code: 3, name: 'Tân Yên' },
      { code: 4, name: 'Lạng Giang' },
      { code: 5, name: 'Lục Nam' },
      { code: 6, name: 'Lục Ngạn' },
      { code: 7, name: 'Sơn Động' },
      { code: 8, name: 'Yên Dũng' },
      { code: 9, name: 'Việt Yên' },
      { code: 10, name: 'Hiệp Hòa' },
    ],
  },
  // Code 18 - Phú Thọ
  {
    code: 18,
    name: 'Phú Thọ',
    districts: [
      { code: 1, name: 'Việt Trì' },
      { code: 2, name: 'Phú Thọ' },
      { code: 3, name: 'Đoan Hùng' },
      { code: 4, name: 'Hạ Hoà' },
      { code: 5, name: 'Thanh Ba' },
      { code: 6, name: 'Phong Châu' },
      { code: 7, name: 'Cẩm Khê' },
      { code: 8, name: 'Tam Nông' },
      { code: 9, name: 'Thanh Thủy' },
      { code: 10, name: 'Yên Lập' },
      { code: 11, name: 'Lâm Thao' },
    ],
  },
  // Code 19 - Vĩnh Phúc
  {
    code: 19,
    name: 'Vĩnh Phúc',
    districts: [
      { code: 1, name: 'Vĩnh Yên' },
      { code: 2, name: 'Phúc Yên' },
      { code: 3, name: 'Lập Thạch' },
      { code: 4, name: 'Tam Dương' },
      { code: 5, name: 'Tam Đảo' },
      { code: 6, name: 'Yên Lạc' },
      { code: 7, name: 'Vĩnh Tường' },
      { code: 8, name: 'Bình Xuyên' },
      { code: 9, name: 'Sông Lô' },
    ],
  },
  // Code 20 - Bắc Ninh
  {
    code: 20,
    name: 'Bắc Ninh',
    districts: [
      { code: 1, name: 'Bắc Ninh' },
      { code: 2, name: 'Từ Sơn' },
      { code: 3, name: 'Thuận Thành' },
      { code: 4, name: 'Quế Võ' },
      { code: 5, name: 'Yên Phong' },
      { code: 6, name: 'Gia Bình' },
      { code: 7, name: 'Lương Tài' },
      { code: 8, name: 'Tiên Du' },
    ],
  },
  // Code 21 - Hải Dương
  {
    code: 21,
    name: 'Hải Dương',
    districts: [
      { code: 1, name: 'Hải Dương' },
      { code: 2, name: 'Chí Linh' },
      { code: 3, name: 'Nam Sách' },
      { code: 4, name: 'Kinh Môn' },
      { code: 5, name: 'Kim Thành' },
      { code: 6, name: 'Thanh Miện' },
      { code: 7, name: 'Ninh Giang' },
      { code: 8, name: 'Gia Lộc' },
      { code: 9, name: 'Tứ Kỳ' },
      { code: 10, name: 'Bình Giang' },
    ],
  },
  // Code 22 - Hưng Yên
  {
    code: 22,
    name: 'Hưng Yên',
    districts: [
      { code: 1, name: 'Hưng Yên' },
      { code: 2, name: 'Văn Giang' },
      { code: 3, name: 'Yên Mỹ' },
      { code: 4, name: 'Mỹ Hào' },
      { code: 5, name: 'Khoái Châu' },
      { code: 6, name: 'Ân Thi' },
      { code: 7, name: 'Kim Động' },
      { code: 8, name: 'Tiên Lữ' },
      { code: 9, name: 'Phù Cừ' },
      { code: 10, name: 'Trần Hưng Đạo' },
    ],
  },
  // Code 23 - Thái Bình
  {
    code: 23,
    name: 'Thái Bình',
    districts: [
      { code: 1, name: 'Thái Bình' },
      { code: 2, name: 'Quỳnh Phụ' },
      { code: 3, name: 'Hưng Hà' },
      { code: 4, name: 'Đông Hưng' },
      { code: 5, name: 'Vũ Thư' },
      { code: 6, name: 'Kiến Xương' },
      { code: 7, name: 'Tiền Hải' },
      { code: 8, name: 'Thới Bình' },
      { code: 9, name: 'Hồng Bàng' },
    ],
  },
  // Code 24 - Hà Nam
  {
    code: 24,
    name: 'Hà Nam',
    districts: [
      { code: 1, name: 'Phủ Lý' },
      { code: 2, name: 'Duy Tiên' },
      { code: 3, name: 'Kim Bảng' },
      { code: 4, name: 'Thanh Liêm' },
      { code: 5, name: 'Bình Lục' },
      { code: 6, name: 'Lý Nhân' },
    ],
  },
  // Code 25 - Nam Định
  {
    code: 25,
    name: 'Nam Định',
    districts: [
      { code: 1, name: 'Nam Định' },
      { code: 2, name: 'Mỹ Lộc' },
      { code: 3, name: 'Vụ Bản' },
      { code: 4, name: 'Ý Yên' },
      { code: 5, name: 'Nghĩa Hưng' },
      { code: 6, name: 'Nam Trực' },
      { code: 7, name: 'Trực Ninh' },
      { code: 8, name: 'Xuân Trường' },
      { code: 9, name: 'Hải Hậu' },
      { code: 10, name: 'Giao Thủy' },
      { code: 11, name: 'Kim Sơn' },
    ],
  },
  // Code 26 - Ninh Bình
  {
    code: 26,
    name: 'Ninh Bình',
    districts: [
      { code: 1, name: 'Ninh Bình' },
      { code: 2, name: 'Tam Điệp' },
      { code: 3, name: 'Yên Khánh' },
      { code: 4, name: 'Yên Mỹ' },
      { code: 5, name: 'Nho Quan' },
      { code: 6, name: 'Gia Viễn' },
      { code: 7, name: 'Hoa Lư' },
      { code: 8, name: 'Kim Sơn' },
    ],
  },
  // Code 27 - Thanh Hóa
  {
    code: 27,
    name: 'Thanh Hóa',
    districts: [
      { code: 1, name: 'Thanh Hóa' },
      { code: 2, name: 'Bỉm Sơn' },
      { code: 3, name: 'Sầm Sơn' },
      { code: 4, name: 'Mường Lát' },
      { code: 5, name: 'Quan Hóa' },
      { code: 6, name: 'Bá Thước' },
      { code: 7, name: 'Quảng Xương' },
      { code: 8, name: 'Tĩnh Gia' },
      { code: 9, name: 'Hậu Lộc' },
      { code: 10, name: 'Hà Trung' },
      { code: 11, name: 'Nga Sơn' },
      { code: 12, name: 'Yên Định' },
      { code: 13, name: 'Thọ Xuân' },
      { code: 14, name: 'Thường Xuân' },
      { code: 15, name: 'Triệu Sơn' },
      { code: 16, name: 'Nông Cống' },
      { code: 17, name: 'Đông Sơn' },
      { code: 18, name: 'Rừng Thái' },
      { code: 19, name: 'Cẩm Thủy' },
      { code: 20, name: 'Lang Chánh' },
      { code: 21, name: 'Ngọc Lặc' },
      { code: 22, name: 'Thạch Thành' },
      { code: 23, name: 'Vĩnh Lộc' },
    ],
  },
  // Code 28 - Nghệ An
  {
    code: 28,
    name: 'Nghệ An',
    districts: [
      { code: 1, name: 'Vinh' },
      { code: 2, name: 'Cửa Lò' },
      { code: 3, name: 'Thái Hòa' },
      { code: 4, name: 'Quế Phong' },
      { code: 5, name: 'Quỳ Châu' },
      { code: 6, name: 'Quỳ Hợp' },
      { code: 7, name: 'Nghi Lộc' },
      { code: 8, name: 'Nam Đàn' },
      { code: 9, name: 'Hưng Nguyên' },
      { code: 10, name: 'Thanh Chương' },
      { code: 11, name: 'Đô Lương' },
      { code: 12, name: 'Anh Sơn' },
      { code: 13, name: 'Tân Kỳ' },
      { code: 14, name: 'Yên Thành' },
      { code: 15, name: 'Diễn Châu' },
      { code: 16, name: 'Hoa Lư' },
      { code: 17, name: 'Kỳ Sơn' },
      { code: 18, name: 'Nghĩa Đàn' },
      { code: 19, name: 'Quỳnh Lưu' },
      { code: 20, name: 'Tương Dương' },
    ],
  },
  // Code 29 - Hà Tĩnh
  {
    code: 29,
    name: 'Hà Tĩnh',
    districts: [
      { code: 1, name: 'Hà Tĩnh' },
      { code: 2, name: 'Hồng Lĩnh' },
      { code: 3, name: 'Hương Sơn' },
      { code: 4, name: 'Đức Thọ' },
      { code: 5, name: 'Vũ Quang' },
      { code: 6, name: 'Nghi Xuân' },
      { code: 7, name: 'Can Lộc' },
      { code: 8, name: 'Thạch Hà' },
      { code: 9, name: 'Cẩm Xuyên' },
      { code: 10, name: 'Kỳ Anh' },
      { code: 11, name: 'Lộc Hà' },
      { code: 12, name: 'Hương Khê' },
    ],
  },
  // Code 30 - Quảng Bình
  {
    code: 30,
    name: 'Quảng Bình',
    districts: [
      { code: 1, name: 'Đồng Hới' },
      { code: 2, name: 'Ba Đồn' },
      { code: 3, name: 'Quảng Trạch' },
      { code: 4, name: 'Bố Trạch' },
      { code: 5, name: 'Quảng Ninh' },
      { code: 6, name: 'Lệ Thủy' },
      { code: 7, name: 'Tuyên Hóa' },
      { code: 8, name: 'Minh Hóa' },
      { code: 9, name: 'Đức Trọng' },
    ],
  },
  // Code 31 - Quảng Trị
  {
    code: 31,
    name: 'Quảng Trị',
    districts: [
      { code: 1, name: 'Đông Hà' },
      { code: 2, name: 'Quảng Trị' },
      { code: 3, name: 'Vĩnh Linh' },
      { code: 4, name: 'Hướng Hóa' },
      { code: 5, name: 'Gio Linh' },
      { code: 6, name: 'Cam Lộ' },
      { code: 7, name: 'Triệu Phong' },
      { code: 8, name: 'Hải Lăng' },
      { code: 9, name: 'Cồn Cỏ' },
    ],
  },
  // Code 32 - Thừa Thiên Huế
  {
    code: 32,
    name: 'Thừa Thiên Huế',
    districts: [
      { code: 1, name: 'Huế' },
      { code: 2, name: 'Phú Vang' },
      { code: 3, name: 'Hương Thủy' },
      { code: 4, name: 'Hương Trà' },
      { code: 5, name: 'A Lưới' },
      { code: 6, name: 'Phong Điền' },
      { code: 7, name: 'Quảng Điền' },
      { code: 8, name: 'Nam Đông' },
      { code: 9, name: 'Phú Lộc' },
    ],
  },
  // Code 33 - Quảng Nam
  {
    code: 33,
    name: 'Quảng Nam',
    districts: [
      { code: 1, name: 'Tam Kỳ' },
      { code: 2, name: 'Hội An' },
      { code: 3, name: 'Tây Giang' },
      { code: 4, name: 'Đông Giang' },
      { code: 5, name: 'Đại Lộc' },
      { code: 6, name: 'Điện Bàn' },
      { code: 7, name: 'Duy Xuyên' },
      { code: 8, name: 'Nam Trà My' },
      { code: 9, name: 'Núi Thành' },
      { code: 10, name: 'Quế Sơn' },
      { code: 11, name: 'Thăng Bình' },
      { code: 12, name: 'Tiên Phước' },
      { code: 13, name: 'Bắc Trà My' },
      { code: 14, name: 'Phước Sơn' },
      { code: 15, name: 'Hiệp Đức' },
      { code: 16, name: 'Nam Giang' },
      { code: 17, name: 'Phú Ninh' },
      { code: 18, name: 'Nông Sơn' },
    ],
  },
  // Code 34 - Quảng Ngãi
  {
    code: 34,
    name: 'Quảng Ngãi',
    districts: [
      { code: 1, name: 'Quảng Ngãi' },
      { code: 2, name: 'Bình Sơn' },
      { code: 3, name: 'Trà Bồng' },
      { code: 4, name: 'Tây Trà' },
      { code: 5, name: 'Sơn Tịnh' },
      { code: 6, name: 'Sơn Hà' },
      { code: 7, name: 'Sơn Tây' },
      { code: 8, name: 'Minh Long' },
      { code: 9, name: 'Nghĩa Hành' },
      { code: 10, name: 'Mộ Đức' },
      { code: 11, name: 'Đức Phổ' },
      { code: 12, name: 'Ba Tơ' },
      { code: 13, name: 'Lý Sơn' },
    ],
  },
  // Code 35 - Bình Định
  {
    code: 35,
    name: 'Bình Định',
    districts: [
      { code: 1, name: 'Quy Nhơn' },
      { code: 2, name: 'An Lão' },
      { code: 3, name: 'Hoài Ân' },
      { code: 4, name: 'Hoài Nhơn' },
      { code: 5, name: 'Phù Mỹ' },
      { code: 6, name: 'Phù Cát' },
      { code: 7, name: 'Tuy Phước' },
      { code: 8, name: 'Vĩnh Thạnh' },
      { code: 9, name: 'Vân Canh' },
      { code: 10, name: 'Tây Sơn' },
      { code: 11, name: 'An Nhơn' },
      { code: 12, name: 'Tuy An' },
    ],
  },
  // Code 36 - Phú Yên
  {
    code: 36,
    name: 'Phú Yên',
    districts: [
      { code: 1, name: 'Tuy Hòa' },
      { code: 2, name: 'Đông Hòa' },
      { code: 3, name: 'Tây Hòa' },
      { code: 4, name: 'Phú Hòa' },
      { code: 5, name: 'Đồng Xuân' },
      { code: 6, name: 'Thanh Phú' },
      { code: 7, name: 'Sơn Hòa' },
      { code: 8, name: 'Sông Hinh' },
      { code: 9, name: 'Tuy An' },
    ],
  },
  // Code 37 - Khánh Hòa
  {
    code: 37,
    name: 'Khánh Hòa',
    districts: [
      { code: 1, name: 'Nha Trang' },
      { code: 2, name: 'Cam Ranh' },
      { code: 3, name: 'Ninh Hòa' },
      { code: 4, name: 'Diên Khánh' },
      { code: 5, name: 'Vạn Ninh' },
      { code: 6, name: 'Khánh Vĩnh' },
      { code: 7, name: 'Khánh Sơn' },
      { code: 8, name: 'Trường Sa' },
      { code: 9, name: 'Cam Lâm' },
    ],
  },
  // Code 38 - Ninh Thuận
  {
    code: 38,
    name: 'Ninh Thuận',
    districts: [
      { code: 1, name: 'Phan Rang-Tháp Chàm' },
      { code: 2, name: 'Ninh Sơn' },
      { code: 3, name: 'Ninh Hải' },
      { code: 4, name: 'Ninh Phước' },
      { code: 5, name: 'Thuận Bắc' },
      { code: 6, name: 'Thuận Nam' },
      { code: 7, name: 'Bác Ái' },
    ],
  },
  // Code 39 - Bình Thuận
  {
    code: 39,
    name: 'Bình Thuận',
    districts: [
      { code: 1, name: 'Phan Thiết' },
      { code: 2, name: 'La Gi' },
      { code: 3, name: 'Tuy Phong' },
      { code: 4, name: 'Bắc Bình' },
      { code: 5, name: 'Hàm Thuận Bắc' },
      { code: 6, name: 'Hàm Thuận Nam' },
      { code: 7, name: 'Hàm Tân' },
      { code: 8, name: 'Đức Linh' },
      { code: 9, name: 'Tánh Linh' },
      { code: 10, name: 'Phú Qúy' },
    ],
  },
  // Code 40 - Kon Tum
  {
    code: 40,
    name: 'Kon Tum',
    districts: [
      { code: 1, name: 'Kon Tum' },
      { code: 2, name: 'Đắk Hà' },
      { code: 3, name: 'Đắk Tô' },
      { code: 4, name: 'Ngọc Hồi' },
      { code: 5, name: 'Đắk Glei' },
      { code: 6, name: 'Kon Plông' },
      { code: 7, name: 'Kon Rẫy' },
      { code: 8, name: 'Tu Mơ Rông' },
      { code: 9, name: 'Ia H Drai' },
      { code: 10, name: 'Đắk Kroong' },
    ],
  },
  // Code 41 - Gia Lai
  {
    code: 41,
    name: 'Gia Lai',
    districts: [
      { code: 1, name: 'Pleiku' },
      { code: 2, name: 'An Khê' },
      { code: 3, name: 'Ayun Pa' },
      { code: 4, name: 'KBang' },
      { code: 5, name: 'Đắk Đoa' },
      { code: 6, name: 'Chư Păh' },
      { code: 7, name: 'Ia Grai' },
      { code: 8, name: 'Mang Yang' },
      { code: 9, name: 'Kông Chro' },
      { code: 10, name: 'Đức Cơ' },
      { code: 11, name: 'Chư Prông' },
      { code: 12, name: 'Chư Sê' },
      { code: 13, name: 'Đắk Pơ' },
      { code: 14, name: 'Ia Pa' },
      { code: 15, name: 'Krông Pa' },
      { code: 16, name: 'Phú Thiện' },
      { code: 17, name: 'Chư Pưh' },
    ],
  },
  // Code 42 - Đắk Lắk
  {
    code: 42,
    name: 'Đắk Lắk',
    districts: [
      { code: 1, name: 'Buôn Ma Thuột' },
      { code: 2, name: 'Buôn Hồ' },
      { code: 3, name: 'Ea HLeo' },
      { code: 4, name: 'Ea Súp' },
      { code: 5, name: 'Cư Mgar' },
      { code: 6, name: 'Krông Pắc' },
      { code: 7, name: 'Ea Kar' },
      { code: 8, name: 'MDrắk' },
      { code: 9, name: 'Krông Bông' },
      { code: 10, name: 'Lắk' },
      { code: 11, name: 'Krông Năng' },
      { code: 12, name: 'Cư Kuin' },
      { code: 13, name: 'Buôn Đôn' },
      { code: 14, name: 'Krông Búk' },
    ],
  },
  // Code 43 - Đắk Nông
  {
    code: 43,
    name: 'Đắk Nông',
    districts: [
      { code: 1, name: 'Gia Nghĩa' },
      { code: 2, name: 'Đắk Mil' },
      { code: 3, name: 'Cư Jút' },
      { code: 4, name: 'Đắk Song' },
      { code: 5, name: 'Đắk Glong' },
      { code: 6, name: 'Krông Nô' },
      { code: 7, name: 'Đắk Rlấp' },
      { code: 8, name: 'Tuy Đức' },
      { code: 9, name: 'Đắk Sin' },
    ],
  },
  // Code 44 - Lâm Đồng
  {
    code: 44,
    name: 'Lâm Đồng',
    districts: [
      { code: 1, name: 'Đà Lạt' },
      { code: 2, name: 'Bảo Lộc' },
      { code: 3, name: 'Đơn Dương' },
      { code: 4, name: 'Lạc Dương' },
      { code: 5, name: 'Đức Trọng' },
      { code: 6, name: 'Di Linh' },
      { code: 7, name: 'Bảo Lâm' },
      { code: 8, name: 'Đạ Huoai' },
      { code: 9, name: 'Đạ Tẻh' },
      { code: 10, name: 'Cát Tiên' },
      { code: 11, name: 'Lâm Hà' },
    ],
  },
  // Code 45 - Bình Phước
  {
    code: 45,
    name: 'Bình Phước',
    districts: [
      { code: 1, name: 'Đồng Xoài' },
      { code: 2, name: 'Bình Long' },
      { code: 3, name: 'Phước Long' },
      { code: 4, name: 'Bù Đăng' },
      { code: 5, name: 'Lộc Ninh' },
      { code: 6, name: 'Bù Đốp' },
      { code: 7, name: 'Hớn Quản' },
      { code: 8, name: 'Đồng Phú' },
      { code: 9, name: 'Bù Gia Mập' },
      { code: 10, name: 'Phú Riềng' },
      { code: 11, name: 'Chơn Thành' },
    ],
  },
  // Code 46 - Tây Ninh
  {
    code: 46,
    name: 'Tây Ninh',
    districts: [
      { code: 1, name: 'Tây Ninh' },
      { code: 2, name: 'Tân Biên' },
      { code: 3, name: 'Tân Châu' },
      { code: 4, name: 'Dương Minh Châu' },
      { code: 5, name: 'Châu Thành' },
      { code: 6, name: 'Bến Cầu' },
      { code: 7, name: 'Gò Dầu' },
      { code: 8, name: 'Thạnh Đức' },
      { code: 9, name: 'Hòa Thành' },
      { code: 10, name: 'Trảng Bàng' },
    ],
  },
  // Code 47 - Bình Dương
  {
    code: 47,
    name: 'Bình Dương',
    districts: [
      { code: 1, name: 'Thủ Dầu Một' },
      { code: 2, name: 'Bến Cát' },
      { code: 3, name: 'Tân Uyên' },
      { code: 4, name: 'Dĩ An' },
      { code: 5, name: 'Thuận An' },
      { code: 6, name: 'Bàu Bàng' },
      { code: 7, name: 'Phú Giáo' },
      { code: 8, name: 'Dầu Tiếng' },
      { code: 9, name: 'Bắc Tân Uyên' },
    ],
  },
  // Code 48 - Đồng Nai
  {
    code: 48,
    name: 'Đồng Nai',
    districts: [
      { code: 1, name: 'Biên Hòa' },
      { code: 2, name: 'Long Khánh' },
      { code: 3, name: 'Tân Phú' },
      { code: 4, name: 'Vĩnh Cửu' },
      { code: 5, name: 'Định Quán' },
      { code: 6, name: 'Trảng Bom' },
      { code: 7, name: 'Thống Nhất' },
      { code: 8, name: 'Cẩm Mỹ' },
      { code: 9, name: 'Long Thành' },
      { code: 10, name: 'Xuân Lộc' },
      { code: 11, name: 'Nhơn Trạch' },
    ],
  },
  // Code 49 - Bà Rịa - Vũng Tàu
  {
    code: 49,
    name: 'Bà Rịa - Vũng Tàu',
    districts: [
      { code: 1, name: 'Vũng Tàu' },
      { code: 2, name: 'Bà Rịa' },
      { code: 3, name: 'Châu Đức' },
      { code: 4, name: 'Xuyên Mộc' },
      { code: 5, name: 'Long Điền' },
      { code: 6, name: 'Đất Đỏ' },
      { code: 7, name: 'Phú Mỹ' },
      { code: 8, name: 'Côn Đảo' },
    ],
  },
  // Code 50 - Cần Thơ
  {
    code: 50,
    name: 'Cần Thơ',
    districts: [
      { code: 1, name: 'Ninh Kiều' },
      { code: 2, name: 'Bình Thủy' },
      { code: 3, name: 'Cái Răng' },
      { code: 4, name: 'Thốt Nốt' },
      { code: 5, name: 'Ô Môn' },
      { code: 6, name: 'Cờ Đỏ' },
      { code: 7, name: 'Vĩnh Thạnh' },
      { code: 8, name: 'Phong Điền' },
      { code: 9, name: 'Thới Lai' },
    ],
  },
  // Code 51 - Long An
  {
    code: 51,
    name: 'Long An',
    districts: [
      { code: 1, name: 'Tân An' },
      { code: 2, name: 'Bến Lức' },
      { code: 3, name: 'Kiến Tường' },
      { code: 4, name: 'Mộc Hóa' },
      { code: 5, name: 'Tân Hưng' },
      { code: 6, name: 'Vĩnh Hưng' },
      { code: 7, name: 'Đức Hòa' },
      { code: 8, name: 'Đức Huệ' },
      { code: 9, name: 'Cần Giuộc' },
      { code: 10, name: 'Cần Đước' },
      { code: 11, name: 'Tân Trụ' },
      { code: 12, name: 'Thủ Thừa' },
      { code: 13, name: 'Châu Thành' },
      { code: 14, name: 'Tân Thạnh' },
      { code: 15, name: 'Thạnh Hóa' },
    ],
  },
  // Code 52 - Tiền Giang
  {
    code: 52,
    name: 'Tiền Giang',
    districts: [
      { code: 1, name: 'Mỹ Tho' },
      { code: 2, name: 'Gò Công' },
      { code: 3, name: 'Gò Công Tây' },
      { code: 4, name: 'Gò Công Đông' },
      { code: 5, name: 'Cái Bè' },
      { code: 6, name: 'Châu Thành' },
      { code: 7, name: 'Chợ Gạo' },
      { code: 8, name: 'Giao Thanh' },
      { code: 9, name: 'Tân Phước' },
      { code: 10, name: 'Tân Hiệp' },
      { code: 11, name: 'Cai Lậy' },
    ],
  },
  // Code 53 - Bến Tre
  {
    code: 53,
    name: 'Bến Tre',
    districts: [
      { code: 1, name: 'Bến Tre' },
      { code: 2, name: 'Chợ Lách' },
      { code: 3, name: 'Mỏ Cày Nam' },
      { code: 4, name: 'Mỏ Cày Bắc' },
      { code: 5, name: 'Giồng Trôm' },
      { code: 6, name: 'Bình Đại' },
      { code: 7, name: 'Ba Tri' },
      { code: 8, name: 'Thạnh Phú' },
      { code: 9, name: 'Châu Thành' },
    ],
  },
  // Code 54 - Trà Vinh
  {
    code: 54,
    name: 'Trà Vinh',
    districts: [
      { code: 1, name: 'Trà Vinh' },
      { code: 2, name: 'Càng Long' },
      { code: 3, name: 'Tiểu Cần' },
      { code: 4, name: 'Cầu Kè' },
      { code: 5, name: 'Cầu Ngang' },
      { code: 6, name: 'Trà Cú' },
      { code: 7, name: 'Duyên Hải' },
      { code: 8, name: 'Châu Thành' },
    ],
  },
  // Code 55 - Vĩnh Long
  {
    code: 55,
    name: 'Vĩnh Long',
    districts: [
      { code: 1, name: 'Vĩnh Long' },
      { code: 2, name: 'Long Hồ' },
      { code: 3, name: 'Bình Minh' },
      { code: 4, name: 'Tam Bình' },
      { code: 5, name: 'Trà Ôn' },
      { code: 6, name: 'Bình Tân' },
      { code: 7, name: 'Mang Thít' },
      { code: 8, name: 'Vũng Liêm' },
      { code: 9, name: 'Châu Thành' },
    ],
  },
  // Code 56 - Đồng Tháp
  {
    code: 56,
    name: 'Đồng Tháp',
    districts: [
      { code: 1, name: 'Cao Lãnh' },
      { code: 2, name: 'Sa Đéc' },
      { code: 3, name: 'Hồng Ngự' },
      { code: 4, name: 'Lai Vung' },
      { code: 5, name: 'Châu Thành' },
      { code: 6, name: 'Thanh Bình' },
      { code: 7, name: 'Tam Nông' },
      { code: 8, name: 'Tháp Mười' },
      { code: 9, name: 'Cao Lãnh' },
      { code: 10, name: 'Lấp Vò' },
    ],
  },
  // Code 57 - An Giang
  {
    code: 57,
    name: 'An Giang',
    districts: [
      { code: 1, name: 'Long Xuyên' },
      { code: 2, name: 'Châu Đốc' },
      { code: 3, name: 'An Phú' },
      { code: 4, name: 'Tân Châu' },
      { code: 5, name: 'Phú Tân' },
      { code: 6, name: 'Châu Phong' },
      { code: 7, name: 'Tịnh Biên' },
      { code: 8, name: 'Tri Tôn' },
      { code: 9, name: 'Thoại Sơn' },
      { code: 10, name: 'Châu Thành' },
      { code: 11, name: 'Chợ Mới' },
    ],
  },
  // Code 58 - Kiên Giang
  {
    code: 58,
    name: 'Kiên Giang',
    districts: [
      { code: 1, name: 'Rạch Giá' },
      { code: 2, name: 'Hà Tiên' },
      { code: 3, name: 'Kiên Hải' },
      { code: 4, name: 'Hòn Đất' },
      { code: 5, name: 'Tân Hiệp' },
      { code: 6, name: 'Giồng Riềng' },
      { code: 7, name: 'Gò Quao' },
      { code: 8, name: 'Châu Thành' },
      { code: 9, name: 'Vĩnh Thuận' },
      { code: 10, name: 'U Minh Thượng' },
      { code: 11, name: 'An Biên' },
      { code: 12, name: 'An Minh' },
      { code: 13, name: 'Phú Quốc' },
      { code: 14, name: 'Kiên Lương' },
    ],
  },
  // Code 59 - Hậu Giang
  {
    code: 59,
    name: 'Hậu Giang',
    districts: [
      { code: 1, name: 'Vị Thanh' },
      { code: 2, name: 'Vị Thủy' },
      { code: 3, name: 'Ngã Bảy' },
      { code: 4, name: 'Châu Thành' },
      { code: 5, name: 'Châu Thành A' },
      { code: 6, name: 'Phụng Hiệp' },
      { code: 7, name: 'Long Mỹ' },
    ],
  },
  // Code 60 - Sóc Trăng
  {
    code: 60,
    name: 'Sóc Trăng',
    districts: [
      { code: 1, name: 'Sóc Trăng' },
      { code: 2, name: 'Châu Thành' },
      { code: 3, name: 'Kế Sách' },
      { code: 4, name: 'Mỹ Tú' },
      { code: 5, name: 'Cù Lao Dung' },
      { code: 6, name: 'Long Phú' },
      { code: 7, name: 'Mỹ Xuyên' },
      { code: 8, name: 'Trần Đề' },
      { code: 9, name: 'Thạnh Trị' },
      { code: 10, name: 'Vĩnh Châu' },
    ],
  },
  // Code 61 - Bạc Liêu
  {
    code: 61,
    name: 'Bạc Liêu',
    districts: [
      { code: 1, name: 'Bạc Liêu' },
      { code: 2, name: 'Hồng Dân' },
      { code: 3, name: 'Phước Long' },
      { code: 4, name: 'Vĩnh Lợi' },
      { code: 5, name: 'Giá Rai' },
      { code: 6, name: 'Đông Hải' },
      { code: 7, name: 'Hoà Bình' },
    ],
  },
  // Code 62 - Cà Mau
  {
    code: 62,
    name: 'Cà Mau',
    districts: [
      { code: 1, name: 'Cà Mau' },
      { code: 2, name: 'U Minh' },
      { code: 3, name: 'Thới Bình' },
      { code: 4, name: 'Trần Văn Thời' },
      { code: 5, name: 'Cái Nước' },
      { code: 6, name: 'Đầm Dơi' },
      { code: 7, name: 'Năm Căn' },
      { code: 8, name: 'Phú Tân' },
      { code: 9, name: 'Ngọc Hiển' },
    ],
  },
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get all cities/provinces
 */
export function getAllCities(): VietnamCity[] {
  return vietnamCities;
}

/**
 * Get districts for a given city code
 */
export function getDistrictsByCityCode(cityCode: number): VietnamDistrict[] {
  const city = vietnamCities.find((c) => c.code === cityCode);
  return city?.districts ?? [];
}

/**
 * Get a city by its code
 */
export function getCityByCode(code: number): VietnamCity | undefined {
  return vietnamCities.find((c) => c.code === code);
}

/**
 * Get a district by city code and district code
 */
export function getDistrictByCode(
  cityCode: number,
  districtCode: number
): VietnamDistrict | undefined {
  const districts = getDistrictsByCityCode(cityCode);
  return districts.find((d) => d.code === districtCode);
}

/**
 * Convert to service area payload format
 * Returns: [{ city: "...", district: "..." }]
 */
export function toServiceAreaPayload(
  cityCode: number,
  districtCode: number
): { city: string; district: string }[] {
  const city = getCityByCode(cityCode);
  const district = getDistrictByCode(cityCode, districtCode);

  if (!city || !district) return [];

  return [{ city: city.name, district: district.name }];
}
