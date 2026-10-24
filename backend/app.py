# -*- coding: utf-8 -*-
"""
==============================================================================
KRON-DAHLAH STEAKHOUSE & WESTERN DINING - BACKEND API SERVER
Môn học: Quản lý dự án CNTT - Đại học Kinh tế Quốc dân (NEU)
Framework: Flask (Python 3) + SQLite 3 + Flask-CORS
==============================================================================
"""

import os
import random
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from database import get_db, init_db

# Xác định đường dẫn thư mục gốc và thư mục web
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_ROOT_DIR = os.path.abspath(os.path.join(BACKEND_DIR, '..'))

app = Flask(__name__, static_folder=WEB_ROOT_DIR)
# Kích hoạt CORS cho mọi domain (tiện lợi cho việc gọi API từ Live Server hoặc client khác)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ==============================================================================
# 0. PHỤC VỤ GIAO DIỆN WEB & ADMIN DASHBOARD
# ==============================================================================

@app.route('/')
def serve_home():
    """Phục vụ trang chủ website nhà hàng Kron-Dahlah"""
    return send_from_directory(WEB_ROOT_DIR, 'index.html')

@app.route('/admin')
def serve_admin():
    """Phục vụ giao diện Quản trị viên (Admin Dashboard)"""
    admin_index = os.path.join(BACKEND_DIR, 'admin', 'index.html')
    if os.path.exists(admin_index):
        return send_file(admin_index)
    return jsonify({"error": "Admin dashboard template not found"}), 404

@app.route('/<path:filename>')
def serve_static(filename):
    """Phục vụ các tài nguyên tĩnh css, js, img"""
    return send_from_directory(WEB_ROOT_DIR, filename)


# ==============================================================================
# 1. MODULE ĐẶT BÀN (TABLE RESERVATIONS)
# ==============================================================================

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """
    Lấy danh sách các đơn đặt bàn
    Hỗ trợ Query Params:
      - status: pending, confirmed, completed, cancelled
      - date: YYYY-MM-DD
      - search: tìm kiếm theo tên hoặc SĐT
    """
    status = request.args.get('status')
    date = request.args.get('date')
    search = request.args.get('search')

    query = "SELECT * FROM bookings WHERE 1=1"
    params = []

    if status and status != 'all':
        query += " AND status = ?"
        params.append(status)
    if date:
        query += " AND booking_date = ?"
        params.append(date)
    if search:
        query += " AND (customer_name LIKE ? OR phone LIKE ? OR booking_code LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    query += " ORDER BY booking_date DESC, booking_time ASC, id DESC"

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    bookings = [dict(row) for row in rows]
    return jsonify({
        "success": True,
        "count": len(bookings),
        "data": bookings
    })

@app.route('/api/bookings/<id_or_code>', methods=['GET'])
def get_booking_detail(id_or_code):
    """Tra cứu chi tiết đơn đặt bàn theo ID hoặc mã KD-xxxx"""
    conn = get_db()
    cursor = conn.cursor()
    
    if id_or_code.isdigit():
        cursor.execute("SELECT * FROM bookings WHERE id = ?", (int(id_or_code),))
    else:
        cursor.execute("SELECT * FROM bookings WHERE booking_code = ?", (id_or_code.upper(),))
        
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify({"success": True, "data": dict(row)})
    return jsonify({"success": False, "message": "Không tìm thấy đơn đặt bàn"}), 404

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """
    Tiếp nhận đơn đặt bàn mới từ website
    Tự động sinh mã tra cứu KD-xxxx và tính giá ước tính
    """
    data = request.get_json() or request.form.to_dict()
    if not data:
        return jsonify({"success": False, "message": "Dữ liệu không hợp lệ"}), 400

    name = data.get('name') or data.get('customer_name')
    phone = data.get('phone')
    date = data.get('date') or data.get('booking_date')
    time = data.get('time') or data.get('booking_time')
    guests = data.get('guests', '2 người (Cặp đôi)')
    location = data.get('location', 'Bàn nến hoa hẹn hò cặp đôi (Lãng mạn)')
    set_menu = data.get('setMenu') or data.get('set_menu', 'Chưa chọn (Gọi món tại bàn)')
    notes = data.get('notes', '')

    if not name or not phone or not date or not time:
        return jsonify({"success": False, "message": "Vui lòng điền đầy đủ Tên, SĐT, Ngày và Giờ đặt bàn"}), 400

    # Tự động sinh mã đặt bàn ngẫu nhiên KD-xxxx không trùng
    conn = get_db()
    cursor = conn.cursor()
    
    while True:
        code = f"KD-{random.randint(1000, 9999)}"
        cursor.execute("SELECT id FROM bookings WHERE booking_code = ?", (code,))
        if not cursor.fetchone():
            break

    # Tính toán doanh thu ước tính theo Set Menu
    estimated_price = 0
    if 'Romance' in set_menu or '990.000' in set_menu:
        estimated_price = 990000
    elif 'Royal' in set_menu or '2.490.000' in set_menu:
        estimated_price = 2490000
    else:
        # Ước tính 350.000đ/khách nếu gọi món
        guest_count = 2
        for char in guests:
            if char.isdigit():
                guest_count = int(char)
                break
        estimated_price = guest_count * 350000

    cursor.execute('''
        INSERT INTO bookings 
        (booking_code, customer_name, phone, location, guests, booking_date, booking_time, set_menu, notes, status, estimated_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    ''', (code, name, phone, location, guests, date, time, set_menu, notes, estimated_price))

    booking_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Đặt bàn thành công! Nhân viên Kron-Dahlah sẽ liên hệ lại trong 5 phút.",
        "data": {
            "id": booking_id,
            "booking_code": code,
            "customer_name": name,
            "phone": phone,
            "location": location,
            "guests": guests,
            "booking_date": date,
            "booking_time": time,
            "set_menu": set_menu,
            "notes": notes,
            "status": "pending",
            "estimated_price": estimated_price
        }
    }), 201

