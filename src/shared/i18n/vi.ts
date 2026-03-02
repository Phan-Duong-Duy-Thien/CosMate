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
      staffs: "Thuê Staff",
      admin: "Quản trị",
      users: "Quản lý người dùng",
      provider: "Provider",
      providerCostumes: "Quản lý trang phục",
      create: "Tạo mới",
      edit: "Chỉnh sửa",
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
    handleLabel: "Tài khoản Cosplayer",
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
        name: "Tên địa chỉ",
        namePlaceholder: "Ví dụ: Nhà, Công ty",
        phone: "Số điện thoại",
        phonePlaceholder: "Nhập số điện thoại",
        city: "Tỉnh/Thành phố",
        cityPlaceholder: "Chọn Tỉnh/Thành phố",
        district: "Quận/Huyện",
        districtPlaceholder: "Chọn Quận/Huyện",
        ward: "Phường/Xã",
        wardPlaceholder: "Chọn Phường/Xã",
        streetAddress: "Địa chỉ chi tiết",
        streetAddressPlaceholder: "Số nhà, tên đường",
      },
      validation: {
        required: "Trường này là bắt buộc",
        invalidPhone: "Số điện thoại không hợp lệ",
        selectCity: "Vui lòng chọn Tỉnh/Thành phố",
        selectDistrict: "Vui lòng chọn Quận/Huyện",
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
      title: "Đơn mua",
      history: "Xem lịch sử mua hàng",
      pendingConfirm: "Chờ xác nhận",
      pendingPickup: "Chờ lấy hàng",
      shipping: "Chờ giao hàng",
      review: "Đánh giá",
      historyPlaceholder: "Lịch sử mua hàng sẽ hiển thị tại đây.",
      filterLabel: "Bộ lọc hiện tại",
    },

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
      paymentMethodLabel: "Phương thức thanh toán",
      momo: "MoMo",
      momoDesc: "Thanh toán nhanh qua ứng dụng MoMo",
      vnpay: "VNPAY",
      vnpayDesc: "Thanh toán qua ngân hàng hoặc thẻ ATM",
      invalidAmount: "Số tiền phải lớn hơn 0",
      selectPaymentMethod: "Vui lòng chọn phương thức thanh toán",
      processing: "Đang xử lý...",
      error: "Có lỗi xảy ra. Vui lòng thử lại.",
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
   * Payment Result Page
   */
  paymentResult: {
    successTitle: "Thanh toán thành công!",
    successDesc: "Cảm ơn bạn đã đặt thuê trang phục tại CosMate. Đơn hàng của bạn đang được xử lý.",
    failedTitle: "Thanh toán thất bại",
    failedDesc: "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
    cancelledTitle: "Thanh toán đã bị hủy",
    cancelledDesc: "Giao dịch thanh toán đã bị hủy. Bạn có thể thử lại hoặc quay lại sau.",
    unknownTitle: "Kết quả thanh toán",
    unknownDesc: "Không xác định được trạng thái thanh toán. Vui lòng liên hệ hỗ trợ nếu bạn đã thanh toán.",
    orderIdLabel: "Mã đơn hàng",
    primarySuccessCta: "Xem đơn hàng",
    primaryFailedCta: "Quay lại thanh toán",
    homeCta: "Về trang chủ",
  },
};

/**
 * Type helper for accessing VI dictionary keys with autocomplete
 */
export type VIKeys = typeof VI;
