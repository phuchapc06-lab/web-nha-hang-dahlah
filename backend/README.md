# HỆ THỐNG BACKEND & CSDL NHÀ HÀNG KRON-DAHLAH (STEAKHOUSE & WESTERN DINING)
> **Môn học:** Quản lý dự án Công nghệ Thông tin - Đại học Kinh tế Quốc dân (NEU)  
> **Kiến trúc:** 3-Tier Architecture (Client-Side HTML5/CSS3/JS, Application REST API Flask/Python, Database SQLite 3)

---

## 1. CẤU TRÚC THƯ MỤC BACKEND

```
web nhà hàng/
├── CHAY_BACKEND.bat          # Click đúp để khởi chạy Backend nhanh trên Windows
├── index.html                # Giao diện website khách hàng
├── js/script.js              # Mã JavaScript kết nối API tự động + LocalStorage Fallback
├── backend/
│   ├── app.py                # Server Flask chính, CORS, Routing & RESTful API
│   ├── database.py           # Kết nối và quản lý CSDL SQLite
│   ├── schema.sql            # Định nghĩa các bảng (Bookings, Menu, Reviews, Contacts)
│   ├── seed_data.py          # Chèn dữ liệu mẫu phong phú
│   ├── kron_dahlah.db        # File CSDL SQLite thực tế
│   ├── requirements.txt      # Thư viện phụ thuộc (flask, flask-cors)
│   ├── run_server.bat        # Script khởi chạy môi trường
│   ├── README.md             # Tài liệu đặc tả kỹ thuật Backend
│   └── admin/
│       └── index.html        # Giao diện Quản trị viên (Admin Dashboard)
```

---

## 2. DANH SÁCH RESTFUL API ENDPOINTS

### 2.1. Module Đặt bàn (Table Reservations)
| Phương thức | Endpoint | Chức năng | Tham số / Body |
|---|---|---|---|
| `GET` | `/api/bookings` | Lấy danh sách đơn đặt bàn | `status`, `date`, `search` |
| `GET` | `/api/bookings/<id_or_code>` | Tra cứu đơn theo mã `KD-xxxx` hoặc ID | Path parameter |
| `POST` | `/api/bookings` | Tạo đơn đặt bàn mới từ website | `name`, `phone`, `date`, `time`, `guests`, `location`, `setMenu`, `notes` |
| `PATCH` | `/api/bookings/<id>/status` | Cập nhật trạng thái đơn | `{"status": "confirmed" \| "completed" \| "cancelled"}` |
| `DELETE` | `/api/bookings/<id>` | Xóa đơn đặt bàn | Path parameter |

### 2.2. Module Quản lý Thực đơn (Menu Management)
| Phương thức | Endpoint | Chức năng | Tham số / Body |
|---|---|---|---|
| `GET` | `/api/menu` | Lấy danh sách món ăn | `category` (steak, starter, pasta, combo...) |
| `POST` | `/api/menu` | Thêm món mới vào menu | `name`, `category`, `price`, `description` |
| `PATCH` | `/api/menu/<id>/toggle-availability` | Bật/tắt trạng thái Còn món / Hết món | Path parameter |
| `DELETE` | `/api/menu/<id>` | Xóa món ăn khỏi thực đơn | Path parameter |

### 2.3. Module Đánh giá & Phản hồi (Customer Reviews)
| Phương thức | Endpoint | Chức năng | Tham số / Body |
|---|---|---|---|
| `GET` | `/api/reviews` | Lấy danh sách review của thực khách | `is_approved=1` |
| `POST` | `/api/reviews` | Khách gửi đánh giá mới | `customer_name`, `rating`, `comment`, `dish_name` |

### 2.4. Module Liên hệ & CSKH (Contacts)
| Phương thức | Endpoint | Chức năng | Tham số / Body |
|---|---|---|---|
| `GET` | `/api/contacts` | Xem danh sách tin nhắn liên hệ | Admin only |
| `POST` | `/api/contacts` | Gửi thắc mắc / yêu cầu đặt tiệc | `name`, `phone`, `email`, `message` |

### 2.5. Module Thống kê & Báo cáo (Admin Stats & KPIs)
| Phương thức | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/api/stats` | Thống kê tổng đơn, đơn hôm nay, đơn chờ duyệt, doanh thu dự kiến, phân bố khung giờ |

---

## 3. CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

1. **`bookings`**: `id`, `booking_code` (KD-xxxx), `customer_name`, `phone`, `location`, `guests`, `booking_date`, `booking_time`, `set_menu`, `notes`, `status`, `estimated_price`, `created_at`.
2. **`menu_items`**: `id`, `code`, `name`, `category`, `price`, `description`, `image_url`, `is_signature`, `is_available`, `calories`, `nutri_score`, `rating`.
3. **`reviews`**: `id`, `customer_name`, `rating`, `comment`, `dish_name`, `avatar_url`, `is_approved`, `created_at`.
4. **`contacts`**: `id`, `name`, `phone`, `email`, `subject`, `message`, `status`, `created_at`.

---

## 4. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

### Cách 1: Click đúp file `.bat` (Tiện lợi nhất)
* Chỉ cần click đúp vào file `CHAY_BACKEND.bat` tại thư mục gốc của dự án. Hệ thống sẽ tự động cài thư viện, khởi tạo CSDL và bật server.

### Cách 2: Khởi chạy thủ công bằng dòng lệnh
```powershell
cd "backend"
pip install -r requirements.txt
python seed_data.py
python app.py
```

* **Trang chủ Website:** [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
* **Giao diện Quản trị viên (Admin Portal):** [http://127.0.0.1:5000/admin](http://127.0.0.1:5000/admin)
* **Tra cứu API:** [http://127.0.0.1:5000/api/bookings](http://127.0.0.1:5000/api/bookings)
