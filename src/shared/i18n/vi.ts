/**
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
   * Notification
   */
  notification: {
    empty: "Không có thông báo nào",
    emptyInFilter: "Không có thông báo trong mục này",
    viewAll: "Xem tất cả thông báo",
    title: "Thông báo",
    filterLabel: "Lọc nhanh",
    filterUnread: "Chưa đọc",
    filterRead: "Đã đọc",
    filterOrders: "Đơn hàng",
    filterMessages: "Tin nhắn",
    filterHintSidebar:
      "Chọn mục bên trái để lọc danh sách. Đơn hàng = loại từ hệ thống đơn hàng; Tin nhắn gồm chat và thông báo có nội dung gửi tin nhắn.",
    filterEmptyHintMobile: "Thử chọn mục khác ở thanh bên hoặc kéo ngang trên điện thoại.",
    railQuizBadge: "AI · Quiz",
    railQuizTitle: "Khám phá phong cách của bạn",
    railQuizCta: "Làm quiz ngay",
    railTipsBadge: "Mẹo nhanh",
    railTipsTitle: "Đừng để inbox chất đống!",
    railTipsBody:
      "Đánh dấu đọc và lọc theo \"Đơn hàng\" / \"Tin nhắn\" để xử lý tin quan trọng trước.",
    railShopBadge: "Khám phá",
    railShopTitle: "Trang phục mới mỗi tuần",
    railShopCta: "Xem danh sách",
    railChatBadge: "Chat CosMate",
    railChatTitle: "Trao đổi trực tiếp",
    railChatBody: "Mở hộp chat để nói chuyện với shop hoặc hỗ trợ.",
    railChatCta: "Mở tin nhắn",
    railHelpBadge: "Hỗ trợ",
    railHelpTitle: "Quy định & hướng dẫn",
    railHelpBody: "Thuê đồ, hoàn tiền, khiếu nại — đọc nhanh trước khi đặt.",
    railHelpCta: "Đọc hướng dẫn",
  },

  /**
   * Dispute
   */
  dispute: {
    button: "Khiếu nại",
    modalTitle: "Khiếu nại đơn hàng",
    reasonLabel: "Lý do khiếu nại",
    reasonPlaceholder: "Mô tả chi tiết vấn đề của bạn...",
    submit: "Gửi khiếu nại",
    imagesLabel: "Hình ảnh đính kèm",
    imagesOptional: "không bắt buộc",
    imagesHint: "Kéo thả hoặc nhấn để tải ảnh lên",
    uploadImages: "Tải ảnh lên",
    maxImagesWarning: "Tối đa 3 hình ảnh",
    maxImagesReached: "Đã đạt tối đa 3 ảnh",
    uploadingImages: "Đang tải ảnh...",
    uploadFailed: "Tải ảnh thất bại. Vui lòng thử lại.",
    reasonTooShort: "Lý do phải có ít nhất 10 ký tự",
    helperText: "Hình ảnh giúp CosMate xử lý khiếu nại nhanh hơn. Khuyến nghị tải lên ảnh/video làm bằng chứng.",
    // Staff resolve
    resolveModalTitle: "Giải quyết khiếu nại",
    resolveResultLabel: "Kết quả xử lý",
    resolveResultPlaceholder: "Mô tả chi tiết cách giải quyết...",
    resolvePenaltyAmountLabel: "Số tiền phạt (VND)",
    resolvePenaltyPercentLabel: "Phần trăm phạt (%)",
    resolveNotesLabel: "Ghi chú",
    resolveNotesPlaceholder: "Ghi chú bổ sung (nếu có)...",
    resolveSubmit: "Xác nhận giải quyết",
    resolving: "Đang xử lý...",
    resolveSuccess: "Giải quyết khiếu nại thành công",
    resolveError: "Không thể giải quyết khiếu nại. Vui lòng thử lại.",
    resolveAction: "Giải quyết",
    resultRequired: "Vui lòng nhập kết quả xử lý",
    penaltyAmountInvalid: "Số tiền phạt phải lớn hơn hoặc bằng 0",
    penaltyPercentInvalid: "Phần trăm phạt phải từ 0 đến 100",
    penaltyPercentPlaceholder: "0 - 100",
    penaltyAmountPlaceholder: "0",
    actionResolve: "Có thể giải quyết",
  },

  /**
   * Common shared text
   */
  common: {
    appName: "CosMate",
    appNameAdmin: "CosMate Admin",
    appNameProvider: "CosMate Provider",

    // Breadcrumb labels
    breadcrumb: {
      home: "Trang chủ",
      costumes: "Thuê đồ Cosplay",
      checkout: "Xác nhận đơn thuê",
      profile: "Hồ sơ",
      addresses: "Địa chỉ",
      addAddress: "Thêm địa chỉ",
      photographers: "Thuê Photographer",
      photographerProfile: "Hồ sơ Nhiếp ảnh gia",
      staffs: "Thuê Staff",
      staffProfile: "Hồ sơ Hỗ trợ sự kiện",
      serviceDetail: "Chi tiết dịch vụ",
      serviceDetailFromProfile: "Chi tiết dịch vụ",
      admin: "Quản trị",
      users: "Quản lý người dùng",
      provider: "Provider",
      providerCostumes: "Quản lý trang phục",
      create: "Tạo mới",
      edit: "Chỉnh sửa",
      providerPhotograph: "Provider Photographer",
      providerEventStaff: "Provider Staff Sự kiện",
    },

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
      refresh: "Làm mới",
      viewMore: "Xem thêm",
      viewDetails: "Xem chi tiết",
      close: "Đóng",
      next: "Tiếp theo",
      previous: "Trước",
      scrollToTop: "Lên đầu trang",
      continueWithGoogle: "Tiếp tục với Google",
      continueWithFacebook: "Tiếp tục với Facebook",
      continueWithEmail: "Hoặc tiếp tục với email",
      other: "Khác",
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
      online: "Trực tuyến",
      offline: "Ngoại tuyến",
      loadingDots: "Đang tải...",
      countOverflow: "99+",
    },

    // Toast messages
    toast: {
      success: "Thành công",
      error: "Đã xảy ra lỗi",
      loading: "Đang xử lý...",
      loginRequired: "Vui lòng đăng nhập để tiếp tục.",
      wishlist: {
        /** Hero /wishlist — cùng phong cách trang Thuê đồ Cosplay */
        pageHeroDecor:
          "･:*🌸࿔   ⋆. 𐙚˚࿔  Danh sách yêu thích  𝜗𝜚˚⋆   ࿔🌸*:･",
        addSuccess: "Đã thêm vào danh sách yêu thích.",
        removeSuccess: "Đã xóa khỏi danh sách yêu thích.",
        fetchFailed: "Không thể tải danh sách yêu thích.",
        removeFailed: "Không thể xóa khỏi danh sách yêu thích.",
        addFailed: "Không thể thêm vào danh sách yêu thích.",
        loginRequired: "Vui lòng đăng nhập để thêm vào yêu thích.",
        emptyTitle: "Danh sách yêu thích trống",
        emptyDescription: "Hãy thêm trang phục bạn thích vào đây nhé!",
        browseButton: "Khám phá trang phục",
        itemsCount: "mặt hàng",
        itemCount: "mặt hàng",
        viewDetails: "Xem chi tiết",
      },
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

    messages: {
      title: "Tin nhắn",
      noConversation: "Chưa chọn cuộc trò chuyện",
      selectConversation: "Chọn một cuộc trò chuyện từ danh sách",
      startConversation: "Bắt đầu trò chuyện",
      sayHello: "Chào hỏi để bắt đầu!",
      chatSearchPlaceholder: "Tìm theo tên hoặc username...",
      chatSearchAria: "Tìm người dùng để nhắn tin",
      chatExitSearch: "Thoát tìm kiếm",
      chatNoUsersFound: "Không tìm thấy người dùng",
      chatNeedLogin: "Vui lòng đăng nhập để nhắn tin.",
      chatStartFailed: "Không thể mở cuộc trò chuyện.",
      chatSelfNotAllowed: "Không thể mở chat với chính mình.",
      chatRoomNotFound:
        "Chưa có phòng chat với người này. Bắt đầu nhắn từ trang dịch vụ / cửa hàng để mở cuộc trò chuyện.",
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
        createUser: "Tạo người dùng",
        exportExcel: "Xuất Excel",
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

    aiTokenPurchases: {
      title: "Lịch sử mua AI Token",
      description: "Xem toàn bộ giao dịch mua token AI trên hệ thống.",
      refresh: "Làm mới",
      searchPlaceholder: "Tìm theo ID, user, transaction, trạng thái...",
      filterStatus: "Lọc trạng thái",
      empty: "Chưa có giao dịch mua token nào",
      loadError: "Không thể tải lịch sử mua token",
      detailError: "Không thể tải chi tiết giao dịch",
      detailFallback: "Hiển thị dữ liệu từ danh sách (API chi tiết không khả dụng)",
      viewDetail: "Xem chi tiết",
      detailTitle: "Chi tiết giao dịch #{id}",
      detailTitleFallback: "Chi tiết giao dịch",
      paginationTotal: "{count} giao dịch",
      columns: {
        id: "ID",
        userId: "User ID",
        subscriptionId: "Subscription ID",
        transactionId: "Transaction ID",
        priceAtPurchase: "Giá mua",
        tokensAdded: "Token cộng",
        purchaseDate: "Ngày mua",
        status: "Trạng thái",
        actions: "Thao tác",
      },
      statusLabels: {
        SUCCESS: "Thành công",
        FAILED: "Thất bại",
        PENDING: "Đang chờ",
        PROCESSING: "Đang xử lý",
        COMPLETED: "Hoàn thành",
        PAID: "Đã thanh toán",
        CANCELLED: "Đã hủy",
        CANCELED: "Đã hủy",
      },
    },

    costumes: {
      pageTitle: "Quản lý trang phục",

      columns: {
        id: "ID",
        name: "Tên trang phục",
        provider: "Nhà cung cấp",
        pricePerDay: "Giá / ngày",
        status: "Trạng thái",
        actions: "Hành động",
      },

      toolbar: {
        search: "Tìm kiếm theo tên, nhà cung cấp...",
        filterStatus: "Lọc theo trạng thái",
        refresh: "Làm mới",
        createCostume: "Tạo trang phục",
      },

      actions: {
        viewDetail: "Xem chi tiết",
        toggleStatus: "Đổi trạng thái",
        delete: "Xóa",
      },

      detail: {
        title: "Chi tiết trang phục",
        basicInfo: "Thông tin cơ bản",
        pricingInfo: "Thông tin giá",
        noData: "—",
      },

      confirm: {
        deleteTitle: "Xác nhận xóa trang phục",
        deleteMessage: "Bạn có chắc chắn muốn xóa trang phục này? Hành động này không thể hoàn tác.",
        ok: "Xác nhận",
        cancel: "Hủy",
      },

      messages: {
        deleteSuccess: "Đã xóa trang phục thành công",
        statusUpdatedSuccess: "Cập nhật trạng thái thành công",
        fetchError: "Không thể tải danh sách trang phục",
      },
    },
  },

  /**
   * Authentication text
   */
  auth: {
    hero: {
      promoLine: "Tìm nhân vật của bạn",
    },

    login: {
      title: "Mừng bạn đến với CosMate",
      subtitle: "Đăng nhập để tiếp tục hành trình cosplay của bạn",
      emailOrUsername: "Email hoặc tên người dùng",
      emailOrUsernamePlaceholder: "Nhập email hoặc tên người dùng của bạn",
      password: "Mật khẩu",
      passwordPlaceholder: "Nhập mật khẩu của bạn",
      forgotPassword: "Quên mật khẩu?",
      noAccount: "Mới sử dụng?",
      signUp: "Đăng ký",
      rememberMe: "Ghi nhớ đăng nhập",

      stats: {
        costumes: "Trang phục",
        users: "Người dùng",
        rentals: "Cho thuê",
      },

      validation: {
        emailRequired: "Email hoặc tên người dùng là bắt buộc.",
        passwordRequired: "Mật khẩu là bắt buộc.",
        passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự bao gồm ít nhất 1 chữ cái và 1 số.",
      },

      messages: {
        loginFailed: "Đăng nhập thất bại. Vui lòng thử lại.",
        loginSuccess: "Đăng nhập thành công! Chào mừng bạn trở lại CosMate 🎉",
        invalidCredentials: "Không thể đăng nhập. Vui lòng kiểm tra thông tin đăng nhập và thử lại.",
      },

      methodTabsLabel: "Phương thức đăng nhập",
      methodEmail: "Email / mật khẩu",
      methodQr: "Đăng nhập bằng QR",

      googleNotConfigured: "(chưa cấu hình)",
    },

    qrLogin: {
      intro:
        "Quét mã bằng app CosMate (đã đăng nhập) để đăng nhập trên trình duyệt này — không cần nhập mật khẩu.",
      steps: [
        "Mở app CosMate trên điện thoại và đăng nhập",
        "Vào mục Quét QR trong app",
        "Quét mã bên dưới và bấm xác nhận trên điện thoại",
      ],
      scanTitle: "Quét bằng app CosMate",
      waiting: (time: string) => `Đang chờ xác nhận trên app… (${time})`,
      expired: "Mã QR đã hết hạn. Bấm tạo mã mới để thử lại.",
      refreshQr: "Tạo mã QR mới",
      waitHint: "Chưa được xác nhận trên app. Hãy quét lại hoặc tạo mã QR mới.",
      appLoginHint:
        "Nếu app báo phiên đăng nhập hết hạn: mở app CosMate → đăng xuất → đăng nhập lại → quét mã mới trên web. App phải trỏ cùng API với web (api.cosmate.site).",
      messages: {
        sessionFailed: "Không tạo được mã QR. Vui lòng thử lại.",
        approvedNoToken: "Đã xác nhận nhưng không nhận được token từ máy chủ.",
        wsConnectFailed:
          "Không kết nối được WebSocket hoặc chưa nhận xác nhận từ app. Thử tạo mã QR mới và quét lại.",
      },
    },

    forgotPassword: {
      title: "Quên mật khẩu",
      subtitle: "Nhập email hoặc tên người dùng của bạn để nhận liên kết đặt lại mật khẩu.",
      identifierLabel: "Email hoặc tên người dùng",
      identifierPlaceholder: "Nhập email hoặc tên người dùng",
      sendButton: "Gửi liên kết",
      back: "Quay lại đăng nhập",
      successTitle: "Kiểm tra email của bạn",
      successMessage: "Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư đến.",
      backToLogin: "Quay lại đăng nhập",
      validation: {
        identifierRequired: "Email hoặc tên người dùng là bắt buộc.",
      },
      messages: {
        sendError: "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.",
      },
    },

    resetPassword: {
      title: "Đặt lại mật khẩu",
      subtitle: "Nhập mật khẩu mới cho tài khoản của bạn.",
      newPasswordLabel: "Mật khẩu mới",
      newPasswordPlaceholder: "Nhập mật khẩu mới",
      confirmPasswordLabel: "Xác nhận mật khẩu",
      confirmPasswordPlaceholder: "Nhập lại mật khẩu mới",
      submitButton: "Đặt lại mật khẩu",
      back: "Quay lại đăng nhập",
      successTitle: "Đặt lại mật khẩu thành công",
      successMessage: "Mật khẩu của bạn đã được đặt lại. Hãy đăng nhập với mật khẩu mới.",
      goToLogin: "Đăng nhập ngay",
      invalidTokenTitle: "Liên kết không hợp lệ",
      invalidTokenMessage: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email đặt lại mật khẩu.",
      backToLogin: "Quay lại đăng nhập",
      validation: {
        passwordRequired: "Mật khẩu là bắt buộc.",
        passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự.",
        confirmRequired: "Xác nhận mật khẩu là bắt buộc.",
      },
      messages: {
        passwordMismatch: "Mật khẩu xác nhận không khớp.",
        invalidToken: "Liên kết đặt lại mật khẩu không hợp lệ.",
        resetError: "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
      },
    },

    changePassword: {
      title: "Đổi mật khẩu",
      oldPassword: "Mật khẩu cũ",
      newPassword: "Mật khẩu mới",
      confirmPassword: "Xác nhận mật khẩu mới",
      placeholders: {
        oldPassword: "Nhập mật khẩu hiện tại",
        newPassword: "Nhập mật khẩu mới",
        confirmPassword: "Nhập lại mật khẩu mới",
      },
      submit: "Đổi mật khẩu",
      success: "Đổi mật khẩu thành công!",
      error: {
        required: "Vui lòng điền đầy đủ thông tin.",
        minLength: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        passwordMismatch: "Mật khẩu xác nhận không khớp.",
        failed: "Không thể đổi mật khẩu. Vui lòng thử lại.",
        notAuthenticated: "Vui lòng đăng nhập để đổi mật khẩu.",
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

      chooseOtherRole: "Chọn vai trò khác",
      continueWithForm: "Hoặc tiếp tục đăng ký với biểu mẫu",
      googleComingSoon: "sắp có",

      byRole: {
        cosplayer: {
          title: "Tạo tài khoản Cosplayer",
          subtitle: "Tham gia cộng đồng CosMate và bắt đầu hành trình cosplay của bạn.",
        },
        provider: {
          title: "Tạo tài khoản nhà cung cấp trang phục",
          subtitle:
            "Tham gia CosMate với vai trò nhà cung cấp cho thuê trang phục và quản lý danh mục của bạn.",
        },
        staff: {
          title: "Tạo tài khoản nhân viên sự kiện",
          subtitle: "Tham gia CosMate với vai trò nhân viên sự kiện và hỗ trợ các hoạt động cosplay.",
        },
        photographer: {
          title: "Tạo tài khoản nhiếp ảnh gia",
          subtitle: "Tham gia CosMate để cung cấp dịch vụ chụp ảnh cho cosplayer.",
        },
      },

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
        passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự, ít nhất 1 chữ cái và 1 số.",
        confirmPasswordRequired: "Vui lòng xác nhận mật khẩu.",
        passwordMismatch: "Mật khẩu không khớp.",
      },

      messages: {
        registrationFailed: "Đăng ký thất bại. Vui lòng thử lại.",
        registrationSuccess: "Tài khoản đã được tạo thành công! Vui lòng đăng nhập để tiếp tục.",
        unableToRegister: "Không thể tạo tài khoản. Vui lòng thử lại.",
      },
    },

    onboarding: {
      title: "Chọn vai trò của bạn",
      subtitle: "Hoàn tất hồ sơ bằng cách chọn vai trò phù hợp với bạn",
      selectRole: "Chọn vai trò",
      selected: "Đã chọn",
      continue: "Tiếp tục",
      skip: "Bỏ qua",
      loading: "Đang xử lý...",
      successTitle: "Hoàn tất thiết lập!",
      successMessage: "Vai trò của bạn đã được cập nhật thành công.",
      roleSelect: {
        cosplayer: {
          title: "Cosplayer",
          description: "Tạo hồ sơ cosplay, thuê trang phục và đặt dịch vụ.",
        },
        provider: {
          title: "Nhà cung cấp",
          description: "Cung cấp trang phục cho thuê hoặc dịch vụ chụp ảnh, hỗ trợ sự kiện.",
        },
        staff: {
          title: "Nhân viên sự kiện",
          description: "Hỗ trợ sự kiện cosplay với tư cách nhân viên.",
        },
        photographer: {
          title: "Nhiếp ảnh gia",
          description: "Cung cấp dịch vụ chụp ảnh cho cosplayer.",
        },
      },
      validation: {
        roleRequired: "Vui lòng chọn một vai trò để tiếp tục.",
      },
      messages: {
        updateFailed: "Cập nhật vai trò thất bại. Vui lòng thử lại.",
      },
    },
  },

  /**
   * Provider dashboard text
   */
  provider: {
    // Shop Profile (Public)
    shop: {
      title: "Hồ sơ shop",
      verified: "Đã xác minh",
      featured: "Shop nổi bật",
      chat: "Chat ngay",
      follow: "Theo dõi",
      contact: "Liên hệ",
      facebook: "Facebook",
      messenger: "Messenger",
      website: "Website",
      policies: {
        title: "Chính sách shop",
        rental: "Điều kiện thuê",
        deposit: "Tiền cọc",
        damage: "Chính sách hư hỏng",
        lateReturn: "Phạt trả muộn",
        cancellation: "Hủy/Hoàn tiền",
        notes: "Lưu ý khác",
      },
      stats: {
        rentals: "Lượt thuê",
        reviews: "Đánh giá",
        rating: "Đánh giá",
      },
      reviews: {
        title: "Đánh giá shop",
        summary: "Đánh giá",
        noReviews: "Chưa có đánh giá nào.",
        writeReview: "Viết đánh giá",
      },
      products: {
        title: "Sản phẩm của shop",
        searchPlaceholder: "Tìm sản phẩm...",
        sort: {
          label: "Sắp xếp",
          bestSelling: "Bán chạy",
          newest: "Mới nhất",
        },
        filter: {
          price: "Lọc theo giá",
          minPrice: "Giá từ",
          maxPrice: "đến",
        },
        noProducts: "Shop chưa có sản phẩm nào.",
      },
      recommended: {
        title: "Gợi ý sản phẩm phù hợp với bạn",
      },
      accessory: "Có phụ kiện",
      noAccessory: "Không phụ kiện",
      rental: "lượt thuê",
    },

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
      messages: "Tin nhắn",
      // Event Staff
      eventStaffDashboard: "Bảng điều khiển Staff",
      eventStaffSchedule: "Lịch làm việc",
      eventStaffBookings: "Đơn đặt Staff",
      eventStaffReviews: "Đánh giá",
      eventStaffSettings: "Hồ sơ / Cài đặt",
      // Photograph
      photographDashboard: "Bảng điều khiển PTG",
      photographSchedule: "Lịch chụp",
      photographBookings: "Đơn đặt PTG",
      photographReviews: "Đánh giá",
      photographSettings: "Hồ sơ / Cài đặt",
      wallet: "Ví của tôi",
    },

    dashboardPhotograph: {
      title: "Bảng điều khiển PTG",
      welcome: "Chào mừng trở lại, Photographer!",
      overview: "Quản lý dịch vụ chụp ảnh, lịch hẹn và đơn đặt của bạn từ đây.",
    },

    dashboardEventStaff: {
      title: "Bảng điều khiển Staff Sự kiện",
      welcome: "Chào mừng trở lại, Staff!",
      overview: "Quản lý công việc, lịch trình và đơn đặt của bạn từ đây.",
    },

    costumeManagement: {
      sectionTitle: "Quản lý trang phục",
      sectionDesc: "Tạo và quản lý danh sách trang phục cho thuê của bạn.",
      createBtn: "Tạo trang phục mới",
      listBtn: "Xem danh sách",
    },

    activation: {
      title: "Kích hoạt tài khoản Provider",
      subtitle: "Bạn cần đăng ký gói dịch vụ để bắt đầu sử dụng các tính năng của Provider.",
      choosePlan: "Chọn gói dịch vụ",
      paymentMethod: "Phương thức thanh toán",
      payWithVnpay: "VNPAY",
      payWithMomo: "MoMo",
      ctaSubscribe: "Đăng ký ngay",
      subscribing: "Đang xử lý...",
      loadingPlans: "Đang tải gói dịch vụ...",
      loadingProfile: "Đang kiểm tra tài khoản...",
      errorGeneric: "Có lỗi xảy ra. Vui lòng thử lại.",
      planMonth: "Gói 1 tháng",
      planQuarter: "Gói 3 tháng",
      planYear: "Gói 12 tháng",
      planCustom: "tháng",
      selectPlanRequired: "Vui lòng chọn gói dịch vụ.",
      selectMethodRequired: "Vui lòng chọn phương thức thanh toán.",
    },

    profileCompletion: {
      title: "Hoàn thiện hồ sơ Provider",
      subtitle: "Bạn cần cung cấp thông tin cửa hàng và tài khoản ngân hàng để bắt đầu sử dụng các tính năng của Provider.",
      step1Title: "Địa chỉ cửa hàng",
      step1SubTitle: "Chọn địa chỉ",
      step2Title: "Thông tin cửa hàng",
      step2SubTitle: "Cập nhật thông tin",
      requirementsLabel: "Thông tin cần cung cấp:",
      reqShopName: "Tên cửa hàng",
      reqAddress: "Địa chỉ cửa hàng",
      reqBio: "Giới thiệu về cửa hàng",
      reqBank: "Thông tin tài khoản ngân hàng",
      cta: "Cập nhật hồ sơ ngay",
      pageTitle: "Hoàn thiện hồ sơ",
      phase1Title: "Bước 1: Chọn địa chỉ cửa hàng",
      phase1Desc: "Chọn một địa chỉ có sẵn hoặc tạo địa chỉ mới để làm địa chỉ cửa hàng của bạn.",
      phase2Title: "Bước 2: Thông tin cửa hàng",
      phase2Desc: "Cung cấp thông tin cửa hàng và tài khoản ngân hàng để nhận thanh toán từ khách hàng.",
      loadingAddresses: "Đang tải địa chỉ...",
      existingAddresses: "Địa chỉ có sẵn",
      createNewAddress: "Tạo địa chỉ mới",
      addNewAddress: "+ Thêm địa chỉ mới",
      createAddressBtn: "Tạo địa chỉ",
      formName: "Tên người nhận",
      formNamePlaceholder: "VD: Nguyễn Văn A",
      formNameRequired: "Vui lòng nhập tên người nhận.",
      formPhone: "Số điện thoại",
      formPhonePlaceholder: "VD: 0901234567",
      formPhoneRequired: "Vui lòng nhập số điện thoại.",
      formCity: "Tỉnh/Thành phố",
      formCityPlaceholder: "Chọn tỉnh/thành phố",
      formCityRequired: "Vui lòng chọn tỉnh/thành phố.",
      formDistrict: "Phường/Xã",
      formDistrictPlaceholder: "Chọn phường/xã",
      formDistrictRequired: "Vui lòng chọn phường/xã.",
      formAddressName: "Tên địa chỉ",
      formAddressNamePlaceholder: "Ví dụ: Nhà, Shop, Công ty",
      formAddressNameRequired: "Vui lòng nhập tên địa chỉ.",
      formStreet: "Địa chỉ chi tiết",
      formStreetPlaceholder: "VD: 123 Nguyễn Trãi",
      formStreetRequired: "Vui lòng nhập địa chỉ chi tiết.",
      formShopName: "Tên cửa hàng",
      formShopNamePlaceholder: "VD: CosMate Shop",
      formBio: "Giới thiệu về cửa hàng",
      formBioPlaceholder: "Mô tả ngắn về cửa hàng của bạn...",
      formBankNumber: "Số tài khoản",
      formBankNumberPlaceholder: "Nhập số tài khoản",
      formBankName: "Tên ngân hàng",
      formBankNamePlaceholder: "Chọn ngân hàng",
      submitBtn: "Lưu và hoàn tất",
    },

    orders: {
      title: "Quản lý đơn thuê",
      searchPlaceholder: "Tìm kiếm theo mã đơn, ID cosplayer...",
      tabs: {
        all: "Tất cả",
        unpaid: "Chưa thanh toán",
        paid: "Chờ xác nhận",
        preparing: "Chờ giao hàng",
        shippingOut: "Đang giao hàng",
        deliveringOut: "Chờ nhận hàng",
        inUse: "Đang sử dụng",
        shippingBack: "Đang trả hàng",
        returned: "Đã trả",
        completed: "Hoàn thành",
        cancelled: "Đã hủy",
        dispute: "Tranh chấp",
        extending: "Gia hạn",
      },
      table: {
        orderId: "Mã đơn",
        cosplayer: "Cosplayer",
        total: "Tổng tiền",
        createdAt: "Ngày tạo",
        status: "Trạng thái",
        action: "Hành động",
      },
      actions: {
        prepare: "Xác nhận chuẩn bị",
        deliverOut: "Giao hàng",
        ship: "Gửi hàng",
        complete: "Hoàn tất",
      },
      shipModal: {
        title: "Gửi hàng",
        trackingCode: "Mã vận đơn",
        trackingCodePlaceholder: "Nhập mã vận đơn",
        carrierName: "Đơn vị vận chuyển",
        selectCarrier: "Chọn đơn vị vận chuyển",
        carrierNameOther: "Tên đơn vị vận chuyển khác",
        carrierNameOtherPlaceholder: "Nhập tên đơn vị vận chuyển",
        images: "Hình ảnh",
        uploadText: "Click or drag files to upload",
        uploadHint: "Hỗ trợ nhiều hình ảnh",
        imagePrefix: "Hình ảnh",
        noteLabel: "Ghi chú",
        notePlaceholder: "Nhập ghi chú cho hình ảnh này",
        submit: "Gửi hàng",
        cancel: "Hủy",
      },
      validation: {
        trackingRequired: "Vui lòng nhập mã vận đơn",
        carrierRequired: "Vui lòng nhập tên đơn vị vận chuyển",
        imagesRequired: "Vui lòng tải lên ít nhất một hình ảnh",
      },
      toast: {
        prepareSuccess: "Xác nhận chuẩn bị đơn thuê thành công",
        prepareFailed: "Không thể xác nhận chuẩn bị đơn thuê",
        deliverOutSuccess: "Cập nhật trạng thái giao hàng thành công",
        deliverOutFailed: "Không thể cập nhật trạng thái giao hàng",
        shipSuccess: "Gửi hàng thành công",
        shipFailed: "Không thể gửi hàng",
        completeSuccess: "Hoàn tất đơn thuê thành công",
        completeFailed: "Không thể hoàn tất đơn thuê",
      },
    },

    reviews: {
      title: "Quản lý đánh giá",
      columns: {
        reviewId: "Mã đánh giá",
        orderId: "Mã đơn",
        rating: "Số sao",
        comment: "Nội dung",
        images: "Hình ảnh",
        createdAt: "Ngày tạo",
        action: "Thao tác",
      },
      viewDetail: "Xem chi tiết",
      detailTitle: "Chi tiết đánh giá",
      detailReviewer: "Người đánh giá",
      detailReviewerFallback: "Khách hàng",
      detailComment: "Nội dung đánh giá",
      detailImages: "Hình ảnh đính kèm",
      detailNoImages: "Không có ảnh",
      detailNoComment: "Không có nội dung",
      empty: "Chưa có đánh giá nào",
      loadError: "Không thể tải danh sách đánh giá",
    },

    serviceOrders: {
      title: "Quản lý đơn đặt dịch vụ",
      sidebar: "Đơn đặt dịch vụ",
      empty: "Chưa có đơn đặt dịch vụ nào",
      loadError: "Không thể tải danh sách đơn đặt dịch vụ",
    },
  },

  /**
   * Profile page text
   */
  profile: {
    title: "Hồ sơ của tôi",
    dashboard: {
      title: "Hồ sơ tài khoản",
      subtitle: "Thông tin cơ bản của tài khoản đang đăng nhập",
      accountId: "Mã tài khoản",
    },
    edit: "Chỉnh sửa hồ sơ",
    handleLabel: "Tài khoản Cosplayer",
    cover: {
      editProfile: "Chỉnh sửa hồ sơ",
      accountCosplayer: "Tài khoản Cosplayer",
      uploadCover: "Tải ảnh bìa",
      uploadCoverSuccess: "Cập nhật ảnh bìa thành công.",
      uploadCoverFailed: "Không thể cập nhật ảnh bìa.",
      avatarPreviewTitle: "Ảnh đại diện",
      coverPreviewTitle: "Ảnh bìa",
    },
    crop: {
      avatarTitle: "Cắt ảnh đại diện",
      coverTitle: "Cắt ảnh bìa",
      zoom: "Thu phóng",
      apply: "Áp dụng",
    },
    token: {
      title: "Token CosMate",
      hubTitle: "Quản lý Token CosMate",
      balance: "Số token hiện có",
      manage: "Quản lý",
      buyMore: "Mua thêm",
      buySectionTitle: "Mua thêm token",
      viewHistory: "Xem lịch sử mua token",
      hideHistory: "Ẩn lịch sử mua token",
      noPurchases: "Chưa có giao dịch mua token",
      loadHistoryError: "Không thể tải lịch sử mua token",
      loading: "Đang tải...",
      transactionId: "Mã giao dịch",
      buyModalTitle: "Chọn gói token",
      buyModalEmpty: "Chưa có gói token khả dụng",
      buyModalLoadError: "Không tải được danh sách gói",
      selectPayment: "Phương thức thanh toán",
      buy: "Mua",
      purchaseError: "Không thể tạo thanh toán",
      purchaseInvalidUrl: "Liên kết thanh toán không hợp lệ",
      walletPay: "Ví CosMate",
      walletPayDesc: "Thanh toán bằng số dư ví CosMate",
      walletInsufficient: "Số dư ví không đủ để mua gói này",
      columns: {
        name: "Tên gói",
        price: "Giá",
        numberOfToken: "Số token",
        description: "Mô tả",
        actions: "Hành động",
      },
    },

    bio: {
      title: "Giới thiệu",
      placeholder: "Viết vài dòng để giới thiệu về bạn...",
      edit: "Chỉnh sửa",
      save: "Lưu",
      cancel: "Hủy",
    },
    gallery: "Bộ sưu tập",
    bookings: "Lịch đặt",
    favorites: "Yêu thích",
    settings: "Cài đặt",
    fullName: "Họ tên",
    phone: "Số điện thoại",
    avatar: "Ảnh đại diện",
    
    validation: {
      usernameRequired: "Tên người dùng là bắt buộc",
      fullNameRequired: "Họ tên là bắt buộc.",
      phoneRequired: "Số điện thoại là bắt buộc.",
      phoneInvalid: "Số điện thoại không hợp lệ.",
    },

    placeholders: {
      addTag: "Thêm thẻ",
      fullName: "Nhập họ tên",
      phone: "Nhập số điện thoại",
    },

    editModal: {
      title: "Cập nhật hồ sơ",
      tabs: {
        basicInfo: "Thông tin cơ bản",
        address: "Địa chỉ",
      },
      uploadAvatar: "Tải ảnh lên",
      uploading: "Đang tải ảnh...",
      saveBasicInfo: "Lưu thông tin",
      updateSuccess: "Cập nhật thông tin thành công.",
      uploadAvatarSuccess: "Tải ảnh đại diện thành công.",
      addressPlaceholder: "Tính năng địa chỉ sẽ sớm được hỗ trợ.",
    },

    messages: {
      updateFailed: "Không thể cập nhật hồ sơ.",
      uploadAvatarFailed: "Không thể tải ảnh đại diện.",
      loginRequired: "Vui lòng đăng nhập để cập nhật hồ sơ.",
    },

    // Address form
    address: {
      createPage: {
        title: "Thêm địa chỉ mới",
        subtitle: "Vui lòng nhập thông tin địa chỉ giao hàng của bạn",
      },
      form: {
        recipientName: "Tên người nhận",
        recipientNamePlaceholder: "Ví dụ: Nguyễn Văn A",
        phone: "Số điện thoại",
        phonePlaceholder: "Nhập số điện thoại",
        addressName: "Tên địa chỉ",
        addressNamePlaceholder: "Ví dụ: Nhà, Công ty, Shop",
        city: "Tỉnh/Thành phố",
        cityPlaceholder: "Chọn Tỉnh/Thành phố",
        district: "Phường/Xã",
        districtPlaceholder: "Chọn Phường/Xã",
        streetAddress: "Địa chỉ chi tiết",
        streetAddressPlaceholder: "Số nhà, tên đường",
      },
      validation: {
        required: "Trường này là bắt buộc",
        invalidPhone: "Số điện thoại không hợp lệ",
        selectCity: "Vui lòng chọn Tỉnh/Thành phố",
        selectDistrict: "Vui lòng chọn Phường/Xã",
        selectWard: "Vui lòng chọn Phường/Xã",
      },
      button: {
        save: "Lưu địa chỉ",
        add: "Thêm địa chỉ",
        edit: "Sửa",
        delete: "Xóa",
        back: "Quay lại",
      },
      messages: {
        createSuccess: "Thêm địa chỉ thành công!",
        updateSuccess: "Cập nhật địa chỉ thành công!",
        deleteSuccess: "Xóa địa chỉ thành công!",
        createError: "Không thể thêm địa chỉ. Vui lòng thử lại.",
        saveError: "Không thể lưu địa chỉ. Vui lòng thử lại.",
      },
      confirm: {
        delete: "Bạn có chắc muốn xóa địa chỉ này không?",
      },
    },

    addresses: {
      title: "Địa chỉ",
      showMore: "Hiển thị thêm",
      collapse: "Thu gọn",
      empty: "Bạn chưa có địa chỉ nào.",
      loading: "Đang tải địa chỉ...",
      error: "Không thể tải danh sách địa chỉ.",
    },

    hub: {
      title: "Trung tâm tài khoản",
      edit: "Chỉnh sửa hồ sơ",
    },

    orders: {
      title: "Đơn thuê trang phục",
      history: "Xem lịch sử mua hàng",
      pendingConfirm: "Chờ xác nhận",
      pendingPickup: "Chờ lấy hàng",
      shipping: "Chờ giao hàng",
      review: "Đánh giá",
      historyPlaceholder: "Lịch sử mua hàng sẽ hiển thị tại đây.",
      filterLabel: "Bộ lọc hiện tại",
      tabAll: "Tất cả",
      tabWaitConfirm: "Chờ xác nhận",
      tabWaitShipping: "Chờ giao hàng",
      tabShippingOut: "Đang giao",
      tabDeliveringOut: "Chờ nhận",
      tabInUse: "Đang sử dụng",
      tabShippingBack: "Đang trả hàng",
      tabCompleted: "Hoàn thành",
      tabCancelled: "Đã hủy",
      tabDispute: "Tranh chấp",
      empty: "Không có đơn hàng nào",
      loadError: "Không thể tải danh sách đơn hàng",
      // Status labels for list
      statusShippingOut: "Đang giao",
      statusDeliveringOut: "Chờ nhận",
      statusDeliveryOut: "Giao đến",
      statusShippingBack: "Đang trả hàng",
      statusUnpaid: "Chưa thanh toán",
      // Card display
      orderTitle: "Đơn hàng",
      orderCodeLabel: "Mã đơn",
      cardCostumeName: "Trang phục",
      orderCodePrefix: "RN",
      cardRentPeriod: "Thuê",
      cardDayCount: "ngày",
      cardTotal: "Tổng cộng",
      // Actions
      actionViewDetail: "Xem chi tiết đơn",
      actionConfirmDelivery: "Xác nhận nhận hàng",
      confirmDeliveryQr: {
        intro:
          "Dùng app CosMate trên điện thoại để chụp ảnh xác nhận. Sau khi ảnh hiển thị bên dưới (1–5 tấm), bấm xác nhận trên máy tính.",
        steps: [
          "Mở app CosMate và đăng nhập cùng tài khoản với web",
          "Vào mục Quét QR trong app",
          "Quét mã QR bên dưới, chụp và gửi 1–5 ảnh",
        ],
        scanTitle: "Quét bằng app CosMate",
        refreshQr: "Tạo mã QR mới",
        refreshQrWait: (time: string) => `Tạo mã mới sau ${time}`,
        refreshQrCooldown: (time: string) =>
          `Bạn chỉ có thể tạo mã QR mới sau ${time} (tối đa 1 lần / 15 phút).`,
        previewTitle: "Ảnh từ điện thoại",
        waitingImages: "Chưa có ảnh — đang chờ bạn gửi từ app…",
        apiNote: "Ảnh từ điện thoại hiện tự động khi app gửi thành công. Sau đó bấm xác nhận để hoàn tất đơn.",
        imageLoadFailed: "Không tải được ảnh xác nhận từ máy chủ",
        apiPending: "Chưa thể hoàn tất — đang chờ API xác nhận từ backend.",
        needImages: "Cần ít nhất 1 ảnh từ điện thoại trước khi xác nhận.",
        tooManyImages: "Tối đa 5 ảnh xác nhận.",
        sessionFailed: "Không tạo được phiên QR. Vui lòng thử lại.",
        sessionExpired:
          "Mã QR đã hết hạn. Bấm «Tạo mã QR mới» (sau khi hết chờ) hoặc đăng nhập lại app trên điện thoại rồi quét lại.",
        appLoginHint:
          "Nếu app báo phiên đăng nhập hết hạn: mở app CosMate → đăng xuất → đăng nhập lại → quét mã mới trên web.",
      },
      actionProcessing: "Đang xử lý...",
      // Toast messages
      toastConfirmDeliverySuccess: "Xác nhận nhận hàng thành công",
      toastConfirmDeliveryFailed: "Không thể xác nhận nhận hàng",
      toastReturnSuccess: "Gửi yêu cầu trả hàng thành công",
      toastReturnFailed: "Không thể gửi yêu cầu trả hàng",
      // Return order action
      actionReturn: "Trả hàng",
      returnTrackingCode: "Mã vận đơn",
      returnTrackingCodePlaceholder: "Nhập mã vận đơn",
      returnImages: "Hình ảnh xác nhận",
      // Validation
      validation: {
        imagesRequired: "Vui lòng tải lên ít nhất một hình ảnh",
      },
      validationReturn: {
        trackingRequired: "Vui lòng nhập mã vận đơn",
        imagesRequired: "Vui lòng tải lên ít nhất một hình ảnh",
      },
      // Review action
      actionReview: "Đánh giá",
      reviewModal: {
        ratingLabel: "Chọn số sao",
        commentLabel: "Nội dung đánh giá",
        commentPlaceholder: "Chia sẻ trải nghiệm của bạn...",
        imagesLabel: "Thêm hình ảnh",
        submit: "Gửi đánh giá",
        cancel: "Hủy",
      },
      toastReviewSuccess: "Gửi đánh giá thành công",
      toastReviewFailed: "Không thể gửi đánh giá",
      toastDisputeSuccess: "Đã gửi khiếu nại thành công",
      toastDisputeFailed: "Gửi khiếu nại thất bại",
      actionCancel: "Hủy đơn",
      toastCancelSuccess: "Hủy đơn thành công",
      toastCancelFailed: "Không thể hủy đơn",
      cancelModal: {
        title: "Xác nhận hủy đơn",
        message: "Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
      },
      validationReview: {
        ratingRequired: "Vui lòng chọn số sao đánh giá",
      },
      // Pagination
      paginationCostume: "Đơn thuê trang phục",
      paginationService: "Đơn đặt dịch vụ",
      paginationShow: "hiển thị",
      paginationOf: "trong tổng",
    },

    serviceOrders: {
      title: "Lịch sử đơn hàng",
      tabCostume: "Đơn thuê trang phục",
      tabService: "Đơn đặt dịch vụ",
      empty: "Chưa có đơn đặt dịch vụ nào",
      loadError: "Không thể tải danh sách đơn đặt dịch vụ",
      orderTitle: "Đặt dịch vụ",
      orderCodePrefix: "SE",
      cardBookingDate: "Ngày đặt",
      cardTimeSlot: "Khung giờ",
      cardPeopleCount: "Số người",
      cardSlotAmount: "Số slot",
      cardBookings: "Lịch đặt",
      /** Cột / modal: tiền theo slot (không nhầm với «số slot») */
      detailSlotAmount: "Thành tiền slot",
      detailStatusLabel: "Trạng thái",
      detailCreatedLabel: "Ngày tạo đơn",
      cardBookingsCount: "lịch đặt",
      cardMoreBookings: "thêm lịch đặt",
      statusUnconfirm: "Chờ xác nhận",
      statusUnpaid: "Chưa thanh toán",
      statusPaid: "Đã thanh toán",
      statusWaitingServiceDate: "Chờ ngày dịch vụ",
      statusInService: "Đang thực hiện",
      statusCompleted: "Hoàn thành",
      statusDispute: "Tranh chấp",
      statusCancelled: "Đã hủy",
      filterLabel: "Bộ lọc hiện tại",
      chatTooltip: "Nhắn tin",
      // Set Waiting action
      setWaiting: "Chờ ngày thực hiện",
      setWaitingModalTitle: "Xác nhận chuyển trạng thái",
      setWaitingModalMessage: "Bạn có chắc chắn muốn chuyển đơn này sang trạng thái \"Chờ ngày thực hiện\" không?",
      setWaitingModalOk: "Xác nhận",
      // Start Service action
      startService: "Bắt đầu dịch vụ",
      startServiceModalTitle: "Xác nhận bắt đầu dịch vụ",
      startServiceModalMessage: "Bắt đầu dịch vụ ngay bây giờ?",
      startServiceModalOk: "Bắt đầu",
      // Complete Service action
      completeService: "Hoàn thành dịch vụ",
      completeServiceModalTitle: "Xác nhận hoàn thành dịch vụ",
      completeServiceModalMessage: "Bạn có chắc chắn muốn xác nhận hoàn thành dịch vụ này không?",
      completeServiceModalOk: "Xác nhận",
      // Confirm & Pay
      btnConfirmAndPay: "Xác nhận & Thanh toán",
      btnPayNow: "Thanh toán ngay",
      btnProcessing: "Đang xử lý...",
      toastConfirmPaySuccess: "Xác nhận thành công! Đang chuyển đến thanh toán...",
      toastConfirmPayFailed: "Xác nhận và thanh toán thất bại",
      toastPayFailed: "Thanh toán thất bại",
      toastPaySuccess: "Đang chuyển đến thanh toán...",
    },

    servicePayment: {
      modalTitle: "Chọn phương thức thanh toán",
      totalLabel: "Tổng cần thanh toán",
      btnConfirm: "Xác nhận",
      btnProcessing: "Đang xử lý...",
    },
  },

  /**
   * Wallet page text
   */
  wallet: {
    title: "Ví của tôi",
    balance: "Số dư ví",
    depositBalance: "Tiền cọc",
    manage: "Quản lý ví",
    topup: "Nạp tiền vào ví",
    topupPlaceholder: "Tính năng nạp tiền sẽ sớm được hỗ trợ.",
    amount: "Số tiền nạp",
    amountPlaceholder: "Nhập số tiền",
    submit: "Nạp tiền",

    // Transaction history
    viewTransactions: "Xem giao dịch",
    hideTransactions: "Ẩn giao dịch",
    transactionDate: "Ngày",
    transactionType: "Loại giao dịch",
    transactionAmount: "Số tiền",
    transactionStatus: "Trạng thái",
    noTransactions: "Chưa có giao dịch nào",
    loading: "Đang tải...",
    walletError: "Không thể tải thông tin ví",

    // Wallet checkout validation
    checkoutValidation: {
      insufficientTitle: "Số dư ví không đủ",
      balanceLabel: "Số dư hiện tại",
      totalLabel: "Tổng cần thanh toán",
      missingLabel: "Thiếu",
      topUpCta: "Nạp thêm",
      payWithWalletNote: "Thanh toán bằng số dư ví CosMate",
    },

    // Transaction status
    statusCompleted: "Hoàn thành",
    statusFailed: "Thất bại",
    statusPending: "Đang chờ",

    // Transaction types
    typeTopUp: "Nạp tiền",
    typePayment: "Thanh toán",
    typeRefund: "Hoàn tiền",
    typeDeposit: "Đặt cọc",
    typeOther: "Khác",

    // Top-up form
    topUpTitle: "Nạp tiền vào ví",
    topUpDescription: "Nhập số tiền và chọn phương thức thanh toán",
    topUpSuccessResume: "Nạp tiền thành công! Bạn có thể tiếp tục thanh toán.",
    paymentMethodLabel: "Phương thức thanh toán",
    momo: "MoMo",
    momoDesc: "Thanh toán nhanh qua ứng dụng MoMo",
    vnpay: "VNPAY",
    vnpayDesc: "Thanh toán qua ngân hàng hoặc thẻ ATM",
    invalidAmount: "Số tiền phải lớn hơn 0",
    selectPaymentMethod: "Vui lòng chọn phương thức thanh toán",
    processing: "Đang xử lý...",
    error: "Có lỗi xảy ra. Vui lòng thử lại.",

    // Withdraw form
    withdraw: "Rút tiền",
    withdrawTitle: "Rút tiền từ ví",
    withdrawDescription: "Nhập số tiền và thông tin tài khoản ngân hàng để rút tiền",
    withdrawAmountLabel: "Số tiền rút",
    withdrawAmountPlaceholder: "Nhập số tiền muốn rút",
    withdrawBankAccountLabel: "Số tài khoản",
    withdrawBankAccountPlaceholder: "Nhập số tài khoản ngân hàng",
    withdrawBankNameLabel: "Tên ngân hàng",
    withdrawBankNamePlaceholder: "Nhập tên ngân hàng",
    withdrawSubmit: "Rút tiền",
    withdrawProcessing: "Đang xử lý...",
    withdrawSuccess: "Yêu cầu rút tiền đã được gửi thành công",
    withdrawError: "Không thể gửi yêu cầu rút tiền. Vui lòng thử lại.",
    withdrawValidationInvalidAmount: "Số tiền rút phải lớn hơn 0",
    withdrawValidationBankAccountRequired: "Vui lòng nhập số tài khoản",
    withdrawValidationBankNameRequired: "Vui lòng nhập tên ngân hàng",
  },

  /**
   * Order detail text
   */
  order: {
    detail: {
      title: "Chi tiết đơn hàng",
      basicInfo: "Thông tin cơ bản",
      costumeInfo: "Trang phục thuê",
      orderId: "Mã đơn",
      status: "Trạng thái",
      totalAmount: "Tổng tiền",
      createdAt: "Ngày tạo",
      rentalInfo: "Thông tin thuê",
      size: "Kích cỡ",
      numberOfItems: "Số lượng",
      rentDay: "Số ngày thuê",
      rentStart: "Ngày bắt đầu",
      rentEnd: "Ngày kết thúc",
      depositAmount: "Tiền cọc",
      rentAmount: "Tiền thuê",
      surchargeAmount: "Phụ phí",
      accessoriesAmount: "Phụ kiện",
      rentOptionAmount: "Gói thuê",
      rentalOptions: "Gói thuê",
      accessories: "Phụ kiện",
      surcharges: "Phụ phí",
      addresses: "Địa chỉ",
      cosplayerAddress: "Địa chỉ người thuê",
      providerAddress: "Địa chỉ nhà cung cấp",
      trackings: "Theo dõi vận chuyển",
      images: "Hình ảnh",
      empty: "Không có dữ liệu",
      trackingCode: "Mã vận đơn",
      trackingStatus: "Trạng thái",
      stage: "Giai đoạn",
      /** Mã API `trackingStatus` → hiển thị tiếng Việt (theo dõi vận chuyển) */
      trackingStatusLabels: {
        CREATED: "Đã ghi nhận vận đơn",
        RETURN_CREATED: "Đã ghi nhận vận đơn trả hàng",
        UPDATED: "Đã cập nhật",
        DELIVERED: "Đã giao",
        CANCELLED: "Đã hủy",
      },
      /** Mã API `stage` → hiển thị tiếng Việt */
      trackingStageLabels: {
        SHIPPING_OUT: "Đang giao đến khách",
        SHIPPING_BACK: "Đang hoàn trả về cửa hàng",
        DELIVERING_OUT: "Chờ khách xác nhận nhận hàng",
        RETURNED: "Đã trả hàng",
        PREPARING: "Đang chuẩn bị",
        IN_TRANSIT: "Đang vận chuyển",
      },
    },
    actions: {
      viewDetail: "Xem chi tiết",
    },
    extend: {
      title: "Gia hạn thuê",
      subtitle: "Chọn số ngày muốn gia hạn và phương thức thanh toán.",
      extendDaysLabel: "Số ngày gia hạn",
      daysSuffix: "ngày",
      minDaysError: "Vui lòng nhập ít nhất 1 ngày.",
      paymentMethodLabel: "Phương thức thanh toán",
      btnConfirm: "Xác nhận gia hạn",
      btnProcessing: "Đang xử lý...",
      extendHistory: "Lịch sử gia hạn",
      createdAt: "Thời gian",
      oldReturnDate: "Ngày trả cũ",
      newReturnDate: "Ngày trả mới",
      extendDays: "Số ngày",
      extendPrice: "Phí gia hạn",
      paymentStatus: "Thanh toán",
      viewDetail: "Chi tiết",
      payNow: "Thanh toán ngay",
      empty: "Chưa có lịch sử gia hạn.",
      paymentStatusLabels: {
        PAID: "Đã TT",
        PENDING: "Chờ TT",
        FAILED: "Thất bại",
      },
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
    viewDetail: "Xem chi tiết",
    costumeName: "Tên trang phục",
    /** Costume list: line under title — e.g. Name (từ Series) */
    characterFromWork: "từ",
    /** Costume detail: heading above character list */
    charactersHeading: "Nhân vật",
    /** Costume list card — shop line */
    listShopLabel: "Shop",
    description: "Mô tả",
    rentPurpose: "Mục đích thuê",
    numberOfItems: "Số lượng món",
    pricePerDay: "Giá theo ngày",
    rentDiscount: "Giảm giá thuê",
    depositAmount: "Tiền cọc",
    status: "Trạng thái",
    /** Trạng thái hiển thị công khai (chi tiết / danh sách trang phục) */
    costumeStatus: {
      available: "Có sẵn",
      rented: "Đang được thuê",
      maintenance: "Bảo trì",
      disabled: "Tạm ngừng",
    },
    providerId: "ID nhà cung cấp",
    imageUrls: "Danh sách ảnh",
    isRequired: "Bắt buộc",
    detailSectionTitle: "Thông tin chi tiết",

    // Costume Detail Page Enhancements
    detail: {
      productDetailTitle: "CHI TIẾT SẢN PHẨM",
      productDescriptionTitle: "MÔ TẢ SẢN PHẨM",
      shopFeatured: "Shop nổi bật",
      chatNow: "Chat ngay",
      viewShop: "Xem shop",
      rentalCount: "Lượt thuê",
      reviewsTitle: "Đánh giá",
      myReviewTitle: "Đánh giá của tôi",
      ratingOfYou: "Đánh giá của bạn:",
      rentedBanner: "Trang phục này hiện đang được thuê. Vui lòng quay lại sau.",
      rentedButton: "Đã được thuê",
      writeReviewPlaceholder: "Chia sẻ cảm nhận của bạn...",
      submitReview: "Gửi đánh giá",
      moreFromShop: "Sản phẩm khác của shop",
      noReviews: "Chưa có đánh giá nào.",
      ratingLabel: "Đánh giá",
      totalReviews: "đánh giá",
      writeReview: "Viết đánh giá",
      uploadImages: "Tải ảnh lên",
      addPhotos: "Thêm ảnh",
      loadReviewsError: "Không thể tải đánh giá.",
      reviewer: "Người dùng",
      validation: {
        ratingRequired: "Vui lòng chọn số sao đánh giá.",
        commentRequired: "Vui lòng nhập nội dung đánh giá.",
      },
    },

    // Validation messages
    validation: {
      missingRentStart: "Vui lòng chọn ngày bắt đầu thuê",
      invalidRentDay: "Số ngày thuê phải lớn hơn 0",
    },

    // Edit Costume Modal - Fees Tab
    editCostume: {
      title: "Chỉnh sửa trang phục",
      basicInfoTab: "Thông tin cơ bản",
      feesTab: "Phụ phí & Gói thuê",
      imagesTab: "Hình ảnh",
      loadingDetail: "Đang tải dữ liệu...",
      loadError: "Không thể tải dữ liệu trang phục.",
    },

    surcharges: {
      title: "Phụ phí",
      add: "Thêm phụ phí",
      edit: "Sửa phụ phí",
      empty: "Không có phụ phí nào.",
      emptyWithButton: "Không có phụ phí nào.",
      createSuccess: "Thêm phụ phí thành công!",
      updateSuccess: "Cập nhật phụ phí thành công!",
      createError: "Thêm phụ phí thất bại.",
      updateError: "Cập nhật phụ phí thất bại.",
      form: {
        name: "Tên",
        namePlaceholder: "Nhập tên phụ phí",
        description: "Mô tả",
        descriptionPlaceholder: "Nhập mô tả (không bắt buộc)",
        price: "Giá (VNĐ)",
        pricePlaceholder: "Nhập giá phụ phí",
      },
    },

    rentalOptions: {
      title: "Gói thuê",
      add: "Thêm gói thuê",
      edit: "Sửa gói thuê",
      empty: "Không có gói thuê nào.",
      emptyWithButton: "Không có gói thuê nào.",
      createSuccess: "Thêm gói thuê thành công!",
      updateSuccess: "Cập nhật gói thuê thành công!",
      createError: "Thêm gói thuê thất bại.",
      updateError: "Cập nhật gói thuê thất bại.",
      requireExactlyFour: "Phải có đúng 4 gói thuê (FEST, SHOOT, TEST, EVENT) trước khi lưu.",
      duplicateName: "Tên gói thuê bị trùng. Mỗi loại gói chỉ được thêm một lần.",
      maxFourReached: "Đã đạt tối đa 4 gói thuê.",
      form: {
        name: "Loại gói",
        namePlaceholder: "Chọn loại gói",
        description: "Mô tả",
        descriptionPlaceholder: "Nhập mô tả (không bắt buộc)",
        price: "Giá (VNĐ)",
        pricePlaceholder: "Nhập giá gói thuê",
      },
    },

    accessories: {
      title: "Phụ kiện",
      add: "Thêm phụ kiện",
      edit: "Sửa phụ kiện",
      empty: "Không có phụ kiện nào.",
      emptyWithButton: "Không có phụ kiện nào.",
      createSuccess: "Thêm phụ kiện thành công!",
      updateSuccess: "Cập nhật phụ kiện thành công!",
      createError: "Thêm phụ kiện thất bại.",
      updateError: "Cập nhật phụ kiện thất bại.",
      reachedMaxItems: "Đã đạt số lượng phụ kiện tối đa cho trang phục này.",
      required: "Bắt buộc",
      optional: "Tùy chọn",
      form: {
        name: "Tên",
        namePlaceholder: "Nhập tên phụ kiện",
        description: "Mô tả",
        descriptionPlaceholder: "Nhập mô tả (không bắt buộc)",
        price: "Giá (VNĐ)",
        pricePlaceholder: "Nhập giá phụ kiện",
        isRequired: "Bắt buộc",
        isRequiredHint: "Khách hàng phải thuê phụ kiện này",
      },
    },

    common: {
      save: "Lưu",
      cancel: "Hủy",
      edit: "Sửa",
    },

    // Costume Images
    images: {
      title: "Hình ảnh trang phục",
      main: "Ảnh chính (MAIN)",
      detail: "Ảnh chi tiết (DETAIL)",
      noImages: "Chưa có ảnh.",
      addDetail: "Thêm ảnh chi tiết",
      uploadMainRequired: "Vui lòng tải lên ít nhất 1 ảnh chính.",
      deleteMainNotAllowed: "Không thể xóa ảnh chính duy nhất. Hãy thêm ảnh chính mới trước.",
      replaceMain: "Thay ảnh chính",
      delete: "Xóa",
      replace: "Thay ảnh",
      uploadError: "Tải ảnh lên thất bại. Vui lòng thử lại.",
      uploadDetailPartialError: "Một số ảnh chi tiết tải lên thất bại. Bạn có thể thêm lại trong phần chỉnh sửa.",
      deleteError: "Xóa ảnh thất bại. Vui lòng thử lại.",
    },
  },

  /**
   * Booking (Photographer/Staff) text
   */
  booking: {
    create: {
      title: "Tạo đơn đặt",
      customer: "Khách hàng",
      service: "Dịch vụ",
      selectService: "-- Chọn dịch vụ --",
      bookingDate: "Ngày đặt",
      time: "Thời gian",
      numberOfPeople: "Số người",
      price: "Giá dịch vụ",
      cancel: "Hủy",
      create: "Tạo đơn đặt",
      creating: "Đang tạo...",
      success: "Đặt dịch vụ thành công!",
      error: "Không thể tạo đơn đặt. Vui lòng thử lại.",
    },
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
   * Service creation text
   */
  service: {
    sidebar: {
      createService: "Tạo dịch vụ",
      serviceList: "Danh sách dịch vụ",
    },
    create: {
      pageTitle: "Tạo dịch vụ mới",
      form: {
        serviceName: "Tên dịch vụ",
        serviceNamePlaceholder: "Nhập tên dịch vụ...",
        serviceType: "Loại dịch vụ",
        providerId: "Mã nhà cung cấp",
        areas: "Khu vực hoạt động",
        addArea: "Thêm khu vực",
        areasHint: "Nhấn thêm khu vực bạn có thể phục vụ",
        basicInfo: "Thông tin cơ bản",
        description: "Mô tả dịch vụ",
        descriptionPlaceholder: "Mô tả chi tiết về dịch vụ của bạn...",
        slotDurationHours: "Thời lượng mỗi slot (giờ)",
        pricePerSlot: "Giá mỗi slot",
        equipmentDepreciationCost: "Chi phí khấu hao thiết bị",
        depositAmount: "Tiền cọc",
        minPrice: "Giá tối thiểu",
        maxPrice: "Giá tối đa",
        albumFiles: "Hình ảnh portfolio",
        uploadButton: "Tải lên",
      },
      validation: {
        required: "Trường này là bắt buộc",
        positiveNumber: "Giá trị phải lớn hơn 0",
        nonNegativeNumber: "Giá trị không được âm",
        minMaxRange: "Giá tối thiểu không được lớn hơn giá tối đa",
        areaRequired: "Vui lòng thêm ít nhất một khu vực hoạt động",
      },
      messages: {
        createSuccess: "Tạo dịch vụ thành công!",
        createError: "Không thể tạo dịch vụ. Vui lòng thử lại.",
        loadError: "Không thể tải thông tin nhà cung cấp.",
      },
      button: {
        submit: "Tạo dịch vụ",
      },
    },
    edit: {
      pageTitle: "Chỉnh sửa dịch vụ",
      button: {
        submit: "Lưu thay đổi",
      },
      messages: {
        updateSuccess: "Cập nhật dịch vụ thành công!",
        updateError: "Không thể cập nhật dịch vụ. Vui lòng thử lại.",
      },
    },

    list: {
      pageTitle: "Danh sách dịch vụ",
      createButton: "Tạo dịch vụ mới",
      empty: "Bạn chưa có dịch vụ nào.",
      emptyHint: "Nhấn \"Tạo dịch vụ mới\" để bắt đầu.",
      /** Hiển thị giá trị serviceType từ API (Photographer / Event Staff) */
      serviceTypeValues: {
        photographer: "Chụp ảnh",
        eventStaff: "Hỗ trợ sự kiện",
      },
      table: {
        coverImage: "Ảnh",
        serviceType: "Loại dịch vụ",
        serviceName: "Tên dịch vụ",
        description: "Mô tả",
        slotDuration: "Thời lượng slot",
        pricePerSlot: "Giá mỗi slot",
        status: "Trạng thái",
        actions: "Hành động",
      },
      status: {
        active: "Hoạt động",
        inactive: "Không hoạt động",
      },
      messages: {
        loadError: "Không thể tải danh sách dịch vụ.",
        refresh: "Làm mới",
        deleteSuccess: "Đã xóa dịch vụ!",
        deleteError: "Không thể xóa dịch vụ. Vui lòng thử lại.",
      },
      delete: {
        confirmTitle: "Xóa dịch vụ này?",
        confirmDescription: "Hành động này không thể hoàn tác.",
      },
      detail: {
        title: "Chi tiết dịch vụ",
        viewButton: "Xem",
        loading: "Đang tải chi tiết dịch vụ...",
        loadError: "Không thể tải chi tiết dịch vụ.",
        serviceName: "Tên dịch vụ",
        serviceNameFallback: "(Không có tên)",
        serviceType: "Loại dịch vụ",
        description: "Mô tả",
        descriptionEmpty: "Không có mô tả",
        pricePerSlot: "Giá mỗi slot",
        minPrice: "Giá tối thiểu",
        maxPrice: "Giá tối đa",
        slotDuration: "Thời lượng slot",
        slotDurationUnit: "giờ",
        depositAmount: "Tiền cọc",
        areas: "Khu vực hoạt động",
        areasEmpty: "Chưa có khu vực nào",
        images: "Hình ảnh",
        imagesEmpty: "Chưa có hình ảnh nào",
        status: "Trạng thái",
      },
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
      browseByTheme: "Khám phá theo chủ đề",
      browseByThemeHint:
        "Chọn chủ đề yêu thích — banner và các nút khám phá sẽ gắn với chủ đề này khi bạn tương tác.",
      trustedShopsTitle: "Shop cho thuê uy tín",
      trustedShopsHint:
        "Cửa hàng được đánh giá cao, minh bạch và được nhiều khách tin chọn.",
      featured: {
        title: "Trang phục nổi bật",
        featuredHint: "Cập nhật liên tục — click vào thẻ để xem chi tiết và đặt thuê.",
        viewAll: "Xem tất cả",
        errorTitle: "Ôi không!",
        errorDescription: "Có lỗi xảy ra khi tải dữ liệu.",
        emptyTitle: "Không tìm thấy trang phục",
        emptyDescription: "Thử đổi từ khóa tìm kiếm khác nhé.",
        clearFilter: "Xóa bộ lọc",
        wishlist: "Yêu thích",
      },
    },
    guidelinesRules: {
      pageTitle: "⊹ ࣪˖₊˚♡ Hướng Dẫn & Quy Định ♡˚₊˖ ࣪⊹",
      pageSubtitle:
        "CosMate xây dựng hệ thống quy định rõ ràng nhằm bảo vệ quyền lợi của khách thuê và bên cung cấp. Vui lòng đọc kỹ nội dung trước khi tạo giao dịch để đảm bảo an toàn và minh bạch.",
      cosplayGuideTitle: "⊹ ࣪˖₊˚♡ HƯỚNG DẪN THUÊ ĐỒ COSPLAY ♡˚₊˖ ࣪⊹",
      photographerGuideTitle: "⊹ ࣪˖₊˚♡ HƯỚNG DẪN THUÊ PHOTOGRAPHER (PTG) ♡˚₊˖ ࣪⊹",
      staffGuideTitle: "⊹ ࣪˖₊˚♡ HƯỚNG DẪN THUÊ STAFF ♡˚₊˖ ࣪⊹",
      ordersReturnsGuideTitle:
        "⊹ ࣪˖₊˚♡ HƯỚNG DẪN TRẢ HÀNG / HỦY HÀNG / HOÀN HÀNG ♡˚₊˖ ࣪⊹",
      complaintsGuideTitle:
        "⊹ ࣪˖₊˚♡ HƯỚNG DẪN KHIẾU NẠI / XỬ LÝ TRANH CHẤP ♡˚₊˖ ࣪⊹",
      photographerRulesTitle: "✧˖°♡ Nội Quy Thuê Photographer (PTG) ♡°˖✧",
      staffRulesTitle: "✧˖°♡ Nội Quy Thuê Staff ♡°˖✧",
      ordersReturnsRulesTitle:
        "✧˖°♡ Nội Quy Giao Dịch, Trả Hàng, Hủy & Hoàn Trên CosMate ♡°˖✧",
      complaintsRulesTitle: "✧˖°♡ Nội Quy Xử Lý Khiếu Nại & Tranh Chấp ♡°˖✧",
      stepLabel: "Bước",
      rulePrefix: "Quy định",
      tabs: {
        guide: "Hướng dẫn",
        rules: "Quy định bắt buộc",
      },
      cardSmallTitle: "Hướng dẫn & Quy Định",
      cardMain: {
        cosplayRental: "THUÊ ĐỒ",
        photographer: "THUÊ PTG",
        staff: "THUÊ STAFF",
        ordersReturns: "TRẢ / HỦY / HOÀN",
        complaintsDisputes: "KHIẾU NẠI & TRANH CHẤP",
      },
      sections: {
        cosplayRental: {
          title: "Thuê đồ cosplay",
          desc: "Quy trình thuê trang phục và điều kiện bảo quản, hoàn trả.",
        },
        photographer: {
          title: "Thuê Photographer (PTG)",
          desc: "Hướng dẫn đặt lịch chụp và quy định hợp tác tác nghiệp.",
        },
        staff: {
          title: "Thuê Staff",
          desc: "Quy trình đặt staff sự kiện và trách nhiệm phối hợp.",
        },
        ordersReturns: {
          title: "Tạo đơn trả hàng, hủy hàng, hoàn hàng",
          desc: "Hướng dẫn thao tác trả hàng và xử lý hoàn tiền theo đơn.",
        },
        complaintsDisputes: {
          title: "Khiếu nại / Xử lý tranh chấp",
          desc: "Quy trình gửi khiếu nại và xử lý tranh chấp trên CosMate.",
        },
      },
      cosplayRules: {
        tocTitle: "Mục lục",
        mainTitle: "✧˖°♡ Nội Quy Thuê Đồ Cosplay ♡°˖✧",
        mainDescription:
          "Các quy định dưới đây có hiệu lực bắt buộc khi khách thuê đồ cosplay thông qua nền tảng CosMate.",
        introAcknowledgement:
          "Việc khách thực hiện một trong các hành vi sau: tạo đơn thuê, thanh toán tiền cọc hoặc phí thuê, xác nhận điều khoản trên hệ thống, hoặc tiếp tục sử dụng dịch vụ sau khi có thông báo cập nhật được xem là hành vi xác nhận đã đọc, hiểu và đồng ý chịu sự ràng buộc pháp lý của toàn bộ nội dung quy định này.",
        introPriority:
          "Trường hợp có xung đột giữa nội quy này và thỏa thuận riêng giữa các bên, nội quy và business rule của nền tảng CosMate được ưu tiên áp dụng.",
        groups: {
          generalPrinciples: "1. Vai trò & nguyên tắc pháp lý chung",
          accountVerification: "2. Điều kiện thuê & xác thực",
          bookingCommitment: "3. Thời điểm bắt đầu & kết thúc trách nhiệm",
          escrowFees: "4. Nghĩa vụ bảo quản & sử dụng tài sản",
          evidenceTimeline: "5. Đồng kiểm & giá trị chứng cứ",
          scheduleCancelTransfer: "6. Cọc, khấu trừ & xử lý thiệt hại",
          careObligation: "7. Gia hạn, hủy & trả trễ",
          disputesPenalties: "8. Miễn trừ trách nhiệm & bất khả kháng",
          reputationBlacklist: "9. Tranh chấp & thẩm quyền",
          updatesTermination: "10. Uy tín, blacklist & chấm dứt",
        },
        items: {
          "cos-role-platform": {
            title: "Vai trò nền tảng trung gian của CosMate",
            desc: "CosMate là nền tảng trung gian kết nối khách thuê và Shop cho thuê. CosMate không sở hữu, không quản lý vật lý tài sản và không chịu trách nhiệm trực tiếp về tình trạng tài sản, trừ phạm vi escrow, lưu trữ chứng cứ và xử lý tranh chấp theo rule.",
          },
          "cos-party-independence": {
            title: "Tính độc lập của các bên",
            desc: "Khách và Shop là các chủ thể độc lập, tự chịu trách nhiệm dân sự đối với hành vi của mình trong quá trình thuê và sử dụng tài sản.",
          },
          "cos-liability-limit": {
            title: "Giới hạn trách nhiệm của CosMate",
            desc: "Trong mọi trường hợp, trách nhiệm tối đa của CosMate (nếu phát sinh) không vượt quá tổng phí nền tảng và/hoặc khoản phí giao dịch mà CosMate thu từ giao dịch đó.",
          },
          "cos-rental-condition": {
            title: "Điều kiện bắt buộc trước khi thuê",
            desc: "Khách phải hoàn tất xác thực định danh theo chính sách nền tảng và cung cấp thông tin giao nhận chính xác.",
          },
          "cos-info-liability": {
            title: "Trách nhiệm pháp lý về thông tin",
            desc: "Khách chịu trách nhiệm về tính trung thực của thông tin đã cung cấp. Gian lận, mạo danh hoặc sử dụng thông tin sai có thể dẫn đến khóa tài khoản và từ chối hoàn tiền.",
          },
          "cos-start-time": {
            title: "Thời điểm bắt đầu thuê",
            desc: "Thời gian thuê bắt đầu từ thời điểm hệ thống ghi nhận giao hàng thành công (delivered) hoặc xác nhận nhận đồ trực tiếp.",
          },
          "cos-end-time": {
            title: "Thời điểm kết thúc trách nhiệm",
            desc: "Trách nhiệm của khách chấm dứt khi hệ thống ghi nhận hoàn tất đồng kiểm trả và Shop xác nhận tình trạng tài sản. Trong khoảng thời gian này, khách chịu toàn bộ trách nhiệm về mất mát, hư hỏng hoặc phát sinh liên quan đến tài sản.",
          },
          "cos-care-obligation": {
            title: "Nghĩa vụ bảo quản",
            desc: "Khách phải bảo quản tài sản đúng mục đích thuê, không tự ý sửa chữa, cắt may, nhuộm, chỉnh sửa wig, thay đổi phụ kiện hoặc can thiệp cấu trúc tài sản.",
          },
          "cos-compensation-liability": {
            title: "Trách nhiệm bồi thường",
            desc: "Nếu tài sản hư hỏng, mất mát hoặc giảm giá trị vượt quá hao mòn thông thường, khách có trách nhiệm bồi thường theo mức độ thiệt hại thực tế, bao gồm cả phần vượt quá tiền cọc nếu cần thiết.",
          },
          "cos-unboxing-video": {
            title: "Nghĩa vụ quay video mở hàng",
            desc: "Khách bắt buộc quay video mở hàng ngay khi nhận. Không có video mở hàng -> mặc định tài sản được giao đúng mô tả.",
          },
          "cos-return-verification": {
            title: "Đồng kiểm trả",
            desc: "Khách phải cung cấp hình ảnh/video khi trả tài sản theo quy trình hệ thống.",
          },
          "cos-evidence-value": {
            title: "Giá trị pháp lý của dữ liệu",
            desc: "Video, hình ảnh, log chat, mốc thời gian và dữ liệu lưu trữ trên CosMate là căn cứ pháp lý duy nhất khi xác định trách nhiệm và mức khấu trừ cọc.",
          },
          "cos-deposit-nature": {
            title: "Bản chất tiền cọc",
            desc: "Tiền cọc là khoản bảo đảm thực hiện nghĩa vụ và có thể bị giữ/khấu trừ nếu khách vi phạm nghĩa vụ hoặc gây thiệt hại.",
          },
          "cos-deduction-principle": {
            title: "Nguyên tắc khấu trừ",
            desc: "Mức khấu trừ dựa trên bằng chứng và mức độ thiệt hại thực tế. Trường hợp thiệt hại nghiêm trọng hoặc mất toàn bộ tài sản, khách có thể phải bồi thường vượt quá tiền cọc.",
          },
          "cos-conceal-fraud": {
            title: "Che giấu hoặc gian lận",
            desc: "Hành vi che giấu hư hỏng, cung cấp bằng chứng sai lệch hoặc cố tình trì hoãn trả đồ có thể bị xem là vi phạm nghiêm trọng.",
          },
          "cos-pricing-principle": {
            title: "Nguyên tắc định giá theo thời gian thuê",
            desc: "Giá thuê tài sản phải tuân theo nguyên tắc ưu đãi theo thời gian, theo đó tổng chi phí thuê cho nhiều ngày không được tính tuyến tính bằng cách nhân đơn giá ngày với số ngày thuê. Khi thời gian thuê tăng lên, chi phí trung bình cho mỗi ngày thuê phải giảm hoặc không được cao hơn đơn giá của ngày đầu tiên.",
          },
          "cos-price-constraint": {
            title: "Ràng buộc tính toán giá",
            desc: "Đối với mọi tài sản, hệ thống không cho phép cấu hình hoặc tính toán giá thuê theo dạng: Giá ngày N = Giá ngày 1 × N. Thay vào đó, tổng giá thuê phải được thiết lập theo hướng: Giá ngày thứ 2 trở đi ≤ giá ngày đầu tiên; Tổng giá thuê cho nhiều ngày < (giá ngày 1 × số ngày thuê).",
          },
          "cos-price-example": {
            title: "Ví dụ minh họa",
            desc: "Nếu giá thuê 1 ngày là 150.000 VNĐ, thì: Giá thuê 2 ngày không được phép là 300.000 VNĐ. Giá hợp lệ phải nhỏ hơn 300.000 VNĐ (ví dụ: 270.000 VNĐ). Ví dụ này không mang tính ràng buộc.",
          },
          "cos-price-platform-control": {
            title: "Quyền kiểm soát của nền tảng",
            desc: "CosMate có quyền từ chối, điều chỉnh hoặc cảnh báo các cấu hình giá không tuân thủ nguyên tắc này nhằm đảm bảo tính hợp lý, minh bạch và trải nghiệm người dùng.",
          },
          "cos-valid-extension": {
            title: "Gia hạn hợp lệ",
            desc: "Gia hạn chỉ hợp lệ khi được xác nhận trên CosMate và thanh toán thành công.",
          },
          "cos-late-return": {
            title: "Trả trễ",
            desc: "Trả trễ có thể phát sinh phụ phí theo điều khoản đã công khai.",
          },
          "cos-invalid-cancel": {
            title: "Hủy sai quy định",
            desc: "Hủy không đúng điều kiện có thể dẫn đến mất một phần hoặc toàn bộ tiền cọc.",
          },
          "cos-liability-exemption": {
            title: "Miễn trừ trách nhiệm của CosMate",
            desc: "CosMate không chịu trách nhiệm đối với thiệt hại phát sinh từ hành vi ngoài phạm vi kiểm soát kỹ thuật của nền tảng.",
          },
          "cos-force-majeure": {
            title: "Sự kiện bất khả kháng",
            desc: "Thiên tai, dịch bệnh, sự cố ngoài tầm kiểm soát hợp lý có thể được xem là bất khả kháng và miễn trách nhiệm trong phạm vi ảnh hưởng.",
          },
          "cos-cosmate-intervention": {
            title: "Quyền can thiệp của CosMate",
            desc: "CosMate có quyền tạm giữ tiền, yêu cầu bổ sung chứng cứ và đưa ra quyết định xử lý cuối cùng dựa trên business rule.",
          },
          "cos-dispute-jurisdiction": {
            title: "Thẩm quyền giải quyết",
            desc: "Tranh chấp trước hết được xử lý nội bộ trên CosMate. Nếu không đạt được thỏa thuận, tranh chấp được giải quyết theo pháp luật hiện hành tại cơ quan có thẩm quyền nơi CosMate đăng ký hoạt động.",
          },
          "cos-reputation-score": {
            title: "Điểm uy tín",
            desc: "Lịch sử thuê và mức độ hợp tác ảnh hưởng trực tiếp đến điểm uy tín của khách.",
          },
          "cos-blacklist": {
            title: "Blacklist",
            desc: "Hành vi chiếm đoạt, gian lận, phá hoại tài sản hoặc vi phạm nhiều lần có thể dẫn đến blacklist và chấm dứt quyền sử dụng dịch vụ.",
          },
          "cos-rule-updates": {
            title: "Cập nhật nội quy",
            desc: "CosMate có quyền cập nhật nội quy. Việc tiếp tục sử dụng dịch vụ được xem là đồng ý với phiên bản cập nhật.",
          },
        },
      },
      ordersReturnsRules: {
        mainDescription:
          "Các quy định dưới đây áp dụng đối với mọi giao dịch được thực hiện trên nền tảng CosMate, bao gồm nhưng không giới hạn ở: thuê đồ cosplay, thuê Photographer (PTG) và thuê Staff Support.",
        introAcknowledgement:
          "Việc tạo đơn, thanh toán, xác nhận điều khoản, tạo yêu cầu trả hàng, yêu cầu hủy đơn, yêu cầu hoàn hàng hoặc tiếp tục sử dụng dịch vụ sau khi có thông báo cập nhật được xem là hành vi xác nhận đã đọc, hiểu và đồng ý chịu sự ràng buộc pháp lý của toàn bộ nội dung quy định này.",
        introPriority:
          "Trường hợp có xung đột giữa điều khoản riêng của Shop/PTG/Staff và nội quy này, business rule và quyết định của nền tảng CosMate được ưu tiên áp dụng.",
        groups: {
          legalScope: "I. Nguyên tắc pháp lý & phạm vi áp dụng",
          returnGoods: "II. Trả hàng (kết thúc thuê đồ cosplay)",
          cancelOrder: "IV. Hủy đơn",
          refundByProviderFault: "V. Hoàn hàng (do lỗi từ bên cung cấp)",
          escrowDeduction: "VI. Escrow & xử lý cọc",
          cooperationFraud: "VII. Nghĩa vụ hợp tác & gian lận",
          forceMajeureJurisdiction: "VIII. Bất khả kháng & thẩm quyền",
        },
        items: {
          "or-platform-role": {
            title: "Vai trò nền tảng trung gian",
            desc: "CosMate là nền tảng trung gian cung cấp hạ tầng kỹ thuật để kết nối các bên. CosMate không trực tiếp sở hữu, lưu giữ, vận hành hoặc cung cấp dịch vụ vật lý ngoài phạm vi kỹ thuật đã công bố (escrow, lưu trữ dữ liệu, quản lý trạng thái giao dịch, xử lý tranh chấp).",
          },
          "or-party-independence": {
            title: "Tính độc lập của các bên",
            desc: "Khách thuê, Shop, PTG và Staff là các chủ thể độc lập, tự chịu trách nhiệm dân sự và pháp lý đối với hành vi của mình trong quá trình giao dịch.",
          },
          "or-liability-limit": {
            title: "Giới hạn trách nhiệm của CosMate",
            desc: "Trong mọi trường hợp, trách nhiệm tối đa của CosMate (nếu có phát sinh) không vượt quá tổng phí giao dịch mà nền tảng thu từ giao dịch đó.",
          },
          "or-return-create-order": {
            title: "Tạo đơn trả hàng bắt buộc",
            desc: "Khách phải tạo đơn trả hàng trên CosMate trước khi gửi sản phẩm. Việc gửi hàng phải thực hiện thông qua đơn vị vận chuyển được hệ thống hỗ trợ hoặc hướng dẫn. Không tạo đơn hệ thống nhưng tự ý gửi hàng thì CosMate không chịu trách nhiệm đối với thất lạc hoặc tranh chấp.",
          },
          "or-return-valid-time": {
            title: "Thời điểm hợp lệ trả hàng",
            desc: "Thời điểm hợp lệ được tính là thời điểm hệ thống ghi nhận đơn vận chuyển được tạo thành công. Trả trễ so với thời hạn thuê hoặc gia hạn hợp lệ có thể phát sinh phí phạt, bị khấu trừ cọc hoặc xử lý theo mức độ vi phạm.",
          },
          "or-return-obligation": {
            title: "Nghĩa vụ khi trả hàng",
            desc: "Khách phải quay video tình trạng sản phẩm trước khi đóng gói. Sản phẩm phải được đóng gói an toàn và đầy đủ phụ kiện. Mất mát, thiếu phụ kiện, hư hỏng phát sinh trong thời gian khách chịu trách nhiệm sẽ bị khấu trừ tương ứng.",
          },
          "or-cancel-before-confirm": {
            title: "Hủy trước khi xác nhận",
            desc: "Nếu đơn chưa được bên cung cấp xác nhận, khách có quyền hủy. Khoản thanh toán sẽ được xử lý theo cơ chế hệ thống.",
          },
          "or-cancel-after-confirm": {
            title: "Hủy sau khi xác nhận nhưng chưa thực hiện",
            desc: "Nếu đơn đã được xác nhận thì tiền cọc được xử lý theo điều khoản công khai của bên cung cấp và có thể bị khấu trừ một phần hoặc 100% cọc. Việc hủy sát ngày thực hiện có thể bị xem là gây thiệt hại thực tế cho bên cung cấp.",
          },
          "or-cancel-after-start": {
            title: "Hủy khi đã bắt đầu thực hiện",
            desc: "Khi dịch vụ đã bắt đầu (đã giao đồ, đã check-in chụp, đã bắt đầu support), khách không được hoàn tiền thuê/dịch vụ và cọc được xử lý theo rule công khai.",
          },
          "or-refund-valid-condition": {
            title: "Điều kiện hoàn hàng hợp lệ",
            desc: "Chỉ được chấp nhận khi giao sai sản phẩm, thiếu phụ kiện đã công bố, hư hỏng nghiêm trọng trước khi sử dụng hoặc không đúng cấu hình đã xác nhận.",
          },
          "or-refund-mandatory-condition": {
            title: "Điều kiện bắt buộc",
            desc: "Phải có video mở hàng hợp lệ trong vòng 24 giờ và yêu cầu hoàn hàng phải được tạo trên hệ thống trong thời hạn quy định.",
          },
          "or-refund-resolution": {
            title: "Hình thức xử lý",
            desc: "Sau khi xác minh, CosMate có thể yêu cầu đổi sản phẩm, yêu cầu gửi trả và hoàn tiền, hoàn tiền một phần hoặc từ chối yêu cầu nếu không đủ căn cứ. Quyết định của CosMate là quyết định cuối cùng và có giá trị ràng buộc.",
          },
          "or-escrow-hold": {
            title: "Tạm giữ tiền escrow",
            desc: "CosMate có quyền tạm giữ tiền trong cơ chế escrow trong thời gian xử lý tranh chấp.",
          },
          "or-escrow-deduction": {
            title: "Khấu trừ cọc",
            desc: "Khấu trừ cọc dựa trên mức độ thiệt hại, bằng chứng hệ thống, thời gian vi phạm và điều khoản công khai của bên cung cấp.",
          },
          "or-escrow-over-deposit": {
            title: "Thiệt hại vượt tiền cọc",
            desc: "Nếu thiệt hại vượt quá tiền cọc, bên gây thiệt hại có trách nhiệm bồi thường phần chênh lệch.",
          },
          "or-cooperation-evidence": {
            title: "Nghĩa vụ hợp tác chứng cứ",
            desc: "Các bên phải cung cấp chứng cứ trong thời hạn quy định.",
          },
          "or-fraud-prohibited": {
            title: "Hành vi gian lận bị nghiêm cấm",
            desc: "Nghiêm cấm giả mạo video, cắt ghép bằng chứng, cố tình gây thiệt hại để yêu cầu hoàn tiền, hoặc tạo giao dịch ngoài hệ thống rồi yêu cầu CosMate can thiệp.",
          },
          "or-serious-violation": {
            title: "Chế tài vi phạm nghiêm trọng",
            desc: "Vi phạm nghiêm trọng có thể dẫn đến giữ tiền, khóa tài khoản hoặc blacklist vĩnh viễn.",
          },
          "or-force-majeure": {
            title: "Sự kiện bất khả kháng",
            desc: "Sự kiện bất khả kháng (thiên tai, dịch bệnh, sự cố ngoài tầm kiểm soát hợp lý) có thể được miễn trách nhiệm trong phạm vi ảnh hưởng.",
          },
          "or-dispute-jurisdiction": {
            title: "Thẩm quyền giải quyết tranh chấp",
            desc: "Tranh chấp trước hết được xử lý nội bộ trên CosMate. Nếu không đạt được thỏa thuận, tranh chấp được giải quyết theo pháp luật hiện hành tại cơ quan có thẩm quyền nơi CosMate đăng ký hoạt động.",
          },
          "or-rule-update-right": {
            title: "Quyền cập nhật nội quy",
            desc: "CosMate có quyền cập nhật nội quy. Việc tiếp tục sử dụng nền tảng được xem là chấp thuận phiên bản mới nhất.",
          },
        },
      },
      complaintsRules: {
        mainDescription:
          "Các quy định dưới đây áp dụng đối với mọi khiếu nại và tranh chấp phát sinh từ giao dịch thực hiện trên nền tảng CosMate, bao gồm nhưng không giới hạn ở: thuê đồ cosplay, thuê Photographer (PTG) và thuê Staff Support.",
        introAcknowledgement:
          "Việc gửi khiếu nại, phản hồi khiếu nại hoặc tiếp tục sử dụng dịch vụ được xem là hành vi xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ nội dung quy định này.",
        introPriority:
          "Trường hợp có xung đột giữa điều khoản riêng của các bên và nội quy này, business rule và quyết định của nền tảng CosMate được ưu tiên áp dụng.",
        groups: {
          generalPrinciples: "I. Nguyên tắc chung",
          deadline: "II. Thời hạn gửi khiếu nại",
          process: "III. Quy trình xử lý tranh chấp",
          cooperation: "IV. Nghĩa vụ hợp tác",
          fraud: "V. Xử lý gian lận",
          liabilityLimit: "VI. Giới hạn trách nhiệm",
          escrow: "VII. Cơ chế escrow",
          forceMajeureJurisdiction: "VIII. Bất khả kháng & thẩm quyền",
        },
        items: {
          "cp-platform-role": {
            title: "Vai trò trung gian của CosMate",
            desc: "CosMate là bên trung gian kỹ thuật, không phải là bên cung cấp hàng hóa/dịch vụ trực tiếp. CosMate có trách nhiệm ghi nhận dữ liệu, lưu trữ chứng cứ, quản lý trạng thái giao dịch và xử lý tranh chấp theo business rule đã công bố.",
          },
          "cp-evidence-principle": {
            title: "Nguyên tắc dựa trên chứng cứ",
            desc: "Mọi quyết định xử lý tranh chấp được đưa ra dựa trên dữ liệu hệ thống, log chat trên nền tảng, video/hình ảnh hợp lệ, mốc thời gian hệ thống và điều khoản đã được các bên chấp nhận. Chứng cứ ngoài hệ thống không được ưu tiên công nhận.",
          },
          "cp-cosplay-deadline": {
            title: "Thời hạn khiếu nại đối với thuê đồ cosplay",
            desc: "Khiếu nại về lỗi ban đầu phải được gửi trong vòng 24 giờ kể từ thời điểm giao hàng thành công, kèm video mở hàng hợp lệ. Khiếu nại về hư hỏng sau khi sử dụng phải được gửi trước thời điểm hoàn tất đồng kiểm trả hàng.",
          },
          "cp-service-deadline": {
            title: "Thời hạn khiếu nại đối với PTG & Staff",
            desc: "Khiếu nại liên quan đến không đúng thời lượng, không đúng cấu hình dịch vụ hoặc không thực hiện nghĩa vụ phải được gửi trong thời hạn tối đa 48 giờ kể từ thời điểm hoàn tất dịch vụ hoặc mốc hệ thống ghi nhận COMPLETED.",
          },
          "cp-deadline-expired": {
            title: "Quá thời hạn khiếu nại",
            desc: "Nếu quá thời hạn nêu trên mà không có khiếu nại hợp lệ, hệ thống mặc định giao dịch đã được chấp nhận và hoàn tất.",
          },
          "cp-step-submit": {
            title: "Bước 1 - Gửi yêu cầu",
            desc: "Bên khiếu nại phải tạo yêu cầu tranh chấp trực tiếp trên CosMate và đính kèm đầy đủ chứng cứ.",
          },
          "cp-step-verify": {
            title: "Bước 2 - Thu thập & xác minh",
            desc: "CosMate có quyền yêu cầu bổ sung chứng cứ, tạm giữ tiền trong escrow, tạm khóa trạng thái giao dịch hoặc tạm hạn chế tài khoản nếu có dấu hiệu gian lận.",
          },
          "cp-step-response": {
            title: "Bước 3 - Phản hồi từ bên còn lại",
            desc: "Bên bị khiếu nại phải phản hồi trong thời hạn quy định của hệ thống. Không phản hồi đúng hạn có thể dẫn đến quyết định xử lý bất lợi.",
          },
          "cp-step-decision": {
            title: "Bước 4 - Ra quyết định",
            desc: "Sau khi xem xét toàn bộ chứng cứ, CosMate có thể giữ cọc toàn bộ, khấu trừ một phần, hoàn tiền một phần/toàn bộ, từ chối yêu cầu hoặc áp dụng chế tài đối với bên vi phạm. Quyết định của CosMate là quyết định cuối cùng và có giá trị ràng buộc.",
          },
          "cp-cooperation-duty": {
            title: "Nghĩa vụ hợp tác",
            desc: "Các bên có nghĩa vụ cung cấp thông tin trung thực, không chỉnh sửa/cắt ghép bằng chứng và không gây cản trở quá trình xác minh.",
          },
          "cp-noncooperation-penalty": {
            title: "Hệ quả khi không hợp tác",
            desc: "Không hợp tác hoặc cung cấp thông tin sai lệch có thể bị xem là vi phạm nghiêm trọng.",
          },
          "cp-fraud-prohibited": {
            title: "Các hành vi bị nghiêm cấm",
            desc: "Giả mạo video hoặc hình ảnh, cắt ghép bằng chứng, cố tình gây thiệt hại để yêu cầu hoàn tiền, tạo tranh chấp giả, hoặc lôi kéo giao dịch ngoài nền tảng rồi yêu cầu CosMate can thiệp.",
          },
          "cp-fraud-penalty": {
            title: "Xử lý vi phạm gian lận",
            desc: "Vi phạm có thể dẫn đến giữ toàn bộ tiền liên quan, khóa tài khoản tạm thời/vĩnh viễn, blacklist, hoặc chuyển hồ sơ cho cơ quan có thẩm quyền nếu có dấu hiệu vi phạm pháp luật.",
          },
          "cp-liability-exclusions": {
            title: "Phạm vi miễn trừ trách nhiệm",
            desc: "CosMate không chịu trách nhiệm đối với thiệt hại gián tiếp, tổn thất cơ hội hoặc thiệt hại phát sinh ngoài phạm vi kiểm soát kỹ thuật của nền tảng.",
          },
          "cp-liability-cap": {
            title: "Giới hạn trách nhiệm tối đa",
            desc: "Trách nhiệm tối đa của CosMate (nếu có) không vượt quá tổng phí giao dịch mà nền tảng thu từ giao dịch đó.",
          },
          "cp-escrow-rights": {
            title: "Cơ chế escrow khi xử lý tranh chấp",
            desc: "Trong suốt quá trình xử lý tranh chấp, CosMate có quyền tạm giữ tiền, trì hoãn giải ngân và điều chỉnh trạng thái giao dịch cho đến khi có quyết định cuối cùng.",
          },
          "cp-force-majeure": {
            title: "Sự kiện bất khả kháng",
            desc: "Trường hợp bất khả kháng (thiên tai, dịch bệnh, sự kiện ngoài kiểm soát hợp lý), các bên có thể được miễn trách nhiệm trong phạm vi ảnh hưởng.",
          },
          "cp-dispute-jurisdiction": {
            title: "Thẩm quyền giải quyết tranh chấp",
            desc: "Tranh chấp trước hết được giải quyết nội bộ trên CosMate. Nếu không đạt được thỏa thuận, tranh chấp được giải quyết theo pháp luật hiện hành tại cơ quan có thẩm quyền nơi CosMate đăng ký hoạt động.",
          },
          "cp-rule-update-right": {
            title: "Quyền cập nhật nội quy",
            desc: "CosMate có quyền cập nhật nội quy. Việc tiếp tục sử dụng nền tảng được xem là chấp thuận phiên bản mới nhất.",
          },
        },
      },
      photographerRules: {
        mainDescription:
          "Các quy định dưới đây có hiệu lực bắt buộc khi khách đặt dịch vụ chụp ảnh thông qua nền tảng CosMate.",
        introAcknowledgement:
          "Việc tạo đơn, thanh toán, xác nhận điều khoản hoặc tiếp tục sử dụng dịch vụ sau thông báo cập nhật được xem là chấp thuận ràng buộc pháp lý với toàn bộ nội dung nội quy này.",
        introPriority:
          "Trường hợp có xung đột, business rule nền tảng CosMate được ưu tiên áp dụng.",
        groups: {
          serviceNature: "1. Bản chất dịch vụ & phạm vi cam kết",
          slotTime: "2. Slot, thời gian & trách nhiệm tham gia",
          deliveryCopyright: "3. Ảnh bàn giao & quyền tác giả",
          depositCancelRefund: "4. Cọc, hủy & hoàn tiền",
          disputeEvidence: "5. Tranh chấp & bằng chứng",
          liabilityForceMajeure: "6. Giới hạn trách nhiệm & bất khả kháng",
          reputationTermination: "7. Uy tín & chấm dứt dịch vụ",
        },
        items: {
          "ptg-creative-nature": {
            title: "Tính chất sáng tạo",
            desc: "Dịch vụ chụp ảnh mang tính nghệ thuật và không bảo đảm sự hài lòng chủ quan về thẩm mỹ.",
          },
          "ptg-scope-commitment": {
            title: "Phạm vi nghĩa vụ của PTG",
            desc: "PTG chỉ có nghĩa vụ thực hiện đúng: thời lượng chụp, số lượng ảnh bàn giao, mức chỉnh sửa và deadline trả ảnh đã công bố.",
          },
          "ptg-slot-deposit": {
            title: "Giữ slot bằng cọc",
            desc: "Slot chỉ được xác nhận khi khách thanh toán cọc thành công.",
          },
          "ptg-late-arrival": {
            title: "Đến trễ",
            desc: "Khách đến trễ có thể bị trừ thời gian chụp tương ứng, trừ khi có thỏa thuận khác được ghi nhận trên hệ thống.",
          },
          "ptg-delivery-scope": {
            title: "Phạm vi bàn giao",
            desc: "PTG chỉ bàn giao số lượng và định dạng ảnh theo cấu hình đã công bố. Không mặc định cung cấp file RAW nếu không có thỏa thuận rõ ràng.",
          },
          "ptg-copyright": {
            title: "Quyền tác giả",
            desc: "Quyền sở hữu trí tuệ đối với tác phẩm ảnh thuộc về PTG trừ khi có thỏa thuận khác. Khách được quyền sử dụng ảnh cho mục đích cá nhân trừ khi có quy định khác.",
          },
          "ptg-invalid-cancel": {
            title: "Hủy sai quy định",
            desc: "Khách hủy ngoài thời hạn có thể mất cọc theo điều khoản đã công bố.",
          },
          "ptg-provider-fault": {
            title: "Lỗi thuộc về PTG",
            desc: "Nếu PTG không thực hiện đúng nghĩa vụ đã cam kết và có bằng chứng hợp lệ, khách được hoàn cọc theo rule nền tảng.",
          },
          "ptg-system-evidence": {
            title: "Giá trị pháp lý của dữ liệu hệ thống",
            desc: "Cấu hình dịch vụ, log chat, mốc thời gian và dữ liệu bàn giao lưu trên CosMate là căn cứ pháp lý khi xử lý tranh chấp.",
          },
          "ptg-final-decision": {
            title: "Quyết định cuối cùng",
            desc: "CosMate có quyền đưa ra quyết định cuối cùng dựa trên chứng cứ và business rule.",
          },
          "ptg-liability-limit": {
            title: "Giới hạn trách nhiệm",
            desc: "CosMate không chịu trách nhiệm đối với đánh giá chủ quan về thẩm mỹ ảnh hoặc sự không hài lòng cá nhân.",
          },
          "ptg-force-majeure": {
            title: "Bất khả kháng",
            desc: "Sự kiện ngoài tầm kiểm soát hợp lý có thể được xem là bất khả kháng và miễn trách nhiệm trong phạm vi ảnh hưởng.",
          },
          "ptg-reputation-score": {
            title: "Điểm uy tín & đánh giá",
            desc: "Lịch sử hợp tác ảnh hưởng đến điểm uy tín của khách.",
          },
          "ptg-violations": {
            title: "Hành vi vi phạm",
            desc: "Gian lận, chỉnh sửa bằng chứng, gây rối hoặc lôi kéo giao dịch ngoài hệ thống có thể dẫn đến hạn chế hoặc chấm dứt quyền sử dụng dịch vụ.",
          },
          "ptg-rule-updates": {
            title: "Cập nhật nội quy",
            desc: "CosMate có quyền sửa đổi nội quy. Việc tiếp tục sử dụng dịch vụ được xem là chấp thuận nội dung cập nhật.",
          },
        },
      },
      staffRules: {
        mainDescription:
          "Các quy định dưới đây có hiệu lực bắt buộc khi khách thuê Staff thông qua nền tảng CosMate.",
        introAcknowledgement:
          "Việc khách thực hiện một trong các hành vi sau: tạo đơn đặt dịch vụ, thanh toán tiền cọc hoặc phí dịch vụ, xác nhận điều khoản trên hệ thống, hoặc tiếp tục sử dụng dịch vụ sau khi có thông báo cập nhật được xem là hành vi xác nhận đã đọc, hiểu và đồng ý chịu sự ràng buộc pháp lý của toàn bộ nội dung quy định này.",
        introPriority:
          "Trường hợp có xung đột giữa nội quy này và thỏa thuận riêng giữa các bên, nội quy và business rule của nền tảng CosMate được ưu tiên áp dụng.",
        groups: {
          legalPrinciples: "1. Vai trò & nguyên tắc pháp lý chung",
          transactionVerification: "2. Điều kiện giao dịch & xác thực",
          serviceScope: "3. Phạm vi dịch vụ & nghĩa vụ khách thuê",
          timeDepositPayment: "4. Thời gian, cọc & thanh toán",
          verificationEvidence: "5. Đồng kiểm & bằng chứng",
          disputeViolation: "6. Tranh chấp & xử lý vi phạm",
          exemptionForceMajeure: "7. Miễn trừ trách nhiệm & bất khả kháng",
          reputationBlacklist: "8. Uy tín, blacklist & hạn chế sử dụng",
          updateJurisdiction: "9. Cập nhật rule & thẩm quyền giải quyết tranh chấp",
        },
        items: {
          "staff-role-platform": {
            title: "Vai trò nền tảng trung gian của CosMate",
            desc: "CosMate là nền tảng trung gian cung cấp hạ tầng kỹ thuật để kết nối khách thuê và Staff. CosMate không trực tiếp cung cấp dịch vụ hỗ trợ, không kiểm soát hành vi thực tế ngoài đời, và không chịu trách nhiệm đối với kết quả thực tế của hoạt động hỗ trợ, trừ phạm vi đã công bố như cơ chế escrow, lưu trữ chứng cứ và xử lý tranh chấp.",
          },
          "staff-party-independence": {
            title: "Tính độc lập giữa các bên",
            desc: "Khách và Staff là hai chủ thể độc lập, tự chịu trách nhiệm dân sự đối với hành vi của mình trong quá trình thực hiện dịch vụ.",
          },
          "staff-liability-limit": {
            title: "Giới hạn trách nhiệm của CosMate",
            desc: "Trong mọi trường hợp, trách nhiệm tối đa của CosMate (nếu có) không vượt quá tổng phí dịch vụ mà khách đã thanh toán cho giao dịch đó.",
          },
          "staff-booking-condition": {
            title: "Điều kiện bắt buộc trước khi đặt Staff",
            desc: "Khách phải đăng nhập và cung cấp thông tin định danh hợp lệ theo chính sách nền tảng. CosMate có quyền từ chối giao dịch nếu thông tin không đủ tin cậy.",
          },
          "staff-info-liability": {
            title: "Trách nhiệm pháp lý về thông tin",
            desc: "Khách chịu trách nhiệm trước pháp luật về tính trung thực của thông tin cung cấp. Gian lận, mạo danh hoặc cung cấp thông tin sai có thể dẫn đến khóa tài khoản và từ chối hoàn tiền.",
          },
          "staff-scope-by-order": {
            title: "Phạm vi hỗ trợ được giới hạn theo đơn đặt",
            desc: "Staff chỉ có nghĩa vụ thực hiện nội dung hỗ trợ đã được cấu hình và thanh toán trên hệ thống. Mọi yêu cầu ngoài phạm vi phải được tạo order bổ sung.",
          },
          "staff-coordination-duty": {
            title: "Nghĩa vụ phối hợp",
            desc: "Khách phải cung cấp đầy đủ thông tin về thời gian, địa điểm, nội dung hỗ trợ. Việc cung cấp sai hoặc thay đổi đột ngột có thể làm phát sinh phụ phí.",
          },
          "staff-no-personal-transfer": {
            title: "Không chuyển giao trách nhiệm cá nhân",
            desc: "Staff không mặc định chịu trách nhiệm đối với tài sản cá nhân của khách nếu không có thỏa thuận rõ ràng trên hệ thống.",
          },
          "staff-deposit-escrow": {
            title: "Cọc giữ lịch",
            desc: "Tiền cọc có giá trị ràng buộc trách nhiệm hai bên và được giữ theo cơ chế escrow.",
          },
          "staff-time-overtime": {
            title: "Tính giờ & quá giờ",
            desc: "Thời gian hỗ trợ được tính theo giờ đã đặt. Quá giờ có thể tính phụ phí theo cấu hình công khai.",
          },
          "staff-invalid-cancel": {
            title: "Hủy sai quy định",
            desc: "Khách hủy không đúng điều kiện đã công bố có thể bị giữ toàn bộ hoặc một phần tiền cọc theo rule nền tảng.",
          },
          "staff-checkin-checkout": {
            title: "Ghi nhận thời gian thực hiện",
            desc: "Thời điểm bắt đầu và kết thúc được ghi nhận qua cơ chế check-in/check-out hoặc log hệ thống.",
          },
          "staff-system-evidence": {
            title: "Giá trị pháp lý của dữ liệu hệ thống",
            desc: "Log chat, mốc thời gian và dữ liệu lưu trữ trên CosMate là bằng chứng hợp lệ và được ưu tiên khi xử lý tranh chấp.",
          },
          "staff-cosmate-intervention": {
            title: "Quyền can thiệp của CosMate",
            desc: "CosMate có quyền tạm giữ tiền, yêu cầu bổ sung chứng cứ, tạm khóa giao dịch hoặc tài khoản khi có dấu hiệu vi phạm.",
          },
          "staff-cooperate-duty": {
            title: "Nghĩa vụ hợp tác",
            desc: "Khách phải phản hồi và cung cấp chứng cứ trong thời hạn quy định. Không hợp tác có thể dẫn đến quyết định xử lý bất lợi.",
          },
          "staff-prohibited-acts": {
            title: "Hành vi bị nghiêm cấm",
            desc: "Giả mạo thông tin, chỉnh sửa bằng chứng, cố tình gây thiệt hại hoặc lôi kéo giao dịch ngoài hệ thống nhằm né cơ chế escrow.",
          },
          "staff-liability-exemption": {
            title: "Miễn trừ trách nhiệm",
            desc: "CosMate không chịu trách nhiệm đối với thiệt hại phát sinh từ hành vi ngoài phạm vi kiểm soát kỹ thuật của nền tảng.",
          },
          "staff-force-majeure": {
            title: "Sự kiện bất khả kháng",
            desc: "Trong trường hợp thiên tai, dịch bệnh, sự kiện ngoài tầm kiểm soát hợp lý khiến dịch vụ không thể thực hiện, các bên được miễn trách nhiệm trong phạm vi bị ảnh hưởng.",
          },
          "staff-rating-system": {
            title: "Hệ thống đánh giá",
            desc: "Sau giao dịch, khách và Staff có quyền đánh giá lẫn nhau. Điểm uy tín ảnh hưởng khả năng giao dịch trong tương lai.",
          },
          "staff-blacklist-limit": {
            title: "Blacklist & hạn chế",
            desc: "Vi phạm nghiêm trọng có thể dẫn đến hạn chế hoặc chấm dứt quyền sử dụng dịch vụ, đồng thời công khai trạng thái vi phạm theo chính sách.",
          },
          "staff-update-right": {
            title: "Quyền cập nhật",
            desc: "CosMate có quyền sửa đổi, bổ sung nội quy. Việc tiếp tục sử dụng nền tảng sau thông báo được xem là đồng ý với nội dung cập nhật.",
          },
          "staff-dispute-jurisdiction": {
            title: "Thẩm quyền giải quyết tranh chấp",
            desc: "Tranh chấp phát sinh trước hết được giải quyết theo cơ chế nội bộ của CosMate. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được xử lý theo quy định pháp luật hiện hành và cơ quan có thẩm quyền tại nơi CosMate đăng ký hoạt động.",
          },
        },
      },
      guides: {
        cosplayRental: {
          step1: "Chọn trang phục phù hợp và kiểm tra thông tin mô tả, phụ kiện đi kèm.",
          step2: "Chọn khung thời gian thuê và địa chỉ nhận hàng phù hợp với lịch trình.",
          step3: "Đọc kỹ điều khoản thuê, tiền cọc, mức phạt và xác nhận đồng ý quy định.",
          step4: "Hoàn tất thanh toán theo hướng dẫn để đơn hàng được xác nhận.",
          step5: "Khi nhận đồ, quay/chụp unboxing rõ ràng để làm bằng chứng tình trạng ban đầu.",
          step6: "Hoàn trả đúng hẹn, đúng hiện trạng đã cam kết và chờ đối soát đơn.",
        },
        photographer: {
          step1: "Chọn Photographer theo phong cách, kinh nghiệm và đánh giá phù hợp.",
          step2: "Chọn gói dịch vụ, thời lượng và mốc thời gian tác nghiệp cụ thể.",
          step3: "Xác nhận quy định chụp, bàn giao sản phẩm và trách nhiệm hai bên.",
          step4: "Thanh toán để khóa lịch và nhận xác nhận dịch vụ từ hệ thống.",
          step5: "Check-in/check-out đúng giờ tại địa điểm đã thống nhất với Photographer.",
          step6: "Kết thúc buổi chụp, xác nhận hoàn thành và gửi đánh giá dịch vụ.",
        },
        staff: {
          step1: "Chọn Staff theo kỹ năng, kinh nghiệm và yêu cầu công việc của sự kiện.",
          step2: "Thiết lập ca làm, thời gian, phạm vi công việc và địa điểm cụ thể.",
          step3: "Xác nhận quy định phối hợp, trách nhiệm và điều khoản làm việc.",
          step4: "Thanh toán để xác nhận lịch làm và đảm bảo nhân sự được giữ chỗ.",
          step5: "Check-in/check-out đúng thời gian để ghi nhận công làm chính xác.",
          step6: "Hoàn tất ca làm, xác nhận kết quả và gửi đánh giá chất lượng hỗ trợ.",
        },
        ordersReturns: {
          step1: "Mở đơn hàng trong tài khoản và chọn đúng đơn cần xử lý.",
          step2: "Chọn yêu cầu phù hợp: tạo đơn trả hàng, hủy hàng hoặc yêu cầu hoàn hàng.",
          step3: "Điền lý do và tải lên thông tin cần thiết theo hướng dẫn của hệ thống.",
          step4: "Theo dõi trạng thái xử lý và phản hồi bổ sung nếu được yêu cầu.",
          step5: "Nhận kết quả hoàn tất và xác nhận quyết định cuối cùng trên đơn.",
        },
        complaintsDisputes: {
          step1: "Mở giao dịch cần khiếu nại và chọn mục gửi yêu cầu xử lý tranh chấp.",
          step2: "Mô tả vấn đề cụ thể, nêu rõ yêu cầu xử lý và mốc thời gian liên quan.",
          step3: "Tải lên bằng chứng rõ ràng (ảnh/video/log chat/chứng từ) theo yêu cầu.",
          step4: "Theo dõi tiến trình xử lý, phản hồi bổ sung đúng thời hạn nếu được yêu cầu.",
          step5: "Nhận quyết định xử lý cuối cùng theo business rule nền tảng.",
        },
      },
      rules: {
        cm01: {
          title: "Vai trò nền tảng trung gian của CosMate",
          desc: "CosMate là nền tảng trung gian cung cấp hạ tầng kỹ thuật để kết nối Khách thuê với Shop/PTG/Staff. CosMate không trực tiếp cung cấp đồ hoặc dịch vụ vật lý, trừ phần trách nhiệm nền tảng đã công bố như escrow, chứng cứ và xử lý tranh chấp.",
        },
        cm02: {
          title: "Nguyên tắc ưu tiên áp dụng điều khoản",
          desc: "Thứ tự ưu tiên gồm: business rule nền tảng CosMate, điều khoản riêng của bên cung cấp đã duyệt/công khai, và thỏa thuận bổ sung có log trên nền tảng. Thỏa thuận ngoài hệ thống không được công nhận khi xử lý tranh chấp.",
        },
        cm03: {
          title: "Quyền quyết định cuối cùng khi tranh chấp",
          desc: "Khi có tranh chấp, quyết định xử lý của CosMate dựa trên bằng chứng hệ thống và business rule là quyết định cuối cùng, bắt buộc thi hành.",
        },
        cm04: {
          title: "Điều kiện truy cập và sử dụng giao dịch",
          desc: "Khách có thể xem sản phẩm/dịch vụ không cần đăng nhập. Để tạo giao dịch (đặt thuê, đặt dịch vụ, nhắn tin giao dịch, thanh toán), khách bắt buộc phải đăng nhập.",
        },
        cm05: {
          title: "Thông tin bắt buộc khi thực hiện giao dịch",
          desc: "Khách phải cung cấp tối thiểu: email và số điện thoại, địa chỉ nhận/trả (nếu có giao nhận), thông tin nhận hoàn tiền, và giấy tờ định danh có thể xác minh. CosMate có quyền yêu cầu bổ sung thông tin khi phát hiện rủi ro gian lận.",
        },
        cm06: {
          title: "Trách nhiệm về tính chính xác thông tin",
          desc: "Khách chịu trách nhiệm về thông tin đã cung cấp. Thông tin sai có thể dẫn tới hủy giao dịch, giữ/khấu trừ cọc theo rule hoặc hạn chế tài khoản.",
        },
        cm07: {
          title: "Điều kiện để giao dịch hợp lệ",
          desc: "Giao dịch chỉ hợp lệ khi khách chọn đúng cấu hình (thời gian/slot/mục đích/add-ons), đồng ý điều khoản nền tảng và điều khoản bên cung cấp, đồng thời thanh toán đủ các khoản cần thiết.",
        },
        cm08: {
          title: "Không được tự ý đổi bản chất giao dịch",
          desc: "Khách và bên cung cấp không được đổi bản chất giao dịch đã chốt trên hệ thống (loại thuê, gói, số người, slot...) nếu không có order bổ sung hoặc chỉnh sửa hợp lệ trên CosMate.",
        },
        cm09: {
          title: "Rủi ro giao dịch ngoài nền tảng",
          desc: "CosMate không chịu trách nhiệm cho chốt giá, chuyển khoản, hoặc thỏa thuận miệng ngoài hệ thống. Nếu vẫn thực hiện, mọi rủi ro thuộc về các bên tham gia.",
        },
        cm10: {
          title: "Dòng tiền và cơ chế escrow",
          desc: "CosMate có thể giữ tiền cọc và/hoặc tiền dịch vụ theo cơ chế escrow. Khoản tiền chỉ được giải ngân/hoàn khi giao dịch hoàn tất hoặc có quyết định xử lý tranh chấp.",
        },
        cm11: {
          title: "Bản chất và mục đích tiền cọc",
          desc: "Tiền cọc dùng để ràng buộc trách nhiệm khi thuê/đặt lịch và bù trừ tổn thất nếu khách vi phạm hoặc gây hư hỏng. Cọc có thể bị khấu trừ/giữ theo rule nếu lỗi thuộc về khách.",
        },
        cm12: {
          title: "Hiệu lực của phụ phí và phát sinh",
          desc: "Phụ phí (giặt dưỡng, wig, overtime, add-ons...) chỉ có hiệu lực khi đã cấu hình trước hoặc được xác nhận phát sinh bằng order bổ sung trên CosMate. Phát sinh nói miệng ngoài hệ thống không dùng để khấu trừ cọc.",
        },
        cm13: {
          title: "Quy tắc gia hạn giao dịch",
          desc: "Gia hạn chỉ hợp lệ khi khách gửi yêu cầu trên CosMate, bên cung cấp chấp nhận, hệ thống tạo order mới và khách thanh toán khoản gia hạn.",
        },
        cm14: {
          title: "Đồng kiểm bắt buộc và nghĩa vụ cung cấp chứng cứ",
          desc: "Với thuê đồ cosplay, khách phải quay video mở hàng khi nhận và cung cấp ảnh/video khi trả đồ theo quy trình. Với PTG/Staff, check-in/check-out, log chat và file bàn giao là căn cứ chính.",
        },
        cm15: {
          title: "Mốc thời gian bắt đầu và kết thúc giao dịch",
          desc: "Thuê đồ bắt đầu từ mốc giao thành công hoặc trạng thái delivered trên nền tảng. Trả đồ hợp lệ theo mốc hệ thống ghi nhận hoàn tất trả và đồng kiểm trả.",
        },
        cm16: {
          title: "Giá trị pháp lý của dữ liệu trên CosMate",
          desc: "Video, ảnh, log, mốc thời gian và điều khoản đã chấp nhận trên CosMate là bằng chứng hợp lệ, có mức ưu tiên cao nhất khi xử lý tranh chấp.",
        },
        cm17: {
          title: "Cửa sổ khiếu nại hợp lệ",
          desc: "Khách chỉ được khiếu nại trong thời gian quy định sau khi nhận hàng/hoàn tất dịch vụ. Quá hạn, hệ thống mặc định khách đã chấp nhận tình trạng hàng/dịch vụ, trừ trường hợp gian lận nghiêm trọng.",
        },
        cm18: {
          title: "Nguyên tắc thay đổi lịch, hủy, dời, nhượng",
          desc: "Mọi thay đổi chỉ được công nhận khi thao tác qua CosMate hoặc được xác nhận bằng log trên nền tảng. Thỏa thuận đổi lịch ngoài hệ thống không được CosMate bảo vệ khi có tranh chấp.",
        },
        cm19: {
          title: "Hủy sai quy định và chế tài cọc",
          desc: "Nếu khách hủy không đúng thời hạn hoặc điều kiện đã công bố, CosMate áp dụng giữ/khấu trừ cọc theo chính sách nền tảng và điều khoản bên cung cấp đã duyệt.",
        },
        cm20: {
          title: "Bảo vệ khách khi lỗi thuộc bên cung cấp",
          desc: "Nếu bên cung cấp hủy hoặc không thực hiện đúng cam kết và khách có bằng chứng hợp lệ, khách được hoàn 100% cọc cùng các khoản đã thu theo rule nền tảng.",
        },
        cm21: {
          title: "Nghĩa vụ bảo quản tài sản thuê",
          desc: "Trong thời gian thuê, khách phải tuân thủ quy định sử dụng tài sản của shop đã công khai và được duyệt. Khách không được tự ý sửa/biến đổi wig, trang phục, phụ kiện nếu không có chấp thuận qua log/chat CosMate.",
        },
        cm22: {
          title: "Nghĩa vụ hợp tác khi phát sinh sự cố",
          desc: "Khi xảy ra rách, mất phụ kiện, trễ trả hoặc sự cố khác, khách phải báo trên CosMate sớm nhất và cung cấp bằng chứng. Che giấu hoặc báo muộn có thể làm tăng mức khấu trừ cọc theo policy.",
        },
        cm23: {
          title: "Quyền can thiệp của CosMate trong tranh chấp",
          desc: "Khi có tranh chấp, CosMate có quyền tạm giữ tiền trong escrow, yêu cầu hai bên bổ sung chứng cứ, đóng băng giao dịch hoặc hạn chế tài khoản tạm thời.",
        },
        cm24: {
          title: "Nghĩa vụ hợp tác xử lý tranh chấp",
          desc: "Khách phải phản hồi và cung cấp chứng cứ đúng thời hạn. Nếu không hợp tác hoặc quá hạn, CosMate có quyền xử lý theo hướng bảo vệ bên còn lại dựa trên chứng cứ sẵn có.",
        },
        cm25: {
          title: "Gian lận và hành vi bị cấm",
          desc: "Nghiêm cấm giả mạo thông tin, dùng bằng chứng giả/chỉnh sửa bằng chứng để trục lợi, cố tình gây hư hỏng/chiếm đoạt/quỵt phí, hoặc lôi kéo giao dịch ngoài nền tảng để né escrow.",
        },
        cm26: {
          title: "Đánh giá sau giao dịch",
          desc: "Sau mỗi giao dịch, khách có quyền đánh giá shop/PTG/staff theo cơ chế hệ thống. Đánh giá chỉ hợp lệ khi phát sinh từ giao dịch thật trên CosMate.",
        },
        cm27: {
          title: "Điểm uy tín và quyền lợi khách thuê",
          desc: "CosMate tổng hợp điểm uy tín dựa trên tỉ lệ hoàn thành, số lần tranh chấp, mức độ hợp tác và lịch sử vi phạm. Khách uy tín cao có thể nhận ưu đãi theo chính sách.",
        },
        cm28: {
          title: "Quy định blacklist",
          desc: "CosMate có quyền đưa khách vi phạm nghiêm trọng vào blacklist và công khai trạng thái vi phạm theo chính sách nền tảng.",
        },
        cm29: {
          title: "Quyền cập nhật business rule",
          desc: "CosMate có quyền cập nhật business rule. Việc khách tiếp tục sử dụng nền tảng sau thông báo được xem là đồng ý với rule mới.",
        },
        cm30: {
          title: "Hạn chế hoặc chấm dứt quyền sử dụng",
          desc: "CosMate có quyền hạn chế hoặc chấm dứt quyền sử dụng dịch vụ của khách nếu vi phạm nhiều lần, gian lận, hoặc gây ảnh hưởng nghiêm trọng đến hệ thống và cộng đồng.",
        },
      },
    },
  },

  /**
   * Checkout / Order text
   */
  checkout: {
    // No address modal
    noAddress: {
      title: "Chưa có địa chỉ nhận hàng",
      message: "Bạn chưa có địa chỉ nhận hàng. Bạn có muốn tạo địa chỉ ngay bây giờ không?",
      confirm: "Tạo địa chỉ",
      cancel: "Hủy",
    },

    // Page
    page: {
      title: "Xác nhận đơn thuê",
      subtitle: "Vui lòng kiểm tra thông tin và chọn địa chỉ giao hàng",
    },

    // Address selection
    address: {
      title: "Địa chỉ nhận hàng",
      select: "Chọn địa chỉ",
      empty: "Bạn chưa có địa chỉ nào",
      addNew: "Thêm địa chỉ mới",
    },

    // Order summary
    summary: {
      title: "Thông tin đơn thuê",
      costume: "Trang phục",
      rentalDays: "Số ngày thuê",
      startDate: "Ngày bắt đầu",
      rentalOption: "Gói thuê",
      noRentalOption: "Không có",
      accessories: "Phụ kiện kèm theo",
      noAccessories: "Không có",
      required: "Bắt buộc",
      surcharges: "Phụ phí",
      surchargesNote: "(luôn áp dụng)",
      deposit: "Tiền cọc",
      total: "Tổng cộng",
      pricePerDay: "Giá/ngày",
      baseRent: "Tiền thuê",
      accessoriesTotal: "Phụ kiện",
      surchargesTotal: "Phụ phí",
      rentalOptionPrice: "Gói thuê",
      totalToPay: "Tổng cần thanh toán",
    },

    // Policy
    policy: {
      label: "Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật",
      required: "Bạn cần đồng ý với điều khoản để tiếp tục",
    },

    // Payment
    payment: {
      title: "Phương thức thanh toán",
      method: "Chọn phương thức",
      momo: "MoMo",
      momoDesc: "Thanh toán nhanh qua ứng dụng MoMo",
      vnpay: "VNPAY",
      vnpayDesc: "Thanh toán qua ngân hàng hoặc thẻ ATM",
      wallet: "Ví CosMate",
      walletDesc: "Sử dụng số dư trong ví CosMate của bạn",
    },

    // Actions
    actions: {
      submit: "Tiếp tục thanh toán",
      submitting: "Đang xử lý...",
      backToCostumes: "Quay lại danh sách trang phục",
    },

    // Messages
    messages: {
      orderSuccess: "Tạo đơn thuê thành công! Đang chuyển đến thanh toán...",
      orderError: "Không thể tạo đơn thuê. Vui lòng thử lại.",
      noDraft: "Không có thông tin đơn thuê. Vui lòng chọn trang phục trước.",
    },
  },

  /**
   * Staff dashboard text
   */
  staff: {
    layout: {
      title: "Bảng điều khiển Staff",
      brandName: "CosMate Staff",
      brandShort: "SM",
    },
    comingSoon: {
      message: "Tính năng đang được phát triển. Vui lòng quay lại sau.",
    },
    sidebar: {
      dashboard: "Trang chủ",
      aiTokenPlans: "Gói AI Token",
      aiTokenPurchases: "Lịch sử mua token",
      orders: "Đơn hàng",
      customers: "Khách hàng",
      reports: "Báo cáo",
      messages: "Tin nhắn",
      settings: "Cài đặt",
      withdraw: "Yêu cầu rút tiền",
      disputes: "Khiếu nại",
    },
    home: {
      welcome: "Chào mừng trở lại, Staff!",
      overview: "Quản lý công việc, lịch trình và đơn hàng của bạn từ đây.",
      recentBookings: "Đơn hàng gần đây",
      tableCustomer: "Khách hàng",
      tableService: "Dịch vụ",
      tableDate: "Ngày",
      tableTime: "Thời gian",
      tableStatus: "Trạng thái",
    },
    tokenPlans: {
      title: "Quản lý gói AI Token",
      description: "Xem, tạo và chỉnh sửa gói token dành cho người dùng CosMate.",
      create: "Tạo gói token",
      edit: "Chỉnh sửa gói token",
      detail: "Chi tiết gói token",
      empty: "Chưa có gói token nào",
      loadError: "Không thể tải danh sách gói token",
      createSuccess: "Tạo gói token thành công",
      createError: "Không thể tạo gói token",
      updateSuccess: "Cập nhật gói token thành công",
      updateError: "Không thể cập nhật gói token",
      searchPlaceholder: "Tìm theo tên, mô tả hoặc số token",
      filterStatus: "Lọc trạng thái",
      statusAll: "Tất cả",
      statusActive: "Đang hoạt động",
      statusInactive: "Tạm dừng",
      activate: "Kích hoạt",
      deactivate: "Tạm dừng",
      confirmActivate: "Bạn có chắc muốn kích hoạt gói token này?",
      confirmDeactivate: "Bạn có chắc muốn tạm dừng gói token này?",
      activateSuccess: "Kích hoạt gói token thành công",
      activateError: "Không thể kích hoạt gói token",
      deactivateSuccess: "Tạm dừng gói token thành công",
      deactivateError: "Không thể tạm dừng gói token",
      delete: "Xóa",
      confirmDelete: "Bạn có chắc muốn xóa gói token này? Hành động này không thể hoàn tác.",
      deleteSuccess: "Xóa gói token thành công",
      deleteError: "Không thể xóa gói token",
      form: {
        name: "Tên gói",
        namePlaceholder: "Ví dụ: Gói 100 token",
        price: "Giá (VNĐ)",
        pricePlaceholder: "Ví dụ: 99000",
        numberOfToken: "Số token",
        numberOfTokenPlaceholder: "Số token trong gói",
        isActive: "Kích hoạt ngay",
        description: "Mô tả",
        descriptionPlaceholder: "Mô tả ngắn về quyền lợi gói token.",
      },
      validation: {
        nameRequired: "Vui lòng nhập tên gói",
        nameMax: "Tối đa 200 ký tự",
        priceRequired: "Vui lòng nhập giá",
        priceMin: "Giá phải từ 0 trở lên",
        tokenRequired: "Vui lòng nhập số token",
        tokenMin: "Số token phải từ 0 trở lên",
      },
      columns: {
        id: "ID",
        name: "Tên gói",
        price: "Giá",
        numberOfToken: "Số token",
        status: "Trạng thái",
        actions: "Hành động",
      },
      paginationTotal: "gói",
    },
    tokenPurchases: {
      title: "Lịch sử mua AI Token",
      description: "Xem toàn bộ giao dịch mua token AI trên hệ thống.",
      refresh: "Làm mới",
      searchPlaceholder: "Tìm theo ID, user, transaction, trạng thái...",
      filterStatus: "Lọc trạng thái",
      empty: "Chưa có giao dịch mua token nào",
      loadError: "Không thể tải lịch sử mua token",
      detailError: "Không thể tải chi tiết giao dịch",
      detailFallback: "Hiển thị dữ liệu từ danh sách (API chi tiết không khả dụng)",
      viewDetail: "Xem chi tiết",
      detailTitle: "Chi tiết giao dịch #{id}",
      detailTitleFallback: "Chi tiết giao dịch",
      paginationTotal: "{count} giao dịch",
      columns: {
        id: "ID",
        userId: "User ID",
        subscriptionId: "Subscription ID",
        transactionId: "Transaction ID",
        priceAtPurchase: "Giá mua",
        tokensAdded: "Token cộng",
        purchaseDate: "Ngày mua",
        status: "Trạng thái",
        actions: "Thao tác",
      },
      statusLabels: {
        SUCCESS: "Thành công",
        FAILED: "Thất bại",
        PENDING: "Đang chờ",
        PROCESSING: "Đang xử lý",
        COMPLETED: "Hoàn thành",
        PAID: "Đã thanh toán",
        CANCELLED: "Đã hủy",
        CANCELED: "Đã hủy",
      },
    },
    bookings: {
      title: "Quản lý đơn hàng",
      searchPlaceholder: "Tìm kiếm đơn hàng...",
      statusAll: "Tất cả",
      statusPending: "Chờ xác nhận",
      statusConfirmed: "Đã xác nhận",
      statusInProgress: "Đang thực hiện",
      statusCompleted: "Hoàn thành",
      statusCancelled: "Đã hủy",
      empty: "Chưa có đơn hàng nào",
      loadError: "Không thể tải danh sách đơn hàng",
    },
    orders: {
      title: "Quản lý đơn hàng",
      description: "Danh sách đơn hàng trên hệ thống (thuê trang phục, dịch vụ).",
      searchPlaceholder: "Tìm theo mã đơn, cosplayer, provider...",
      filterStatus: "Lọc trạng thái",
      filterOrderType: "Lọc loại đơn",
      refresh: "Làm mới",
      empty: "Chưa có đơn hàng nào",
      loadError: "Không thể tải danh sách đơn hàng",
      detailError: "Không thể tải chi tiết đơn hàng",
      detailFallback: "Hiển thị thông tin cơ bản (không tải được chi tiết đầy đủ).",
      detailTitle: "Chi tiết đơn #{id}",
      detailTitleFallback: "Chi tiết đơn hàng",
      viewDetail: "Xem chi tiết",
      paginationTotal: "Tổng {count} đơn hàng",
      transactions: "Giao dịch thanh toán",
      addressPhone: "Số điện thoại",
      addressLine: "Địa chỉ",
      txAmount: "Số tiền",
      txType: "Loại",
      txStatus: "Trạng thái",
      txMethod: "Phương thức",
      txCreatedAt: "Thời gian",
      orderTypes: {
        RENT_COSTUME: "Thuê trang phục",
        RENT_SERVICE: "Thuê dịch vụ",
      },
      columns: {
        id: "Mã đơn",
        orderType: "Loại đơn",
        cosplayerId: "Cosplayer",
        providerId: "Provider",
        totalAmount: "Tổng tiền",
        totalDepositAmount: "Tiền cọc",
        status: "Trạng thái",
        createdAt: "Ngày tạo",
        actions: "Thao tác",
      },
    },
    disputes: {
      title: "Khiếu nại",
      description: "Danh sách khiếu nại từ người dùng",
      orderId: "Mã đơn hàng",
      cosplayerId: "Cosplayer",
      providerId: "Provider",
      totalAmount: "Tổng tiền",
      orderStatus: "Trạng thái đơn",
      orderType: "Loại đơn",
      orderInfo: "Thông tin đơn hàng",
      createdAt: "Ngày tạo",
      reason: "Lý do",
      evidence: "Hình ảnh chứng cứ",
      result: "Kết quả",
      penaltyAmount: "Số tiền phạt",
      penaltyPercent: "Phần trăm phạt",
      status: "Trạng thái",
      disputeDetail: "Chi tiết khiếu nại",
      disputeImageAlt: "Ảnh chứng cứ",
      filterAll: "Tất cả",
      filterOpen: "Mở",
      filterResolved: "Đã giải quyết",
      filterRejected: "Từ chối",
      statusOpen: "Mở",
      statusResolved: "Đã giải quyết",
      statusRejected: "Từ chối",
      empty: "Chưa có khiếu nại nào",
    },
    withdraw: {
      title: "Yêu cầu rút tiền",
      description: "Danh sách yêu cầu rút tiền từ người dùng",
      colId: "Mã yêu cầu",
      colUser: "Người dùng",
      colAmount: "Số tiền",
      colBankAccount: "Số tài khoản",
      colBankName: "Ngân hàng",
      colStatus: "Trạng thái",
      colRequestedAt: "Ngày yêu cầu",
      colAction: "Hành động",
      statusCompleted: "Hoàn thành",
      statusFailed: "Thất bại",
      statusPending: "Đang chờ",
      empty: "Chưa có yêu cầu rút tiền nào",
      loadError: "Không thể tải danh sách yêu cầu rút tiền",
      reject: "Từ chối",
      rejecting: "Đang xử lý...",
      rejectSuccess: "Đã từ chối yêu cầu rút tiền",
      rejectError: "Không thể từ chối yêu cầu. Vui lòng thử lại.",
      approve: "Duyệt",
      approving: "Đang duyệt...",
      approveSuccess: "Đã duyệt yêu cầu rút tiền",
      approveError: "Không thể duyệt yêu cầu. Vui lòng thử lại.",
      onlyPendingCanApprove: "Chỉ yêu cầu đang chờ mới có thể duyệt",
      onlyPendingCanReject: "Chỉ yêu cầu đang chờ mới có thể từ chối",
      rejectModalTitle: "Từ chối yêu cầu rút tiền",
      rejectModalDesc: "Vui lòng nhập lý do từ chối:",
      rejectModalOk: "Từ chối",
      rejectReasonPlaceholder: "VD: Số tài khoản không hợp lệ",
    },
  },

  /**
   * Payment Result Page
   */
  paymentResult: {
    successTitle: "Thanh toán thành công!",
    successDesc: "Cảm ơn bạn đã đặt thuê trang phục tại CosMate. Đơn hàng của bạn đang được xử lý.",
    failedTitle: "Thanh toán thất bại",
    failedDesc: "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
    cancelledTitle: "Thanh toán đã bị hủy",
    cancelledDesc: "Giao dịch thanh toán đã bị hủy. Bạn có thể thử lại hoặc quay lại sau.",
    pendingTitle: "Thanh toán đang xử lý",
    pendingDesc: "Đơn hàng đang chờ thanh toán. Vui lòng hoàn tất thanh toán để xác nhận đơn.",
    unknownTitle: "Kết quả thanh toán",
    unknownDesc: "Không xác định được trạng thái thanh toán. Vui lòng liên hệ hỗ trợ nếu bạn đã thanh toán.",
    orderIdLabel: "Mã đơn hàng",
    transactionIdLabel: "Mã giao dịch",
    primarySuccessCta: "Xem đơn hàng",
    primaryFailedCta: "Quay lại thanh toán",
    homeCta: "Về trang chủ",
    tokenSuccessTitle: "Mua token thành công!",
    tokenSuccessDesc: "Token đã được cộng vào tài khoản của bạn. Bạn có thể sử dụng ngay.",
    tokenPrimarySuccessCta: "Về trang quản lý token",
    verifying: "Đang xác minh trạng thái thanh toán...",
  },
};

/**
 * Type helper for accessing VI dictionary keys with autocomplete
 */
export type VIKeys = typeof VI;
