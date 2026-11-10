import sqlite3
import os
import json
import hashlib
import time
from datetime import datetime

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'earthglaze.db'))

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def init_db():
    conn = get_connection()
    c = conn.cursor()

    # 1. Users
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        address TEXT,
        city TEXT,
        state TEXT,
        pincode TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 2. Categories
    c.execute('''
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT
    )
    ''')

    # 3. Products
    c.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        sale_price REAL NOT NULL,
        original_price REAL,
        weight TEXT,
        sku TEXT,
        stock_qty INTEGER NOT NULL DEFAULT 50,
        is_featured INTEGER DEFAULT 1,
        is_new INTEGER DEFAULT 0,
        rating REAL DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        tagline TEXT,
        description TEXT,
        benefits TEXT,
        ingredients TEXT,
        how_to_use TEXT,
        image_closed TEXT,
        image_open TEXT,
        image_photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 4. Product Images Gallery
    c.execute('''
    CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
    ''')

    # 5. Orders
    c.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        shipping_address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL,
        subtotal REAL NOT NULL,
        discount REAL DEFAULT 0,
        coupon_code TEXT,
        shipping_fee REAL DEFAULT 0,
        total_amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        payment_status TEXT NOT NULL,
        order_status TEXT NOT NULL,
        tracking_number TEXT,
        delivery_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 6. Order Items
    c.execute('''
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        total REAL NOT NULL,
        image_url TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
    ''')

    # 7. Order Tracking Stages
    c.execute('''
    CREATE TABLE IF NOT EXISTS order_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        stage TEXT NOT NULL,
        title TEXT NOT NULL,
        status_time TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
    ''')

    # 8. Coupons
    c.execute('''
    CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        min_order_value REAL DEFAULT 0,
        usage_limit INTEGER DEFAULT 100,
        times_used INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
    )
    ''')

    # 9. Customer Reviews
    c.execute('''
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        review_text TEXT NOT NULL,
        verified_buyer INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 10. Blog Posts
    c.execute('''
    CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT DEFAULT 'EarthGlaze Botanical Team',
        excerpt TEXT,
        content TEXT,
        image_url TEXT,
        read_time TEXT,
        published_at TEXT,
        is_published INTEGER DEFAULT 1
    )
    ''')

    # 11. Ingredients Showcase
    c.execute('''
    CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        tagline TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        associated_product_id TEXT
    )
    ''')

    # 12. Contact Enquiries
    c.execute('''
    CREATE TABLE IF NOT EXISTS contact_enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 13. Customer Wishlist
    c.execute('''
    CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
    )
    ''')

    conn.commit()
    seed_initial_data(conn)
    conn.close()
    print("Database initialized successfully at", DB_PATH)

