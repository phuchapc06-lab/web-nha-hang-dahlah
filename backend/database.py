# -*- coding: utf-8 -*-
"""
Database Management & Connection Helper
Kron-Dahlah Steakhouse & Western Dining Backend
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kron_dahlah.db')
SCHEMA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'schema.sql')

def get_db():
    """Tạo kết nối tới SQLite và trả về con trỏ với hàng dữ liệu dạng Dictionary"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Khởi tạo cấu trúc các bảng theo schema.sql nếu chưa tồn tại"""
    conn = get_db()
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

if __name__ == '__main__':
    init_db()
