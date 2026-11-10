<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTracking;
use App\Models\Payment;
use App\Models\Review;
use App\Models\BlogPost;
use App\Models\ContactMessage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@earthglaze.in'],
            [
                'name' => 'EarthGlaze Admin',
                'phone' => '+91 98765 43210',
                'role' => 'admin',
                'password' => Hash::make('EarthGlaze@2026'),
                'address' => 'Headquarters, Green Park',
                'city' => 'Mangalore',
                'state' => 'Karnataka',
                'pincode' => '575001',
                'email_verified_at' => now(),
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'ayesha@example.com'],
            [
                'name' => 'Ayesha N.',
                'phone' => '+91 98765 43210',
                'role' => 'customer',
                'password' => Hash::make('Ayesha@123'),
                'address' => 'Deralakatte, Near University Campus',
                'city' => 'Mangalore',
                'state' => 'Karnataka',
                'pincode' => '575018',
                'email_verified_at' => now(),
            ]
        );

        // 2. Categories
        $soapsCat = Category::firstOrCreate(
            ['slug' => 'soaps'],
            [
                'name' => 'Artisan Soaps',
                'description' => 'Cold-processed Ayurvedic soaps crafted with fresh botanicals and pure unrefined oils.',
                'image_url' => '/assets/bestseller_manjistha_photo_hd.png',
                'is_active' => true,
            ]
        );

        $lipCat = Category::firstOrCreate(
            ['slug' => 'lip-care'],
            [
                'name' => 'Lip Care',
                'description' => 'Intense natural hydration and gentle botanical tint for radiant, supple lips.',
                'image_url' => '/assets/bestseller_balm_photo_hd.png',
                'is_active' => true,
            ]
        );

        // 3. Products (EXACTLY 3 AVAILABLE PRODUCTS)
        $manjistha = Product::firstOrCreate(
            ['sku' => 'EG-SOAP-MANJ'],
            [
                'name' => 'Manjistha Soap',
                'slug' => 'manjistha-soap',
                'category_id' => $soapsCat->id,
                'category_name' => 'Soaps',
                'price' => 349.00,
                'sale_price' => 349.00,
                'original_price' => 399.00,
                'weight' => '100 g',
                'stock_qty' => 50,
                'rating' => 4.9,
                'review_count' => 428,
                'tagline' => 'Purifies skin, helps reduce blemishes and gives a natural glow.',
                'description' => 'A traditional Ayurvedic cleansing bar crafted with pure wild Manjistha (Rubia cordifolia), red sandalwood, and nourishing cold-pressed coconut oil. Naturally detoxifies the skin, diminishes uneven tone, and restores youthful radiance without stripping moisture.',
                'benefits' => 'Fades hyperpigmentation, purifies acne-prone skin, imparts an authentic herbal glow, and maintains dermal pH balance.',
                'ingredients' => 'Wild Manjistha (Rubia Cordifolia) Root Extract, Pure Cold-Pressed Coconut Oil, Mahua Oil, Red Sandalwood Extract, Castor Oil, Botanical Lye.',
                'how_to_use' => 'Work into a rich creamy lather with warm water. Gently massage over damp face and body in circular motions. Rinse thoroughly and pat dry with a soft towel.',
                'image_closed' => '/assets/manjistha_closed_box.png',
                'image_open' => '/assets/manjistha_open_box.png',
                'image_photo' => '/assets/bestseller_manjistha_photo_hd.png',
                'is_featured' => true,
                'is_new' => false,
                'is_active' => true,
            ]
        );

        $goatMilk = Product::firstOrCreate(
            ['sku' => 'EG-SOAP-GOAT'],
            [
                'name' => 'Goat Milk Soap',
                'slug' => 'goat-milk-soap',
                'category_id' => $soapsCat->id,
                'category_name' => 'Soaps',
                'price' => 349.00,
                'sale_price' => 349.00,
                'original_price' => 399.00,
                'weight' => '100 g',
                'stock_qty' => 65,
                'rating' => 5.0,
                'review_count' => 512,
                'tagline' => 'Creamy Moisture Bar with Pure Goat Milk & Shea Butter.',
                'description' => 'An ultra-hydrating, gentle cleanser infused with farm-fresh whole goat milk, rich raw shea butter, and sweet almond oil. Packed with lactic acid, natural vitamins A, B, and D to calm sensitivity, relieve dryness, and leave the skin silky soft.',
                'benefits' => 'Deep lasting cellular moisturization, non-irritating formula ideal for sensitive and eczema-prone skin, gently removes dead cells with natural lactic acid.',
                'ingredients' => 'Fresh Farm Goat Milk, Raw Organic Shea Butter, Sweet Almond Oil, Virgin Olive Oil, Pure Coconut Oil, Distilled Water, Essential Botanicals.',
                'how_to_use' => 'Lather between palms with lukewarm water. Massage the velvety lather generously over face and body. Allow nutrients to absorb for 30 seconds before rinsing.',
                'image_closed' => '/assets/goatmilksoap_close_box.png',
                'image_open' => '/assets/goatmilksoap_open_box.png',
                'image_photo' => '/assets/bestseller_goat_photo_hd.png',
                'is_featured' => true,
                'is_new' => false,
                'is_active' => true,
            ]
        );

        $beetroot = Product::firstOrCreate(
            ['sku' => 'EG-BALM-BEET'],
            [
                'name' => 'Beet Root Lip Balm',
                'slug' => 'beetroot-lip-balm',
                'category_id' => $lipCat->id,
                'category_name' => 'Lip Care',
                'price' => 249.00,
                'sale_price' => 249.00,
                'original_price' => 299.00,
                'weight' => '10 g',
                'stock_qty' => 80,
                'rating' => 4.9,
                'review_count' => 384,
                'tagline' => 'Keeps lips soft, smooth and naturally tinted with organic beetroot.',
                'description' => 'A luscious, velvety lip butter made with slow-infused fresh organic beetroot extract, unrefined golden beeswax, shea butter, and sweet almond oil. Delivers all-day deep hydration and imparts a subtle, healthy ruby-pink sheen.',
                'benefits' => 'Prevents chapping and flaking, locks in moisture for 12+ hours, adds a natural radiant rosy tint without artificial synthetic dyes or petro-chemicals.',
                'ingredients' => 'Fresh Beetroot Juice Extract, Golden Natural Beeswax, Pure Shea Butter, Sweet Almond Oil, Vitamin E (Tocopherol), Rose Essential Oil.',
                'how_to_use' => 'Glide gently onto lips with a clean fingertip whenever lips feel dry or before stepping out for a healthy natural rosy tint.',
                'image_closed' => '/assets/lip_balm_closed_box.png',
                'image_open' => '/assets/lipbalmopenbox.png',
                'image_photo' => '/assets/bestseller_balm_photo_hd.png',
                'is_featured' => true,
                'is_new' => true,
                'is_active' => true,
            ]
        );

        // 4. Product Gallery Images
        ProductImage::firstOrCreate(['product_id' => $manjistha->id, 'image_url' => '/assets/bestseller_manjistha_photo_hd.png'], ['display_order' => 1]);
        ProductImage::firstOrCreate(['product_id' => $manjistha->id, 'image_url' => '/assets/manjistha_open_box.png'], ['display_order' => 2]);
        ProductImage::firstOrCreate(['product_id' => $manjistha->id, 'image_url' => '/assets/manjistha_closed_box.png'], ['display_order' => 3]);

        ProductImage::firstOrCreate(['product_id' => $goatMilk->id, 'image_url' => '/assets/bestseller_goat_photo_hd.png'], ['display_order' => 1]);
        ProductImage::firstOrCreate(['product_id' => $goatMilk->id, 'image_url' => '/assets/goatmilksoap_open_box.png'], ['display_order' => 2]);
        ProductImage::firstOrCreate(['product_id' => $goatMilk->id, 'image_url' => '/assets/goatmilksoap_close_box.png'], ['display_order' => 3]);

        ProductImage::firstOrCreate(['product_id' => $beetroot->id, 'image_url' => '/assets/bestseller_balm_photo_hd.png'], ['display_order' => 1]);
        ProductImage::firstOrCreate(['product_id' => $beetroot->id, 'image_url' => '/assets/lipbalmopenbox.png'], ['display_order' => 2]);
        ProductImage::firstOrCreate(['product_id' => $beetroot->id, 'image_url' => '/assets/lip_balm_closed_box.png'], ['display_order' => 3]);

        // 5. Coupons
        Coupon::firstOrCreate(
            ['code' => 'WELCOME10'],
            [
                'description' => '10% OFF on your first purchase above ₹299',
                'discount_type' => 'percentage',
                'discount_value' => 10.00,
                'min_order_value' => 299.00,
                'max_discount' => 100.00,
                'usage_limit' => 500,
                'is_active' => true,
            ]
        );

        Coupon::firstOrCreate(
            ['code' => 'GLAZE15'],
            [
                'description' => '15% OFF on orders above ₹499',
                'discount_type' => 'percentage',
                'discount_value' => 15.00,
                'min_order_value' => 499.00,
                'max_discount' => 200.00,
                'usage_limit' => 200,
                'is_active' => true,
            ]
        );

        // 6. Reviews
        Review::firstOrCreate(
            ['product_id' => $manjistha->id, 'customer_name' => 'Sneha Nair'],
            [
                'rating' => 5,
                'title' => 'Transformative cleanser!',
                'comment' => 'Visible reduction in acne scars after just 2 weeks. Leaves my skin feeling so clean yet deeply nourished.',
                'is_verified' => true,
                'is_approved' => true,
            ]
        );

        Review::firstOrCreate(
            ['product_id' => $goatMilk->id, 'customer_name' => 'Pooja Hegde'],
            [
                'rating' => 5,
                'title' => 'Gentle enough for extreme sensitive skin',
                'comment' => 'The creamiest lather I have experienced in natural soaps. Keeps dry patches away even in winter.',
                'is_verified' => true,
                'is_approved' => true,
            ]
        );

        Review::firstOrCreate(
            ['product_id' => $beetroot->id, 'customer_name' => 'Divya Sharma'],
            [
                'rating' => 5,
                'title' => 'Authentic rose-ruby tint!',
                'comment' => 'Gives the most natural subtle flush to lips. Does not feel sticky and lasts for hours.',
                'is_verified' => true,
                'is_approved' => true,
            ]
        );

        // 7. Seed Sample Orders (#EG48273, #EG47190, #EG46922)
        $order1 = Order::firstOrCreate(
            ['order_number' => 'EG48273'],
            [
                'user_id' => $customer->id,
                'customer_name' => 'Ayesha N.',
                'customer_email' => 'ayesha@example.com',
                'customer_phone' => '+91 98765 43210',
                'house_number' => '#42, Lotus Villa',
                'street' => 'Deralakatte, Near University Campus',
                'city' => 'Mangalore',
                'state' => 'Karnataka',
                'pincode' => '575018',
                'country' => 'India',
                'subtotal' => 799.00,
                'discount_amount' => 0.00,
                'shipping_fee' => 0.00,
                'total_amount' => 799.00,
                'payment_method' => 'razorpay',
                'payment_status' => 'paid',
                'order_status' => 'processing',
                'tracking_number' => 'DTDC-9928174',
                'notes' => 'Please leave with security if unavailable.',
            ]
        );

        OrderItem::firstOrCreate(
            ['order_id' => $order1->id, 'product_id' => $manjistha->id],
            [
                'product_name' => 'Manjistha Soap',
                'sku' => 'EG-SOAP-MANJ',
                'unit_price' => 349.00,
                'quantity' => 1,
                'subtotal_price' => 349.00,
                'image_url' => '/assets/bestseller_manjistha_photo_hd.png',
            ]
        );

        OrderItem::firstOrCreate(
            ['order_id' => $order1->id, 'product_id' => $beetroot->id],
            [
                'product_name' => 'Beet Root Lip Balm',
                'sku' => 'EG-BALM-BEET',
                'unit_price' => 249.00,
                'quantity' => 1,
                'subtotal_price' => 249.00,
                'image_url' => '/assets/bestseller_balm_photo_hd.png',
            ]
        );

        OrderTracking::firstOrCreate(
            ['order_id' => $order1->id, 'stage' => 'ordered'],
            [
                'status_title' => 'Order Placed',
                'description' => 'Your natural skincare order was placed successfully.',
                'is_completed' => true,
                'completed_at' => now()->subHours(6),
            ]
        );

        OrderTracking::firstOrCreate(
            ['order_id' => $order1->id, 'stage' => 'confirmed'],
            [
                'status_title' => 'Order Confirmed',
                'description' => 'Payment verified and order accepted by artisan team.',
                'is_completed' => true,
                'completed_at' => now()->subHours(4),
            ]
        );

        OrderTracking::firstOrCreate(
            ['order_id' => $order1->id, 'stage' => 'processing'],
            [
                'status_title' => 'Handcrafted & Packaged',
                'description' => 'Items are carefully packed in our eco-conscious botanical packaging.',
                'is_completed' => false,
            ]
        );

        // 8. Blog Posts
        BlogPost::firstOrCreate(
            ['slug' => 'a-natural-skincare-routine-with-earthglanze-essentials'],
            [
                'title' => 'A Natural Skincare Routine with EarthGlaze Essentials',
                'category' => 'Skincare Wisdom',
                'author' => 'EarthGlaze Botanical Team',
                'excerpt' => 'Discover how our handcrafted soaps and artisanal lip balm harmonize Ayurvedic wisdom with modern daily skincare routines.',
                'content' => 'Daily skincare should be a calming, therapeutic ritual that restores your natural glow rather than overwhelming it with harsh synthetic additives...',
                'image_url' => '/assets/blog_banner_reference.jpg',
                'read_time' => '4 min read',
                'is_published' => true,
                'published_at' => now()->subDays(3),
            ]
        );

        // 9. Contact Messages
        ContactMessage::firstOrCreate(
            ['email' => 'priya.k@example.com'],
            [
                'name' => 'Priya K.',
                'phone' => '+91 98451 23456',
                'subject' => 'Product enquiry regarding eczema skin',
                'message' => 'Hello team, is the Goat Milk Soap suitable for children with mild eczema? Thank you!',
                'is_resolved' => false,
            ]
        );
    }
}
