-- ==============================================================================
-- KRON-DAHLAH STEAKHOUSE & WESTERN DINING - CƠ SỞ DỮ LIỆU HỆ THỐNG
-- Môn học: Quản lý dự án CNTT - Đại học Kinh tế Quốc dân (NEU)
-- Hệ quản trị CSDL: SQLite 3
-- ==============================================================================

-- Bảng 1: Quản lý Đơn Đặt Bàn (Bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,               -- Mã tra cứu: KD-xxxx
    customer_name TEXT NOT NULL,                     -- Tên khách hàng
    phone TEXT NOT NULL,                             -- Số điện thoại liên hệ
    location TEXT NOT NULL,                          -- Không gian: Bàn nến hoa, Sảnh chính, Phòng VIP...
    guests TEXT NOT NULL,                            -- Số lượng khách: 2 người, 4 người...
    booking_date TEXT NOT NULL,                      -- Ngày dùng tiệc: YYYY-MM-DD
    booking_time TEXT NOT NULL,                      -- Giờ dùng tiệc: 18:30 PM, 19:00 PM...
    set_menu TEXT DEFAULT 'Chưa chọn (Gọi món tại bàn)', -- Set Menu đã chọn trước
    notes TEXT,                                      -- Ghi chú yêu cầu đặc biệt
    status TEXT DEFAULT 'pending',                   -- pending, confirmed, completed, cancelled
    estimated_price INTEGER DEFAULT 0,               -- Ước tính doanh thu (VNĐ)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Thời gian tạo đơn
);

-- Bảng 2: Quản lý Thực đơn Món Âu (Menu Items)
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,                       -- Mã món: MN-01, MN-02...
    name TEXT NOT NULL,                              -- Tên món ăn
    category TEXT NOT NULL,                          -- steak, starter, pasta, seafood, dessert, wine, combo
    price INTEGER NOT NULL,                          -- Giá niêm yết (VNĐ)
    description TEXT,                                -- Mô tả hương vị, nguyên liệu
    image_url TEXT,                                  -- Đường dẫn ảnh món ăn
    is_signature BOOLEAN DEFAULT 0,                  -- Món đặc trưng (Signature)
    is_available BOOLEAN DEFAULT 1,                  -- Còn món hay hết món
    calories INTEGER DEFAULT 500,                    -- Lượng calo
    nutri_score INTEGER DEFAULT 75,                  -- Điểm dinh dưỡng NutriScore
    rating REAL DEFAULT 4.9                          -- Đánh giá sao trung bình
);

-- Bảng 3: Đánh giá & Phản hồi Thực khách (Customer Reviews)
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,                     -- Tên thực khách đánh giá
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), -- Đánh giá 1 - 5 sao
    comment TEXT NOT NULL,                           -- Nội dung nhận xét
    dish_name TEXT,                                  -- Món ăn đã trải nghiệm
    avatar_url TEXT,                                 -- Ảnh đại diện
    is_approved BOOLEAN DEFAULT 1,                   -- Đã duyệt hiển thị
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Thời gian đánh giá
);

-- Bảng 4: Liên hệ & Chăm sóc Khách hàng (Contacts & Inquiries)
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,                              -- Tên người gửi
    phone TEXT NOT NULL,                             -- SĐT liên hệ
    email TEXT,                                      -- Email
    subject TEXT DEFAULT 'Yêu cầu tư vấn tiệc',      -- Tiêu đề
    message TEXT NOT NULL,                           -- Nội dung góp ý / yêu cầu
    status TEXT DEFAULT 'unread',                    -- unread, processed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Thời gian gửi
);
