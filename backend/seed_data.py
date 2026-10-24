# -*- coding: utf-8 -*-
"""
Database Seeder - Khởi tạo dữ liệu mẫu phong phú cho Nhà hàng Kron-Dahlah
"""

from database import get_db, init_db
from datetime import datetime, timedelta

def seed_all():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    # 1. Seed Menu Items
    menu_items = [
        # Bò Bít tết Thượng hạng
        ('MN-01', 'Thăn Bò Bít Tết Wagyu Úc MB5+', 'steak', 680000, 
         'Vân mỡ cẩm thạch tuyệt hảo đạt chuẩn MB5+, nướng than hoa thơm lừng kèm bơ thảo mộc và sốt nấm Truffle đen.',
         'img/gallery/gallery-2.jpg', 1, 1, 620, 88, 4.9),
        ('MN-02', 'Thăn Bò Black Angus Ribeye 300g', 'steak', 520000, 
         'Thịt thăn lưng bò đen Mỹ mềm mọng ngập nước, phục vụ cùng măng tây áp chảo và khoai tây nghiền bơ tỏi.',
         'img/gallery/gallery-7.jpg', 1, 1, 580, 85, 4.8),
        ('MN-03', 'Bít Tết Bò Mỹ Top Blade Sốt Tiêu Đen', 'steak', 390000, 
         'Thăn lõi vai bò Mỹ đậm đà, vị cay nồng quyến rũ của hạt tiêu Phú Quốc ngâm rượu vang đỏ.',
         'img/gallery/gallery-8.jpg', 0, 1, 540, 82, 4.8),

        # Món Khai Vị Tinh Tế (Starters)
        ('MN-04', 'Súp Kem Nấm Truffle Đen Khai Vị', 'starter', 145000, 
         'Súp kem béo ngậy nấu từ nấm rừng kết hợp tinh dầu Truffle đen quý hiếm và bánh mỳ nướng bơ tỏi giòn tan.',
         'img/gallery/gallery-3.jpg', 0, 1, 280, 80, 4.9),
        ('MN-05', 'Đĩa Cold Cuts & Phô Mai Nhập Khẩu Âu', 'starter', 320000, 
         'Thịt nguội Iberico trứ danh, xúc xích Salami và 3 loại phô mai Brie, Camembert, Cheddar ăn kèm oliu và nho khô.',
         'img/gallery/gallery-10.jpg', 0, 1, 450, 78, 4.7),
        ('MN-06', 'Salad Cá Hồi Xông Khói Sốt Chanh Leo', 'starter', 195000, 
         'Cá hồi Na Uy xông khói gỗ sồi, xà lách tươi hữu cơ Đà Lạt cùng sốt chanh leo chua ngọt thanh mát.',
         'img/gallery/gallery-11.jpg', 0, 1, 310, 92, 4.8),

        # Món Chính & Mỳ Ý (Pasta & Seafood)
        ('MN-07', 'Mỳ Ý Cua Tuyết Sốt Kem Nấm Truffle', 'pasta', 285000, 
         'Sợi mỳ dẹt Fettuccine làm thủ công trong ngày quyện sốt kem phô mai béo thơm và thịt cua tuyết ngọt mềm.',
         'img/gallery/gallery-1.jpg', 1, 1, 530, 80, 4.9),
        ('MN-08', 'Tôm Hùm Bỏ Lò Phô Mai Mozzarella', 'seafood', 750000, 
         'Nửa con tôm hùm bông tươi nướng đút lò phủ ngập phô mai béo ngậy, thảo mộc Rosemary thơm nức.',
         'img/gallery/gallery-12.jpg', 1, 1, 490, 86, 5.0),

        # Tráng Miệng Hoàng Gia (Dessert)
        ('MN-09', 'Bánh Tiramisu Truyền Thống Nước Ý', 'dessert', 120000, 
         'Bánh phô mai Mascarpone thơm ngát cà phê Espresso thượng hạng và rượu Kahlua quyến rũ.',
         'img/gallery/gallery-4.jpg', 0, 1, 350, 70, 4.9),
        ('MN-10', 'Panna Cotta Dâu Tây Rừng & Vani Madagascar', 'dessert', 95000, 
         'Món tráng miệng mềm mịn tan trong miệng ăn kèm mứt dâu tây rừng tươi nguyên chất.',
         'img/gallery/gallery-5.jpg', 0, 1, 260, 75, 4.8),

        # Bộ Sưu Tập Rượu Vang Châu Âu (Wine)
        ('MN-11', 'Vang Đỏ Bordeaux Château Cao Cấp (Chai)', 'wine', 1650000, 
         'Dòng vang Pháp đậm đà nồng nàn hương gỗ sồi và quả mọng đen chín, lý tưởng khi dùng cùng bít tết Wagyu.',
         'img/gallery/gallery-6.jpg', 1, 1, 150, 65, 4.9),
        ('MN-12', 'Vang Đỏ Chile Cabernet Sauvignon (Ly)', 'wine', 180000, 
         'Vị chát êm dịu, hậu vị trái cây ngọt ngào, kết hợp hoàn hảo cùng bữa tối hẹn hò.',
         'img/gallery/gallery-9.jpg', 0, 1, 130, 68, 4.8),

        # Set Menu Combo Trọn Gói
        ('MN-COMBO-01', 'Set Romance 2 Người (Lãng Mạn Nến Hoa)', 'combo', 990000, 
         'Trọn gói cho cặp đôi: 2 Súp nấm Truffle, 2 Bít tết Bò Mỹ Top Blade, 1 Tiramisu, 2 Ly vang đỏ Chile, tặng setup hoa nến.',
         'img/meals/meal-1.jpg', 1, 1, 1100, 85, 4.9),
        ('MN-COMBO-02', 'Set Royal Gourmet (4-6 Người - Tiệc VIP)', 'combo', 2490000, 
         'Trọn gói đại tiệc: 1 Đĩa Cold Cuts, 1 Tôm hùm bỏ lò, 1 Thăn Ribeye 500g, 1 Mỳ Ý cua tuyết, 4 Panna Cotta, 1 Chai vang Bordeaux.',
         'img/meals/meal-2.jpg', 1, 1, 2600, 88, 5.0),
    ]

    cursor.executemany('''
        INSERT OR REPLACE INTO menu_items 
        (code, name, category, price, description, image_url, is_signature, is_available, calories, nutri_score, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', menu_items)

    # 2. Seed Bookings
    today_str = datetime.now().strftime('%Y-%m-%d')
    tomorrow_str = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    next_week_str = (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')

    bookings = [
        ('KD-7821', 'Nguyễn Hoàng Long', '0912345678', 'Bàn nến hoa hẹn hò cặp đôi (Lãng mạn)', 
         '2 người (Cặp đôi)', today_str, '19:00 PM', 'Set Romance 2 người (990.000₫)', 
         'Kỷ niệm 1 năm ngày cưới, chuẩn bị nến thơm và góc bàn nhìn ra cửa sổ giúp tôi.', 'confirmed', 990000),
        
        ('KD-5512', 'Trần Thu Trang', '0988776655', 'Phòng VIP gia đình & đối tác (Riêng tư)', 
         '5 - 8 người (Tiệc gia đình)', today_str, '18:30 PM', 'Set Royal Gourmet 4-6 người (2.490.000₫)', 
         'Mừng sinh nhật mẹ tròn 50 tuổi, cần 1 bình hoa tươi và hỗ trợ bảo quản bánh kem mang từ ngoài vào.', 'pending', 2490000),
        
        ('KD-3920', 'Đặng Quốc Huy', '0903112233', 'Sảnh chính phong cách hoàng gia', 
         '3 - 4 người (Nhóm nhỏ)', tomorrow_str, '19:30 PM', 'Chưa chọn (Sẽ gọi món tại bàn)', 
         'Yêu cầu bàn gần piano biểu diễn nhạc sống nhẹ nhàng.', 'confirmed', 1500000),
        
        ('KD-8114', 'Phạm Mỹ Linh', '0977443322', 'Ban công ngoài trời ngắm phố', 
         '2 người (Cặp đôi)', next_week_str, '20:00 PM', 'Set Romance 2 người (990.000₫)', 
         'Cặp đôi thích không gian thoáng đãng ngoài ban công.', 'pending', 990000),

        ('KD-2041', 'Vũ Đức Thịnh', '0934556677', 'Phòng VIP gia đình & đối tác (Riêng tư)', 
         'Trên 8 người (Đặt tiệc lớn)', tomorrow_str, '18:00 PM', 'Set Royal Gourmet 4-6 người (2.490.000₫)', 
         'Tiệc tiếp đón đối tác ngoại giao, yêu cầu nhân viên am hiểu nghi thức rượu vang.', 'completed', 4980000),
    ]

    cursor.executemany('''
        INSERT OR IGNORE INTO bookings 
        (booking_code, customer_name, phone, location, guests, booking_date, booking_time, set_menu, notes, status, estimated_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', bookings)

    # 3. Seed Reviews
    reviews = [
        ('Sơn Tùng M-TP', 5, 'Không gian vô cùng sang trọng, thịt bò Wagyu MB5+ mềm tan như bơ đúng chuẩn hoàng gia châu Âu! Nhất định sẽ quay lại thường xuyên.', 'Thăn Bò Wagyu MB5+', 'img/customers/sontung.jpg'),
        ('Hannah Olala', 5, 'Bàn tiệc nến hoa decor rất có gu và lãng mạn. Rượu vang đỏ kết hợp cùng steak tròn vị. Nhân viên chu đáo, lễ phép 10/10.', 'Set Romance 2 Người', 'img/customers/hannah.jpg'),
        ('Khánh Linh (Cô Em Trendy)', 5, 'Góc chụp ảnh cực kỳ sang xịn mịn, món Tôm hùm bỏ lò phô mai ngon đỉnh chóp! Các bạn hẹn hò nhất định nên ghé Kron-Dahlah.', 'Tôm Hùm Bỏ Lò Mozzarella', 'img/customers/khanhlinh.jpg'),
        ('Hoàng Dũng', 5, 'Dịch vụ chuẩn mực 5 sao, mỳ Ý cua tuyết sốt nấm Truffle thơm ngậy, không gian thưởng thức âm nhạc acoustic rất thư thái.', 'Mỳ Ý Cua Tuyết Sốt Kem', 'img/customers/customer-1.jpg'),
    ]

    cursor.executemany('''
        INSERT OR IGNORE INTO reviews 
        (customer_name, rating, comment, dish_name, avatar_url)
        VALUES (?, ?, ?, ?, ?)
    ''', reviews)

    # 4. Seed Contacts
    contacts = [
        ('Lê Anh Tuấn', '0915667788', 'tuan.le@fpt.com', 'Tổ chức tiệc tất niên công ty 30 khách', 
         'Chào nhà hàng, công ty chúng tôi muốn đặt tiệc riêng tầng 7 vào thứ 6 tới cho khoảng 30 người, vui lòng gửi báo giá thực đơn combo.'),
        ('Nguyễn Mai Phương', '0943221100', 'maiphuong@gmail.com', 'Tư vấn tiệc kỷ niệm đính hôn', 
         'Mình muốn đặt bàn nến hoa lãng mạn kèm hỗ trợ chiếu clip kỷ niệm trên màn chiếu của nhà hàng.'),
    ]

    cursor.executemany('''
        INSERT OR IGNORE INTO contacts 
        (name, phone, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
    ''', contacts)

    conn.commit()
    conn.close()
    print("Database seeded with sample data successfully!")

if __name__ == '__main__':
    seed_all()
