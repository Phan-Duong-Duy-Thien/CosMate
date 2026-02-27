// Script to write the correct vi.ts with proper Vietnamese Unicode
const fs = require("fs");

const content = `/**
 * Vietnamese (VI) Language Dictionary
 *
 * Centralized text content for CosMate application
 *
 * STRUCTURE:
 * - common: Shared text across all features
 * - admin: Admin dashboard specific
 * - auth: Authentication (login/register)
 * - provider: Provider management
 * - profile: User profile
 * - costumeRental: Costume rental/shopping
 * - booking: Photographer/Staff booking
 * - general: Home page and general pages
 *
 * FUTURE: This structure will make English translation easy
 */

export const VI = {
  /**
   * Common shared text
   */
  common: {
    appName: "CosMate",
    appNameAdmin: "CosMate Admin",
    appNameProvider: "CosMate Provider",

    actions: {
      login: "Đăng nhập",
      logout: "Đăng xuất",
      register: "Đăng ký",
      save: "Lưu",
      cancel: "Hủy bỏ",
      back: "Quay lại",
      confirm: "Xác nhận",
      delete: "Xóa",
      edit: "Chỉnh sửa",
      submit: "Gửi",
      search: "Tìm kiếm",
      filter: "Lọc",
      sort: "Sắp xếp",
      viewMore: "Xem thêm",
      viewDetails: "Xem chi tiết",
      close: "Đóng",
      next: "Tiếp theo",
      previous: "Trước",
      continueWithGoogle: "Tiếp tục với Google",
      continueWithFacebook: "Tiếp tục với Facebook",
      continueWithEmail: "Hoặc tiếp tục với email",
    },

    status: {
      loading: "Đang tải...",
      loadingEllipsis: "Đang tải...",
      error: "Có lỗi xảy ra",
      success: "Thành công",
      noData: "Không có dữ liệu",
      pending: "Đang chờ",
      active: "Hoạt động",
      inactive: "Không hoạt động",
    },

    permission: {
      accessDenied: "Không có quyền truy cập",
      noPermissionMessage: "Bạn không có quyền truy cập trang này. Tính năng này có thể chưa được hỗ trợ cho loại tài khoản của bạn. Vui lòng liên hệ hỗ trợ nếu bạn cho rằng đây là lỗi.",
      goHome: "Về trang chủ",
      goLogin: "Về trang đăng nhập",
    },

    user: {
      profile: "Hồ sơ",
      account: "Tài khoản",
      settings: "Cài đặt",
    },
  },

  /**
   * Admin dashboard text
   */
  admin: {
    dashboard: {
      title: "Bảng điều khiển Admin",
      welcome: "Chào mừng trở lại, Admin!",
      todayOverview: "Đây là những gì đang diễn ra với CosMate hôm nay.",

      stats: {
        totalUsers: "Tổng người dùng",
        activeBookings: "Đơn đặt đang hoạt động",
        totalCostumes: "Tổng trang phục",
        revenue: "Doanh thu (VND)",
      },

      sections: {
        recentActivity: "Hoạt động gần đây",
        quickStats: "Thống kê nhanh",
        recentActivityPlaceholder: "TODO: Hiển thị hoạt động người dùng, đặt chỗ và sự kiện hệ thống gần đây",
        quickStatsPlaceholder: "TODO: Hiển thị biểu đồ và dữ liệu xu hướng",
      },
    },

    sidebar: {
      dashboard: "Bảng điều khiển",
      users: "Quản lý người dùng",
      bookings: "Đơn đặt / Đơn hàng",
      costumes: "Trang phục / Cho thuê",
      reports: "Báo cáo",
      settings: "Cài đặt",
    },

    users: {
      pageTitle: "Quản lý người dùng",

      columns: {
        id: "ID",
        username: "Tên đăng nhập",
        email: "Email",
        fullName: "Họ tên",
        phone: "SĐT",
        roles: "Vai trò",
        status: "Trạng thái",
        createdAt: "Ngày tạo",
        actions: "Hành động",
      },

      toolbar: {
        search: "Tìm kiếm theo tên, email, SĐT...",
        filterRole: "Lọc theo vai trò",
        filterStatus: "Lọc theo trạng thái",
        refresh: "Làm mới",
        allRoles: "Tất cả vai trò",
        allStatuses: "Tất cả trạng thái",
      },

      actions: {
        viewDetail: "Xem chi tiết",
        lock: "Khóa",
        unlock: "Mở khóa",
        ban: "Ban",
        unban: "Mở ban",
      },

      detail: {
        title: "Chi tiết người dùng",
        userId: "ID người dùng",
        basicInfo: "Thông tin cơ bản",
        accountInfo: "Thông tin tài khoản",
        noData: "—",
        actionsTitle: "Hành động",

        statusHint: {
          active: "Bạn có thể khóa hoặc ban tài khoản này.",
          inactive: "Tài khoản đang bị khóa. Bạn có thể mở khóa để kích hoạt lại.",
          banned: "Tài khoản đang bị ban. Bạn có thể mở ban để kích hoạt lại.",
        },
      },

      confirm: {
        lockTitle: "Xác nhận khóa người dùng",
        lockMessage: "Bạn có chắc chắn muốn khóa người dùng này? Họ sẽ không thể đăng nhập.",
        unlockTitle: "Xác nhận mở khóa người dùng",
        unlockMessage: "Bạn có chắc chắn muốn mở khóa người dùng này?",
        banTitle: "Xác nhận ban người dùng",
        banMessage: "Bạn có chắc chắn muốn ban người dùng này? Đây là hành động nghiêm trọng.",
        unbanTitle: "Xác nhận mở ban người dùng",
        unbanMessage: "Bạn có chắc chắn muốn mở ban người dùng này?",
        ok: "Xác nhận",
        cancel: "Hủy",
      },

      messages: {
        lockSuccess: "Đã khóa người dùng thành công",
        unlockSuccess: "Đã mở khóa người dùng thành công",
        banSuccess: "Đã ban người dùng thành công",
        unbanSuccess: "Đã mở ban người dùng thành công",
        actionError: "Có lỗi xảy ra khi thực hiện hành động",
        fetchError: "Không thể tải danh sách người dùng",
        noPermission: "Không có quyền thực hiện hành động này",
        cannotManageSelf: "Bạn không thể thao tác với chính mình.",
        cannotManageAdmin: "Bạn không thể thao tác với tài khoản quản trị (ADMIN/SUPERADMIN).",
      },
    },
  },

  /**
   * Authentication text
   */
  auth: {
    login: {
      title: "Chào mừng trở lại CosMate",
      subtitle: "Đăng nhập để tiếp tục hành trình cosplay của bạn",
      emailOrUsername: "Email hoặc tên người dùng",
      emailOrUsernamePlaceholder: "Nhập email hoặc tên người dùng của bạn",
      password: "Mật khẩu",
      passwordPlaceholder: "Nhập mật khẩu của bạn",
      forgotPassword: "Quên mật khẩu?",
      noAccount: "Mới sử dụng?",
      signUp: "Đăng ký",

      stats: {
        costumes: "Trang phục",
        users: "Người dùng",
        rentals: "Cho thuê",
      },

      validation: {
        emailRequired: "Email hoặc tên người dùng là bắt buộc.",
        passwordRequired: "Mật khẩu là bắt buộc.",
        passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự.",
      },

      messages: {
        loginFailed: "Đăng nhập thất bại. Vui lòng thử lại.",
        loginSuccess: "Đăng nhập thành công! Chào mừng bạn trở lại CosMate 🎉",
        invalidCredentials: "Không thể đăng nhập. Vui lòng kiểm tra thông tin đăng nhập và thử lại.",
      },
    },

    register: {
      title: "Tạo tài khoản mới",
      subtitle: "Tham gia cộng đồng CosMate ngay hôm nay",
      fullName: "Họ và tên",
      fullNamePlaceholder: "Nhập họ và tên đầy đủ",
      email: "Email",
      emailPlaceholder: "Nhập địa chỉ email",
      username: "Tên người dùng",
      usernamePlaceholder: "Chọn tên người dùng",
      phone: "Số điện thoại",
      phonePlaceholder: "0xxxxxxxxx",
      password: "Mật khẩu",
      passwordPlaceholder: "Tạo mật khẩu mạnh",
      confirmPassword: "Xác nhận mật khẩu",
      confirmPasswordPlaceholder: "Nhập lại mật khẩu",
      haveAccount: "Đã có tài khoản?",
      signIn: "Đăng nhập",
      createAccount: "Tạo tài khoản",

      roleSelect: {
        title: "Chọn vai trò của bạn",
        subtitle: "Chọn loại tài khoản bạn muốn tạo",
        cosplayer: {
          title: "Cosplayer",
          description: "Tạo hồ sơ cosplay và thuê trang phục.",
        },
        provider: {
          title: "Nhà cung cấp",
          description: "Liệt kê trang phục và quản lý cho thuê.",
        },
        staff: {
          title: "Nhân viên sự kiện",
          description: "Hỗ trợ sự kiện và quản lý nhân sự.",
        },
        photographer: {
          title: "Nhiếp ảnh gia",
          description: "Cung cấp dịch vụ chụp ảnh cho cosplayer.",
        },
      },

      validation: {
        fullNameRequired: "Họ và tên là bắt buộc.",
        emailRequired: "Email là bắt buộc.",
        emailInvalid: "Vui lòng nhập địa chỉ email hợp lệ.",
        usernameRequired: "Tên người dùng là bắt buộc.",
        usernameMinLength: "Tên người dùng phải có ít nhất 3 ký tự.",
        phoneRequired: "Số điện thoại là bắt buộc.",
        phoneInvalid: "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.",
        passwordRequired: "Mật khẩu là bắt buộc.",
        passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự.",
        confirmPasswordRequired: "Vui lòng xác nhận mật khẩu.",
        passwordMismatch: "Mật khẩu không khớp.",
      },

      messages: {
        registrationFailed: "Đăng ký thất bại. Vui lòng thử lại.",
        registrationSuccess: "Tài khoản đã được tạo thành công! Vui lòng đăng nhập để tiếp tục.",
        unableToRegister: "Không thể tạo tài khoản. Vui lòng thử lại.",
      },
    },
  },

  /**
   * Provider dashboard text
   */
  provider: {
    dashboard: {
      title: "Bảng điều khiển Provider",
      welcome: "Chào mừng trở lại, Provider!",
      overview: "Quản lý dịch vụ, đơn đặt và lịch trình của bạn từ đây.",

      stats: {
        activeListings: "Danh sách đang hoạt động",
        pendingBookings: "Đơn đặt đang chờ",
        upcomingSchedule: "Lịch trình sắp tới",
        averageRating: "Đánh giá trung bình",
      },

      sections: {
        recentBookings: "Đơn đặt gần đây",
        performanceOverview: "Tổng quan hiệu suất",
        quickTips: "Mẹo nhanh",
        recentBookingsPlaceholder: "TODO: Hiển thị yêu cầu đặt chỗ gần đây và cập nhật trạng thái",
        performancePlaceholder: "TODO: Hiển thị biểu đồ cho đơn đặt, doanh thu và đánh giá theo thời gian",
      },

      tips: [
        "Cập nhật danh sách dịch vụ của bạn với mô tả và ảnh chính xác",
        "Phản hồi yêu cầu đặt chỗ trong vòng 24 giờ để cải thiện xếp hạng",
        "Cập nhật lịch làm việc thường xuyên để tránh xung đột lịch trình",
        "Khuyến khích khách hàng hài lòng để lại đánh giá",
      ],
    },

    sidebar: {
      dashboard: "Bảng điều khiển",
      services: "Dịch vụ / Danh sách",
      costumeList: "Danh sách trang phục",
      costumeCreate: "Tạo trang phục",
      bookings: "Đơn đặt",
      schedule: "Lịch trình / Khả dụng",
      reviews: "Đánh giá",
      settings: "Hồ sơ / Cài đặt",
    },

    costumeManagement: {
      sectionTitle: "Quản lý trang phục",
      sectionDesc: "Tạo và quản lý danh sách trang phục cho thuê của bạn.",
      createBtn: "Tạo trang phục mới",
      listBtn: "Xem danh sách",
    },
  },

  /**
   * Profile page text
   */
  profile: {
    title: "Hồ sơ của tôi",
    edit: "Chỉnh sửa hồ sơ",
    gallery: "Bộ sưu tập",
    bookings: "Lịch đặt",
    favorites: "Yêu thích",
    settings: "Cài đặt",

    validation: {
      usernameRequired: "Tên người dùng là bắt buộc",
    },

    placeholders: {
      addTag: "Thêm thẻ",
    },
  },

  /**
   * Costume rental / shopping text
   */
  costumeRental: {
    title: "Cho thuê trang phục",
    searchPlaceholder: "Tìm kiếm trang phục...",
    filter: "Bộ lọc",
    sort: "Sắp xếp",
    categories: "Danh mục",
    priceRange: "Khoảng giá",
    size: "Kích cỡ",
    availability: "Còn hàng",
    rentNow: "Thuê ngay",
    addToCart: "Thêm vào giỏ",
    viewDetails: "Xem chi tiết",
  },

  /**
   * Booking (Photographer/Staff) text
   */
  booking: {
    photographer: {
      title: "Đặt nhiếp ảnh gia",
      searchPlaceholder: "Tìm nhiếp ảnh gia...",
      viewProfile: "Xem hồ sơ",
      bookNow: "Đặt ngay",
    },

    staff: {
      title: "Đặt nhân viên sự kiện",
      searchPlaceholder: "Tìm nhân viên...",
      viewProfile: "Xem hồ sơ",
      bookNow: "Đặt ngay",
    },
  },

  /**
   * General / Home page text
   */
  general: {
    home: {
      title: "CosMate - Nền tảng Cosplay hàng đầu",
      hero: {
        title: "Khám phá thế giới Cosplay",
        subtitle: "Tìm kiếm, thuê và tạo nên những trải nghiệm cosplay tuyệt vời",
        exploreNow: "Khám phá ngay",
      },

      sections: {
        featuredCostumes: "Trang phục nổi bật",
        popularShops: "Cửa hàng phổ biến",
        topPhotographers: "Nhiếp ảnh gia hàng đầu",
        recentEvents: "Sự kiện gần đây",
      },
    },
  },
};

/**
 * Type helper for accessing VI dictionary keys with autocomplete
 */
export type VIKeys = typeof VI;
`;

fs.writeFileSync("src/shared/i18n/vi.ts", content, "utf8");

// Verify
const verify = fs.readFileSync("src/shared/i18n/vi.ts", "utf8");
const checks = [
  ["Đăng nhập", verify.includes("Đăng nhập")],
  ["Đăng ký", verify.includes("Đăng ký")],
  ["Xác nhận", verify.includes("Xác nhận")],
  ["Tìm kiếm", verify.includes("Tìm kiếm")],
  ["Thuê ngay", verify.includes("Thuê ngay")],
  ["Bảng điều khiển", verify.includes("Bảng điều khiển")],
  ["Quản lý người dùng", verify.includes("Quản lý người dùng")],
  ["Không có dữ liệu", verify.includes("Không có dữ liệu")],
];
checks.forEach(([k, ok]) => console.log(ok ? "✓" : "✗", k));
console.log("Lines:", verify.split("\n").length);