@app.route('/api/bookings/<int:booking_id>/status', methods=['PATCH'])
def update_booking_status(booking_id):
    """Cập nhật trạng thái đơn đặt bàn: pending, confirmed, completed, cancelled"""
    data = request.get_json() or {}
    new_status = data.get('status')
    valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']

    if new_status not in valid_statuses:
        return jsonify({"success": False, "message": f"Trạng thái không hợp lệ. Chỉ chấp nhận: {valid_statuses}"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE bookings SET status = ? WHERE id = ?", (new_status, booking_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()

    if affected:
        return jsonify({"success": True, "message": f"Đã chuyển trạng thái đơn sang '{new_status}'"})
    return jsonify({"success": False, "message": "Không tìm thấy đơn đặt bàn"}), 404

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    """Xóa đơn đặt bàn khỏi CSDL"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bookings WHERE id = ?", (booking_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()

    if affected:
        return jsonify({"success": True, "message": "Đã xóa đơn đặt bàn"})
    return jsonify({"success": False, "message": "Không tìm thấy đơn đặt bàn"}), 404


# ==============================================================================
# 2. MODULE THỰC ĐƠN (MENU MANAGEMENT)
# ==============================================================================

@app.route('/api/menu', methods=['GET'])
def get_menu():
    """Lấy danh sách món ăn, hỗ trợ lọc theo category (steak, starter, pasta...)"""
    category = request.args.get('category')
    only_available = request.args.get('available', default=1, type=int)

    query = "SELECT * FROM menu_items WHERE 1=1"
    params = []

    if category and category != 'all':
        query += " AND category = ?"
        params.append(category)
    if only_available:
        query += " AND is_available = 1"

    query += " ORDER BY is_signature DESC, price ASC"

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    items = [dict(row) for row in rows]
    return jsonify({"success": True, "count": len(items), "data": items})

@app.route('/api/menu', methods=['POST'])
def add_menu_item():
    """Thêm món ăn mới vào thực đơn"""
    data = request.get_json() or {}
    name = data.get('name')
    category = data.get('category', 'steak')
    price = data.get('price', 0)
    description = data.get('description', '')
    image_url = data.get('image_url', 'img/dishes/steak_wagyu.jpg')
    is_signature = 1 if data.get('is_signature') else 0
    code = data.get('code') or f"MN-{random.randint(100, 999)}"

    if not name or not price:
        return jsonify({"success": False, "message": "Vui lòng nhập tên món và giá niêm yết"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO menu_items 
            (code, name, category, price, description, image_url, is_signature, is_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        ''', (code, name, category, price, description, image_url, is_signature))
        item_id = cursor.lastrowid
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"success": False, "message": f"Lỗi tạo món: {str(e)}"}), 400
    conn.close()

    return jsonify({"success": True, "message": "Đã thêm món mới vào thực đơn", "id": item_id}), 201

@app.route('/api/menu/<int:item_id>/toggle-availability', methods=['PATCH'])
def toggle_menu_availability(item_id):
    """Bật / tắt trạng thái Còn món - Hết món"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE menu_items SET is_available = CASE WHEN is_available = 1 THEN 0 ELSE 1 END WHERE id = ?", (item_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()

    if affected:
        return jsonify({"success": True, "message": "Đã cập nhật trạng thái món ăn"})
    return jsonify({"success": False, "message": "Không tìm thấy món ăn"}), 404

@app.route('/api/menu/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    """Xóa món khỏi thực đơn"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM menu_items WHERE id = ?", (item_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()

    if affected:
        return jsonify({"success": True, "message": "Đã xóa món ăn khỏi thực đơn"})
    return jsonify({"success": False, "message": "Không tìm thấy món ăn"}), 404


# ==============================================================================
# 3. MODULE ĐÁNH GIÁ & FEEDBACK (REVIEWS)
# ==============================================================================

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    """Lấy danh sách đánh giá của thực khách đã duyệt"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reviews WHERE is_approved = 1 ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    reviews = [dict(row) for row in rows]
    return jsonify({"success": True, "count": len(reviews), "data": reviews})

@app.route('/api/reviews', methods=['POST'])
def add_review():
    """Khách gửi đánh giá món ăn và dịch vụ"""
    data = request.get_json() or {}
    name = data.get('customer_name')
    rating = int(data.get('rating', 5))
    comment = data.get('comment')
    dish = data.get('dish_name', 'Bít tết Bò Wagyu')
    avatar = data.get('avatar_url', 'img/customers/customer-1.jpg')

    if not name or not comment:
        return jsonify({"success": False, "message": "Vui lòng nhập tên và nội dung đánh giá"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO reviews (customer_name, rating, comment, dish_name, avatar_url, is_approved)
        VALUES (?, ?, ?, ?, ?, 1)
    ''', (name, rating, comment, dish, avatar))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Cảm ơn bạn đã gửi đánh giá cho Kron-Dahlah!"}), 201


# ==============================================================================
# 4. MODULE LIÊN HỆ & CSKH (CONTACTS)
# ==============================================================================

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    """Admin xem danh sách tin nhắn liên hệ"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contacts ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify({"success": True, "data": [dict(r) for r in rows]})

@app.route('/api/contacts', methods=['POST'])
def add_contact():
    """Khách gửi biểu mẫu liên hệ / thắc mắc"""
    data = request.get_json() or {}
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email', '')
    subject = data.get('subject', 'Tư vấn tiệc')
    message = data.get('message')

    if not name or not phone or not message:
        return jsonify({"success": False, "message": "Vui lòng nhập Tên, SĐT và nội dung tin nhắn"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO contacts (name, phone, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, phone, email, subject, message))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Kron-Dahlah đã nhận được tin nhắn và sẽ phản hồi sớm nhất!"}), 201


# ==============================================================================
# 5. ADMIN STATS & KPI DASHBOARD
# ==============================================================================

@app.route('/api/stats', methods=['GET'])
def get_dashboard_stats():
    """Tổng hợp chỉ số KPI kinh doanh cho Admin"""
    today_str = datetime.now().strftime('%Y-%m-%d')
    conn = get_db()
    cursor = conn.cursor()

    # Tổng số đơn
    cursor.execute("SELECT count(*) FROM bookings")
    total_bookings = cursor.fetchone()[0]

    # Đơn hôm nay
    cursor.execute("SELECT count(*) FROM bookings WHERE booking_date = ?", (today_str,))
    today_bookings = cursor.fetchone()[0]

    # Đơn chờ xác nhận (Cần nhân viên gọi ngay)
    cursor.execute("SELECT count(*) FROM bookings WHERE status = 'pending'")
    pending_bookings = cursor.fetchone()[0]

    # Đơn đã xác nhận
    cursor.execute("SELECT count(*) FROM bookings WHERE status = 'confirmed'")
    confirmed_bookings = cursor.fetchone()[0]

    # Doanh thu ước tính từ các đơn confirmed hoặc completed
    cursor.execute("SELECT sum(estimated_price) FROM bookings WHERE status IN ('confirmed', 'completed')")
    rev = cursor.fetchone()[0]
    total_revenue = rev if rev else 0

    # Phân bố theo khung giờ
    cursor.execute("SELECT booking_time, count(*) as count FROM bookings GROUP BY booking_time ORDER BY count DESC")
    time_distribution = [{"time": r['booking_time'], "count": r['count']} for r in cursor.fetchall()]

    conn.close()

    return jsonify({
        "success": True,
        "data": {
            "total_bookings": total_bookings,
            "today_bookings": today_bookings,
            "pending_bookings": pending_bookings,
            "confirmed_bookings": confirmed_bookings,
            "total_revenue": total_revenue,
            "time_distribution": time_distribution,
            "today_date": today_str
        }
    })

# ==============================================================================
# KHỞI CHẠY SERVER
# ==============================================================================

if __name__ == '__main__':
    # Khởi tạo DB nếu chưa có
    init_db()
    print("=" * 60)
    print(" KRON-DAHLAH STEAKHOUSE BACKEND IS RUNNING!")
    print(" -> Website:         http://127.0.0.1:5000/")
    print(" -> Admin Dashboard: http://127.0.0.1:5000/admin")
    print(" -> RESTful API:     http://127.0.0.1:5000/api/bookings")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