def seed_initial_data(conn):
    c = conn.cursor()

    # 1. Seed Categories
    c.execute('SELECT COUNT(*) FROM categories')
    if c.fetchone()[0] == 0:
        categories = [
            ('soaps', 'Artisan Soaps', 'Cold-processed Ayurvedic soaps made with fresh botanicals and pure oils.'),
            ('lip-care', 'Lip Care', 'Intense natural hydration and gentle botanical tint for healthy lips.')
        ]
        c.executemany('INSERT INTO categories (slug, name, description) VALUES (?, ?, ?)', categories)

    # 2. Seed 4 Genuine Products
    c.execute('SELECT COUNT(*) FROM products')
    if c.fetchone()[0] == 0:
        products = [
            (
                'manjistha-soap',
                'manjistha-soap',
                'Manjistha Soap',
                'Soaps',
                149.0,
                149.0,
                199.0,
                '100 g',
                'EG-SOAP-MANJ',
                50,
                1,
                0,
                4.9,
                428,
                'Purifies skin, helps reduce blemishes and gives a natural glow.',
                'A traditional Ayurvedic cleansing bar crafted with pure wild Manjistha (Rubia cordifolia), red sandalwood, and nourishing cold-pressed coconut oil. Naturally detoxifies the skin, diminishes uneven tone, and restores youthful radiance without stripping moisture.',
                'Fades hyperpigmentation, purifies acne-prone skin, imparts an authentic herbal glow, and maintains dermal pH balance.',
                'Wild Manjistha (Rubia Cordifolia) Root Extract, Pure Cold-Pressed Coconut Oil, Mahua Oil, Red Sandalwood Extract, Castor Oil, Botanical Lye.',
                'Work into a rich creamy lather with warm water. Gently massage over damp face and body in circular motions. Rinse thoroughly and pat dry with a soft towel.',
                'assets/manjistha_closed_box.png',
                'assets/manjistha_open_box.png',
                'assets/bestseller_manjistha_photo_hd.png'
            ),
            (
                'goat-milk-soap',
                'goat-milk-soap',
                'Goat Milk Soap',
                'Soaps',
                149.0,
                149.0,
                199.0,
                '100 g',
                'EG-SOAP-GOAT',
                65,
                1,
                0,
                5.0,
                512,
                'Creamy Moisture Bar with Pure Goat Milk & Shea Butter.',
                'An ultra-hydrating, gentle cleanser infused with farm-fresh whole goat milk, rich raw shea butter, and sweet almond oil. Packed with lactic acid, natural vitamins A, B, and D to calm sensitivity, relieve dryness, and leave the skin silky soft.',
                'Deep lasting cellular moisturization, non-irritating formula ideal for sensitive and eczema-prone skin, gently removes dead cells with natural lactic acid.',
                'Fresh Farm Goat Milk, Raw Organic Shea Butter, Sweet Almond Oil, Virgin Olive Oil, Pure Coconut Oil, Distilled Water, Essential Botanicals.',
                'Lather between palms with lukewarm water. Massage the velvety lather generously over face and body. Allow nutrients to absorb for 30 seconds before rinsing.',
                'assets/goatmilksoap_close_box.png',
                'assets/goatmilksoap_open_box.png',
                'assets/bestseller_goat_photo_hd.png'
            ),
            (
                'neem-soap',
                'neem-soap',
                'Neem Soap',
                'Soaps',
                149.0,
                149.0,
                199.0,
                '100 g',
                'EG-SOAP-NEEM',
                40,
                1,
                0,
                4.8,
                320,
                'Purifying Botanical Neem Cleansing with Tea Tree & Holy Basil.',
                'Formulated with organic fresh Neem leaf paste, therapeutic tea tree oil, and sacred Tulsi (Holy Basil). Provides powerful antibacterial protection to keep breakouts at bay, soothe heat rashes, and clarify congested pores.',
                'Combats acne-causing bacteria, balances sebum secretion, calms redness, and protects against daily environmental pollutants.',
                'Organic Neem (Azadirachta Indica) Leaf Extract, Pure Tea Tree Essential Oil, Holy Basil (Tulsi) Oil, Cold-Pressed Neem Seed Oil, Extra Virgin Coconut Oil.',
                'Apply to wet skin, building a soothing herbal foam. Pay special attention to breakout-prone zones. Rinse cleanly with water.',
                'assets/neem_soap_closed_box.png',
                'assets/neemopenbox.png',
                'assets/bestseller_aloe_soap_photo_hd.png'
            ),
            (
                'beetroot-lip-balm',
                'beetroot-lip-balm',
                'Beet Root Lip Balm',
                'Lip Care',
                199.0,
                199.0,
                249.0,
                '10 g',
                'EG-LIP-BEET',
                80,
                1,
                1,
                4.9,
                384,
                'Keeps lips soft, smooth and naturally tinted with organic beetroot.',
                'A luscious, velvety lip butter made with slow-infused fresh organic beetroot extract, unrefined golden beeswax, shea butter, and sweet almond oil. Delivers all-day deep hydration and imparts a subtle, healthy ruby-pink sheen.',
                'Prevents chapping and flaking, locks in moisture for 12+ hours, adds a natural radiant rosy tint without artificial synthetic dyes or petro-chemicals.',
                'Fresh Beetroot Juice Extract, Golden Natural Beeswax, Pure Shea Butter, Sweet Almond Oil, Vitamin E (Tocopherol), Rose Essential Oil.',
                'Glide gently onto lips with a clean fingertip whenever lips feel dry or before stepping out for a healthy natural rosy tint.',
                'assets/lip_balm_closed_box.png',
                'assets/lipbalmopenbox.png',
                'assets/bestseller_balm_photo_hd.png'
            )
        ]
        c.executemany('''
        INSERT INTO products (
            id, slug, name, category, price, sale_price, original_price, weight, sku,
            stock_qty, is_featured, is_new, rating, review_count, tagline, description,
            benefits, ingredients, how_to_use, image_closed, image_open, image_photo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', products)

    # 3. Seed Default Admin & Customer User
    c.execute('SELECT COUNT(*) FROM users')
    if c.fetchone()[0] == 0:
        users = [
            ('Admin EarthGlaze', 'admin@earthglaze.in', '+91 98765 43210', hash_password('EarthGlaze@2026'), 'admin', 'Headquarters, Green Park', 'Mangalore', 'Karnataka', '575001'),
            ('Ayesha N.', 'ayesha@example.com', '+91 98765 43210', hash_password('Ayesha@123'), 'customer', 'Deralakatte', 'Mangalore', 'Karnataka', '575018')
        ]
        c.executemany('''
        INSERT INTO users (name, email, phone, password_hash, role, address, city, state, pincode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', users)

    # 4. Seed Reference Orders (#EG48273, #EG47190, #EG46922)
    c.execute('SELECT COUNT(*) FROM orders')
    if c.fetchone()[0] == 0:
        orders = [
            (
                'EG48273',
                2,
                'Ayesha N.',
                'ayesha@example.com',
                '+91 98765 43210',
                'Deralakatte, Near University Campus',
                'Mangalore',
                'Karnataka',
                '575018',
                348.0,
                0.0,
                '',
                0.0,
                348.0,
                'Online (UPI)',
                'paid',
                'processing',
                'DTDC-9928174'
            ),
            (
                'EG47190',
                2,
                'Rizwan K.',
                'rizwan@example.com',
                '+91 98123 45678',
                'Bendoorwell, Hillside Road',
                'Mangalore',
                'Karnataka',
                '575002',
                199.0,
                0.0,
                '',
                0.0,
                199.0,
                'Cash on Delivery',
                'paid',
                'delivered',
                'BLUEDART-8812301'
            ),
            (
                'EG46922',
                2,
                'Hiba S.',
                'hiba@example.com',
                '+91 97456 78901',
                'Kadri Hills, Green Avenue',
                'Mangalore',
                'Karnataka',
                '575003',
                149.0,
                0.0,
                '',
                0.0,
                149.0,
                'Online (Cards)',
                'paid',
                'delivered',
                'DELHIVERY-7744192'
            )
        ]
        for ord_data in orders:
            c.execute('''
            INSERT INTO orders (
                order_number, user_id, customer_name, customer_email, customer_phone,
                shipping_address, city, state, pincode, subtotal, discount, coupon_code,
                shipping_fee, total_amount, payment_method, payment_status, order_status, tracking_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', ord_data)
            ord_id = c.lastrowid

            if ord_data[0] == 'EG48273':
                # Order 1: Manjistha Soap + Lip Balm = 149 + 199 = 348
                c.execute('''
                INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (ord_id, 'manjistha-soap', 'Manjistha Soap', 149.0, 1, 149.0, 'assets/bestseller_manjistha_photo_hd.png'))
                c.execute('''
                INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (ord_id, 'beetroot-lip-balm', 'Beet Root Lip Balm', 199.0, 1, 199.0, 'assets/bestseller_balm_photo_hd.png'))

                # Tracking timeline
                c.execute('INSERT INTO order_tracking (order_id, stage, title, status_time, is_completed) VALUES (?, ?, ?, ?, ?)', (ord_id, 'confirmed', 'Order Confirmed', '12 Oct, 10:24 AM', 1))
                c.execute('INSERT INTO order_tracking (order_id, stage, title, status_time, is_completed) VALUES (?, ?, ?, ?, ?)', (ord_id, 'packed', 'Packed at Mangalore Facility', '12 Oct, 2:15 PM', 1))
                c.execute('INSERT INTO order_tracking (order_id, stage, title, status_time, is_completed) VALUES (?, ?, ?, ?, ?)', (ord_id, 'out_for_delivery', 'Out for Delivery', '13 Oct, 9:40 AM', 1))
                c.execute('INSERT INTO order_tracking (order_id, stage, title, status_time, is_completed) VALUES (?, ?, ?, ?, ?)', (ord_id, 'delivered', 'Delivered (Expected)', '13 Oct, 6:00 PM', 0))

            elif ord_data[0] == 'EG47190':
                c.execute('''
                INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (ord_id, 'beetroot-lip-balm', 'Beet Root Lip Balm', 199.0, 1, 199.0, 'assets/bestseller_balm_photo_hd.png'))
                c.execute('INSERT INTO order_tracking (order_id, stage, title, status_time, is_completed) VALUES (?, ?, ?, ?, ?)', (ord_id, 'delivered', 'Delivered Successfully', '10 Oct, 4:30 PM', 1))

            elif ord_data[0] == 'EG46922':
                c.execute('''
                INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (ord_id, 'goat-milk-soap', 'Goat Milk Soap', 149.0, 1, 149.0, 'assets/bestseller_goat_photo_hd.png'))
                c.execute('INSERT INTO order_tracking (order_id, stage, title, status_time, is_completed) VALUES (?, ?, ?, ?, ?)', (ord_id, 'delivered', 'Delivered Successfully', '08 Oct, 2:15 PM', 1))

    # 5. Seed Coupons
    c.execute('SELECT COUNT(*) FROM coupons')
    if c.fetchone()[0] == 0:
        coupons = [
            ('WELCOME10', 'percentage', 10.0, 200.0, 500, 14, 1),
            ('GLAZE15', 'percentage', 15.0, 400.0, 200, 28, 1),
            ('EARTH50', 'fixed', 50.0, 300.0, 100, 42, 1)
        ]
        c.executemany('''
        INSERT INTO coupons (code, discount_type, discount_value, min_order_value, usage_limit, times_used, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', coupons)

    # 6. Seed Blog Posts matching the Portfolio Reference
    c.execute('SELECT COUNT(*) FROM blog_posts')
    if c.fetchone()[0] == 0:
        blogs = [
            (
                'benefits-of-manjistha-for-clearer-skin',
                'Benefits of Manjistha for Clearer Skin',
                'Herbal Care',
                'Dr. Ananya Rao',
                'Discover how the ancient Ayurvedic root Manjistha naturally purifies blood, fades blemishes, and gives an even radiant tone.',
                'Manjistha (Rubia cordifolia) is hailed in ancient Ayurvedic texts as one of the most potent blood-purifying herbs. Unlike aggressive synthetic peels, Manjistha gently clears stagnant heat, reduces hormonal breakout tendencies, and speeds up cellular recovery. In our artisan cold-processed bar, we preserve its delicate phytochemicals through temperature-controlled curing.',
                'assets/hero_natural_stage_backdrop.jpg',
                '5 min read',
                '12 Oct 2024',
                1
            ),
            (
                'why-goat-milk-is-good-for-your-skin',
                'Why Goat Milk is Good for Your Skin',
                'Deep Moisture',
                'Meera Sen',
                'Farm-fresh goat milk possesses the exact pH of healthy human skin, loaded with gentle lactic acid and bio-available vitamins.',
                'If your skin feels tight or parched after showering, conventional sulfate bars have stripped your natural lipid barrier. Raw goat milk is brimming with natural caprylic triglycerides that penetrate deeply, providing hydration that lasts throughout the day while gentle lactic acid sloughs away dull flaky skin.',
                'assets/about-img.png',
                '6 min read',
                '5 Oct 2024',
                1
            ),
            (
                'natural-lip-care-with-beetroot',
                'Natural Lip Care with Beetroot',
                'Lip Care Rituals',
                'Rhea Pillai',
                'Ditch chemical petroleum petroleum jellies. Nourish your lips with antioxidant betalains and rich almond butter.',
                'The delicate skin on your lips has no sebaceous oil glands, making it vulnerable to weather, pollution, and dehydration. Fresh beetroot infusion infuses lips with vital vitamins C and E, giving an authentic rosy flush while pure beeswax seals in hydration for uninterrupted comfort.',
                'assets/combo-offer.png',
                '4 min read',
                '28 Sep 2024',
                1
            )
        ]
        c.executemany('''
        INSERT INTO blog_posts (slug, title, category, author, excerpt, content, image_url, read_time, published_at, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', blogs)

    # 7. Seed Ingredients matching Portfolio Reference
    c.execute('SELECT COUNT(*) FROM ingredients')
    if c.fetchone()[0] == 0:
        ingredients_data = [
            ('Manjistha', 'Purifies & Brightens', 'Wild-harvested Himalayan root that clarifies blemishes and evens skin tone naturally.', 'assets/bestseller_manjistha_photo_hd.png', 'manjistha-soap'),
            ('Goat Milk', 'Nourishes & Softens', 'Rich in natural lactic acid, vitamins A and D for supreme cellular barrier replenishment.', 'assets/bestseller_goat_photo_hd.png', 'goat-milk-soap'),
            ('Neem', 'Cleanses & Protects', 'Time-tested botanical antibacterial that balances oiliness and purifies clogged pores.', 'assets/bestseller_aloe_soap_photo_hd.png', 'neem-soap'),
            ('Beetroot', 'Hydrates & Adds Natural Tint', 'Potent antioxidant betalains provide all-day softness and a natural ruby-rose tint.', 'assets/bestseller_balm_photo_hd.png', 'beetroot-lip-balm')
        ]
        c.executemany('''
        INSERT INTO ingredients (name, tagline, description, image_url, associated_product_id)
        VALUES (?, ?, ?, ?, ?)
        ''', ingredients_data)

    conn.commit()

if __name__ == '__main__':
    init_db()
