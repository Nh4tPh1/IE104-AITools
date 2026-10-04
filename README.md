# Dự án: Việc học của tôi (OralEval IE104) - Bài thực hành 1

Ứng dụng web quản lý danh sách công việc học tập và cấu hình câu hỏi vấn đáp cho hệ thống OralEval IE104, được xây dựng bằng Next.js App Router, TypeScript và Tailwind CSS dựa trên bản thiết kế Google Stitch.

---

## 1. Lưu ý quan trọng về trạng thái dữ liệu (Bài thực hành 1)

> ⚠️ **TUYÊN BỐ VỀ CƠ SỞ DỮ LIỆU VÀ XÁC THỰC:**
> - Dự án ở Bài thực hành 1 **CHƯA KẾT NỐI DATABASE (Supabase)**.
> - **CHƯA CÓ ĐĂNG NHẬP THẬT**: Trang `/login` thuần túy là form mô phỏng giao diện người dùng (UI only), không thực hiện kiểm tra mật khẩu hay cấp quyền thật. Có liên kết "Xem giao diện công việc" để chuyển trực tiếp sang `/tasks`.
> - **DỮ LIỆU HOÀN TOÀN LÀ TẠM (IN-MEMORY STATE)**: Toàn bộ danh sách công việc, các thao tác thêm mới, sửa tên, đổi trạng thái hoàn thành và xóa chỉ tồn tại trong React State (`useState`) ở bộ nhớ RAM của trình duyệt. **Khi tải lại trang (F5 / Reload), dữ liệu sẽ trở về danh sách mẫu ban đầu theo đúng thiết kế của bài 1.**

---

## 2. Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu môi trường
- **Node.js**: Phiên bản LTS `>= 20.9` (khuyến nghị Node.js v20.x hoặc v22.x)
- **npm**: Phiên bản `>= 10.x`
- **Git**

### Bước 1: Cài đặt dependencies
Mở Terminal tại thư mục gốc của dự án (`viec-hoc`):

```bash
# Cài đặt các gói thư viện theo lockfile để đảm bảo tính đồng nhất
npm ci

# Hoặc dùng lệnh sau nếu cài đặt thông thường
npm install
```

### Bước 2: Chạy máy chủ phát triển (Development Server)

```bash
npm run dev
```

### Bước 3: Các địa chỉ URL cần mở trên trình duyệt
Sau khi máy chủ khởi động thành công, mở trình duyệt và truy cập các đường dẫn sau:
- **Trang chủ (`/`)**: [http://localhost:3000](http://localhost:3000) (Tự động chuyển hướng về `/tasks`)
- **Trang đăng nhập mẫu (`/login`)**: [http://localhost:3000/login](http://localhost:3000/login)
- **Trang quản lý công việc học tập (`/tasks`)**: [http://localhost:3000/tasks](http://localhost:3000/tasks)

---

## 3. Các lệnh kiểm tra chất lượng mã nguồn (Code Quality & Build)

Trước khi đóng gói mã nguồn hoặc commit Git, dự án đã vượt qua 3 bài kiểm tra:

```bash
# 1. Kiểm tra quy tắc định dạng và chất lượng code (ESLint)
npx eslint .

# 2. Kiểm tra kiểu dữ liệu nghiêm ngặt (TypeScript type check)
npx tsc --noEmit

# 3. Đóng gói kiểm thử toàn bộ ứng dụng Next.js
npm run build
```

---

## 4. Cấu trúc thư mục mã nguồn

```text
viec-hoc/
├── design/
│   └── stitch/                # Tài nguyên thiết kế tham chiếu (notes.md, html, ảnh desktop/mobile)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout chung
│   │   ├── page.tsx           # Trang gốc điều hướng redirect('/tasks')
│   │   ├── login/
│   │   │   └── page.tsx       # Route trang /login
│   │   └── tasks/
│   │       └── page.tsx       # Route trang /tasks
│   └── components/
│       ├── LoginForm.tsx      # Giao diện đăng nhập mẫu (split-screen)
│       ├── TaskDashboard.tsx  # Component quản lý giao diện chính và React state
│       ├── TaskForm.tsx       # Form nhập liệu công việc có validate
│       ├── TaskItem.tsx       # Từng dòng công việc (data-testid="task-item")
│       └── TaskList.tsx       # Danh sách hiển thị và xử lý trạng thái rỗng
├── CLAUDE.md                  # Ghi chú quy tắc phát triển dự án
├── package.json
└── tsconfig.json
```