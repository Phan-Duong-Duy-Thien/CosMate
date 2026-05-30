# CosMate — Hướng dẫn triển khai (bộ nộp module phần mềm)

## 1. Cấu trúc bộ nộp (đúng yêu cầu trường)

```
<ten-thu-muc-nop>/
├── frontend-build/
│   └── dist/                 # Build production React (Vite)
├── backend-build/
│   └── cosplay-rental-api.jar
├── docker-compose.yml
├── .env.example
├── README_Deploy.md          # File này
└── Accounts.txt              # Tài khoản demo cho GV chấm
```

## 2. Chuẩn bị trước khi nộp

### 2.1. Frontend (`frontend-build/dist`)

Trên máy dev, trong thư mục **CosMate_FE**:

```powershell
# Tạo .env.production (build trỏ API local)
@"
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_BASE_URL=http://localhost
VITE_GOOGLE_CLIENT_ID=
"@ | Set-Content .env.production -Encoding utf8

npm ci
npm run build
```

Hoặc chạy script gom bộ nộp (mục 4).

### 2.2. Backend (`backend-build/cosplay-rental-api.jar`)

Trong **CosMate_BE/KLTN_CosMate_Backend/cosmate-backend**:

```powershell
mvn -DskipTests clean package
```

File sinh ra thường là `target/cosmate-backend-0.0.1-SNAPSHOT.jar`.  
**Đổi tên** thành `cosplay-rental-api.jar` và copy vào `backend-build/`.

> Tên `cosplay-rental-api.jar` theo mẫu trường; nội dung vẫn là Spring Boot CosMate.

### 2.3. Database SQL Server

- Database: **CosMate** (schema đã có sẵn — `spring.jpa.hibernate.ddl-auto=validate`).
- Restore backup `.bak` / script SQL nhóm đã dùng khi dev.
- Điền `SPRING_DATASOURCE_*` trong file `.env` (copy từ `.env.example`).

### 2.4. Tài khoản demo

- Cập nhật `Accounts.txt` bằng user **thật** trong DB (email + mật khẩu GV có thể đăng nhập).
- Không ghi mật khẩu production / tài khoản cá nhân thật.

## 3. Chạy bằng Docker (khuyến nghị cho GV)

**Yêu cầu:** Docker Desktop, SQL Server đang chạy trên máy (cổng 1433), database CosMate đã restore.

```powershell
cd <thu-muc-nop>
copy .env.example .env
# Sửa .env: mật khẩu SQL, JWT_SECRET, ...

docker compose up -d
```

| Dịch vụ | URL |
|---------|-----|
| Giao diện web | http://localhost |
| API | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger-ui.html |

Dừng:

```powershell
docker compose down
```

### Lỗi thường gặp

| Triệu chứng | Cách xử lý |
|-------------|------------|
| API không start — lỗi DB | Kiểm tra SQL Server, `SPRING_DATASOURCE_URL`, firewall 1433 |
| FE trắng / 404 route | Đảm bảo `frontend-build/dist/index.html` tồn tại |
| Login 401 / CORS | `FRONTEND_URL=http://localhost`; BE cho phép origin `http://localhost` |
| Linux không có `host.docker.internal` | Đổi URL DB sang IP máy host |

## 4. Script gom bộ nộp tự động (CosMate_FE)

```powershell
cd CosMate_FE
.\scripts\assemble-submission.ps1
```

Tạo thư mục `submission/` đúng cấu trúc trường → **nén ZIP** thư mục đó và nộp.

## 5. Chạy không Docker (dự phòng)

**API:**

```powershell
java -jar backend-build\cosplay-rental-api.jar
```

(set biến môi trường giống `.env` hoặc `application.properties` local)

**FE:** phục vụ static `frontend-build/dist` bằng `npx serve -s frontend-build/dist -l 80`  
hoặc `npm run preview` sau khi copy dist vào project dev.

## 6. Kiểm tra nhanh trước khi nộp

- [ ] `frontend-build/dist/index.html` có
- [ ] `backend-build/cosplay-rental-api.jar` có (kích thước > vài MB)
- [ ] `Accounts.txt` đã điền tài khoản test
- [ ] `.env.example` không chứa secret thật
- [ ] Zip mở ra đúng cấu trúc mục 1
- [ ] Demo: login → xem trang phục → 1 luồng đơn hàng (tuỳ data DB)

---

**Sinh viên / nhóm:** CosMate — Nền tảng thuê trang phục & dịch vụ cosplay  
**Stack:** React (Vite) + Spring Boot + SQL Server
