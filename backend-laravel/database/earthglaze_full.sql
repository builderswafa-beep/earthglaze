-- ============================================================================
-- EarthGlaze Natural Skincare — Complete MySQL 8.x Database Schema & Seed SQL
-- Matches backend-laravel migrations & Next.js frontend API contract
-- ============================================================================

SET NAMES utf8mb4;
SET TIME_ZONE = '+00:00';
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `earthglaze_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `earthglaze_db`;

-- ============================================================================
-- 1. DROP EXISTING TABLES (Reverse Dependency Order)
-- ============================================================================

DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_tracking`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `inventory_logs`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `migrations`;

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('customer','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_index` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`, `queue`, `failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `category_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Soaps',
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `weight` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '100 g',
  `stock_qty` int NOT NULL DEFAULT '50',
  `rating` decimal(3,2) NOT NULL DEFAULT '5.00',
  `review_count` int NOT NULL DEFAULT '0',
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `benefits` text COLLATE utf8mb4_unicode_ci,
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `how_to_use` text COLLATE utf8mb4_unicode_ci,
  `image_closed` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_open` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '1',
  `is_new` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_unique` (`sku`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `house_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'India',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `addresses_user_id_foreign` (`user_id`),
  CONSTRAINT `addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `max_discount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int NOT NULL DEFAULT '100',
  `times_used` int NOT NULL DEFAULT '0',
  `starts_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coupon_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carts_user_id_foreign` (`user_id`),
  KEY `carts_coupon_id_foreign` (`coupon_id`),
  KEY `carts_session_id_index` (`session_id`),
  CONSTRAINT `carts_coupon_id_foreign` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_items_cart_id_foreign` (`cart_id`),
  KEY `cart_items_product_id_foreign` (`product_id`),
  CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `house_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'India',
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `coupon_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('razorpay','cod','upi','card','netbanking') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cod',
  `payment_status` enum('pending','paid','failed','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `order_status` enum('pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `tracking_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal_price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_tracking` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `stage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_tracking_order_id_foreign` (`order_id`),
  CONSTRAINT `order_tracking_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_gateway` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'razorpay',
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR',
  `status` enum('created','authorized','captured','refunded','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `razorpay_order_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_payment_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_transaction_id_unique` (`transaction_id`),
  KEY `payments_order_id_foreign` (`order_id`),
  KEY `payments_razorpay_order_id_index` (`razorpay_order_id`),
  KEY `payments_razorpay_payment_id_index` (`razorpay_payment_id`),
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '1',
  `is_approved` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_product_id_foreign` (`product_id`),
  KEY `reviews_user_id_foreign` (`user_id`),
  CONSTRAINT `reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `inventory_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `change_type` enum('sale','restock','return','adjustment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_change` int NOT NULL,
  `previous_quantity` int NOT NULL,
  `new_quantity` int NOT NULL,
  `reference_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_logs_product_id_foreign` (`product_id`),
  CONSTRAINT `inventory_logs_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `contact_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_resolved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `newsletter_subscribers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletter_subscribers_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blog_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Skincare Wisdom',
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EarthGlaze Botanical Team',
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read_time` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4 min read',
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. SEED DATA
-- ============================================================================

-- 3.1 Laravel Migration Records
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_11_08_160405_create_personal_access_tokens_table', 1),
(5, '2026_11_08_170001_create_categories_and_products_table', 1),
(6, '2026_11_08_170002_create_addresses_and_coupons_table', 1),
(7, '2026_11_08_170003_create_carts_and_items_table', 1),
(8, '2026_11_08_170004_create_orders_and_payments_table', 1),
(9, '2026_11_08_170005_create_extras_table', 1);

-- 3.2 Users (Demo Credentials: admin@earthglaze.in / EarthGlaze@2026 | ayesha@example.com / Ayesha@123)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `password`, `avatar`, `address`, `city`, `state`, `pincode`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'EarthGlaze Admin', 'admin@earthglaze.in', '+91 98765 43210', 'admin', '$2y$12$6akbjdyoMAwgEGu.DXp76u2C8lD7YA.lJD6Y.UZp9jePyAOt2XPYK', NULL, 'Headquarters, Green Park', 'Mangalore', 'Karnataka', '575001', '2026-11-08 16:10:28', NULL, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 'Ayesha N.', 'ayesha@example.com', '+91 98765 43210', 'customer', '$2y$12$c4Row1AcSDv95h8qmI026e2XwAwaWRp6h/Gay0o6TxFwVj2szpsDW', NULL, 'Deralakatte, Near University Campus', 'Mangalore', 'Karnataka', '575018', '2026-11-08 16:10:28', NULL, '2026-11-08 16:10:28', '2026-11-08 16:10:28');

-- 3.3 Saved Customer Address
INSERT INTO `addresses` (`id`, `user_id`, `full_name`, `phone`, `house_number`, `street`, `city`, `state`, `pincode`, `country`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 2, 'Ayesha N.', '+91 98765 43210', '#42, Lotus Villa', 'Deralakatte, Near University Campus', 'Mangalore', 'Karnataka', '575018', 'India', 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28');

-- 3.4 Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Artisan Soaps', 'soaps', 'Cold-processed Ayurvedic soaps crafted with fresh botanicals and pure unrefined oils.', '/assets/bestseller_manjistha_photo_hd.png', 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 'Lip Care', 'lip-care', 'Intense natural hydration and gentle botanical tint for radiant, supple lips.', '/assets/bestseller_balm_photo_hd.png', 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28');

-- 3.5 Products (3 Core EarthGlaze Formulations)
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `price`, `sale_price`, `original_price`, `weight`, `stock_qty`, `rating`, `review_count`, `tagline`, `description`, `benefits`, `ingredients`, `how_to_use`, `image_closed`, `image_open`, `image_photo`, `is_featured`, `is_new`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'EG-SOAP-MANJ', 'Manjistha Soap', 'manjistha-soap', 1, 'Soaps', 349.00, 349.00, 399.00, '100 g', 50, 4.90, 428, 'Purifies skin, helps reduce blemishes and gives a natural glow.', 'A traditional Ayurvedic cleansing bar crafted with pure wild Manjistha (Rubia cordifolia), red sandalwood, and nourishing cold-pressed coconut oil. Naturally detoxifies the skin, diminishes uneven tone, and restores youthful radiance without stripping moisture.', 'Fades hyperpigmentation, purifies acne-prone skin, imparts an authentic herbal glow, and maintains dermal pH balance.', 'Wild Manjistha (Rubia Cordifolia) Root Extract, Pure Cold-Pressed Coconut Oil, Mahua Oil, Red Sandalwood Extract, Castor Oil, Botanical Lye.', 'Work into a rich creamy lather with warm water. Gently massage over damp face and body in circular motions. Rinse thoroughly and pat dry with a soft towel.', '/assets/manjistha_closed_box.png', '/assets/manjistha_open_box.png', '/assets/bestseller_manjistha_photo_hd.png', 1, 0, 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 'EG-SOAP-GOAT', 'Goat Milk Soap', 'goat-milk-soap', 1, 'Soaps', 349.00, 349.00, 399.00, '100 g', 65, 5.00, 512, 'Creamy Moisture Bar with Pure Goat Milk & Shea Butter.', 'An ultra-hydrating, gentle cleanser infused with farm-fresh whole goat milk, rich raw shea butter, and sweet almond oil. Packed with lactic acid, natural vitamins A, B, and D to calm sensitivity, relieve dryness, and leave the skin silky soft.', 'Deep lasting cellular moisturization, non-irritating formula ideal for sensitive and eczema-prone skin, gently removes dead cells with natural lactic acid.', 'Fresh Farm Goat Milk, Raw Organic Shea Butter, Sweet Almond Oil, Virgin Olive Oil, Pure Coconut Oil, Distilled Water, Essential Botanicals.', 'Lather between palms with lukewarm water. Massage the velvety lather generously over face and body. Allow nutrients to absorb for 30 seconds before rinsing.', '/assets/goatmilksoap_close_box.png', '/assets/goatmilksoap_open_box.png', '/assets/bestseller_goat_photo_hd.png', 1, 0, 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(3, 'EG-BALM-BEET', 'Beet Root Lip Balm', 'beetroot-lip-balm', 2, 'Lip Care', 249.00, 249.00, 299.00, '10 g', 80, 4.90, 384, 'Keeps lips soft, smooth and naturally tinted with organic beetroot.', 'A luscious, velvety lip butter made with slow-infused fresh organic beetroot extract, unrefined golden beeswax, shea butter, and sweet almond oil. Delivers all-day deep hydration and imparts a subtle, healthy ruby-pink sheen.', 'Prevents chapping and flaking, locks in moisture for 12+ hours, adds a natural radiant rosy tint without artificial synthetic dyes or petro-chemicals.', 'Fresh Beetroot Juice Extract, Golden Natural Beeswax, Pure Shea Butter, Sweet Almond Oil, Vitamin E (Tocopherol), Rose Essential Oil.', 'Glide gently onto lips with a clean fingertip whenever lips feel dry or before stepping out for a healthy natural rosy tint.', '/assets/lip_balm_closed_box.png', '/assets/lipbalmopenbox.png', '/assets/bestseller_balm_photo_hd.png', 1, 1, 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28');

-- 3.6 Product Gallery Images
INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 1, '/assets/bestseller_manjistha_photo_hd.png', 'Manjistha Soap Product Photo', 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 1, '/assets/manjistha_open_box.png', 'Manjistha Soap Open Box', 2, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(3, 1, '/assets/manjistha_closed_box.png', 'Manjistha Soap Closed Box', 3, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(4, 2, '/assets/bestseller_goat_photo_hd.png', 'Goat Milk Soap Product Photo', 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(5, 2, '/assets/goatmilksoap_open_box.png', 'Goat Milk Soap Open Box', 2, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(6, 2, '/assets/goatmilksoap_close_box.png', 'Goat Milk Soap Closed Box', 3, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(7, 3, '/assets/bestseller_balm_photo_hd.png', 'Beet Root Lip Balm Product Photo', 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(8, 3, '/assets/lipbalmopenbox.png', 'Beet Root Lip Balm Open Jar', 2, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(9, 3, '/assets/lip_balm_closed_box.png', 'Beet Root Lip Balm Closed Jar', 3, '2026-11-08 16:10:28', '2026-11-08 16:10:28');

-- 3.7 Coupons
INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `usage_limit`, `times_used`, `starts_at`, `expires_at`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME10', '10% OFF on your first purchase above ₹299', 'percentage', 10.00, 299.00, 100.00, 500, 0, NULL, NULL, 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 'GLAZE15', '15% OFF on orders above ₹499', 'percentage', 15.00, 499.00, 200.00, 200, 0, NULL, NULL, 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(3, 'GLOW15', '15% OFF on orders above ₹800', 'percentage', 15.00, 800.00, 250.00, 500, 0, NULL, NULL, 1, '2026-11-10 18:07:46', '2026-11-10 18:07:46'),
(4, 'GLOW25', '25% OFF on orders above ₹500', 'percentage', 25.00, 500.00, 300.00, 100, 0, NULL, NULL, 1, '2026-11-08 16:42:11', '2026-11-08 16:42:11');

-- 3.8 Verified Product Reviews
INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `customer_name`, `rating`, `title`, `comment`, `is_verified`, `is_approved`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Sneha Nair', 5, 'Transformative cleanser!', 'Visible reduction in acne scars after just 2 weeks. Leaves my skin feeling so clean yet deeply nourished.', 1, 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 2, NULL, 'Pooja Hegde', 5, 'Gentle enough for extreme sensitive skin', 'The creamiest lather I have experienced in natural soaps. Keeps dry patches away even in winter.', 1, 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(3, 3, NULL, 'Divya Sharma', 5, 'Authentic rose-ruby tint!', 'Gives the most natural subtle flush to lips. Does not feel sticky and lasts for hours.', 1, 1, '2026-11-08 16:10:28', '2026-11-08 16:10:28');

-- 3.9 Initial Inventory Logs
INSERT INTO `inventory_logs` (`id`, `product_id`, `change_type`, `quantity_change`, `previous_quantity`, `new_quantity`, `reference_id`, `created_at`, `updated_at`) VALUES
(1, 1, 'restock', 50, 0, 50, 'INITIAL_SEED', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 2, 'restock', 65, 0, 65, 'INITIAL_SEED', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(3, 3, 'restock', 80, 0, 80, 'INITIAL_SEED', '2026-11-08 16:10:28', '2026-11-08 16:10:28');

-- 3.10 Sample Orders, Order Items, Tracking Milestones & Payments
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `house_number`, `street`, `city`, `state`, `pincode`, `country`, `subtotal`, `discount_amount`, `coupon_code`, `shipping_fee`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `tracking_number`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'EG48273', 2, 'Ayesha N.', 'ayesha@example.com', '+91 98765 43210', '#42, Lotus Villa', 'Deralakatte, Near University Campus', 'Mangalore', 'Karnataka', '575018', 'India', 598.00, 0.00, NULL, 0.00, 598.00, 'razorpay', 'paid', 'processing', 'DTDC-9928174', 'Please leave with security if unavailable.', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 'EG35273', 2, 'Ayesha N.', 'ayesha@example.com', '+91 98765 43210', '#42, Lotus Villa', 'Deralakatte, Near University Campus', 'Mangalore', 'Karnataka', '575018', 'India', 349.00, 0.00, NULL, 0.00, 349.00, 'cod', 'pending', 'confirmed', NULL, NULL, '2026-11-09 10:24:00', '2026-11-09 10:24:00'),
(3, 'EG78981', 2, 'Ayesha N.', 'ayesha@example.com', '+91 98765 43210', '#42, Lotus Villa', 'Deralakatte, Near University Campus', 'Mangalore', 'Karnataka', '575018', 'India', 349.00, 0.00, NULL, 0.00, 349.00, 'cod', 'pending', 'pending', NULL, NULL, '2026-11-09 14:15:00', '2026-11-09 14:15:00');

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `sku`, `unit_price`, `quantity`, `subtotal_price`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Manjistha Soap', 'EG-SOAP-MANJ', 349.00, 1, 349.00, '/assets/bestseller_manjistha_photo_hd.png', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 1, 3, 'Beet Root Lip Balm', 'EG-BALM-BEET', 249.00, 1, 249.00, '/assets/bestseller_balm_photo_hd.png', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(3, 2, 2, 'Goat Milk Soap', 'EG-SOAP-GOAT', 349.00, 1, 349.00, '/assets/bestseller_goat_photo_hd.png', '2026-11-09 10:24:00', '2026-11-09 10:24:00'),
(4, 3, 1, 'Manjistha Soap', 'EG-SOAP-MANJ', 349.00, 1, 349.00, '/assets/bestseller_manjistha_photo_hd.png', '2026-11-09 14:15:00', '2026-11-09 14:15:00');

INSERT INTO `order_tracking` (`id`, `order_id`, `stage`, `status_title`, `description`, `is_completed`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'ordered', 'Order Placed', 'Your natural skincare order was placed successfully.', 1, '2026-11-08 10:10:28', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 1, 'confirmed', 'Order Confirmed', 'Payment verified and order accepted by artisan team.', 1, '2026-11-08 12:10:28', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(3, 1, 'processing', 'Handcrafted & Packaged', 'Items are carefully packed in our eco-conscious botanical packaging.', 0, NULL, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(4, 2, 'ordered', 'Order Placed', 'We have received your natural skincare order.', 1, '2026-11-09 10:24:00', '2026-11-09 10:24:00', '2026-11-09 10:24:00'),
(5, 2, 'confirmed', 'Order Confirmed', 'Order confirmed for artisan crafting.', 1, '2026-11-09 11:00:00', '2026-11-09 11:00:00', '2026-11-09 11:00:00'),
(6, 3, 'ordered', 'Order Placed', 'We have received your natural skincare order.', 1, '2026-11-09 14:15:00', '2026-11-09 14:15:00', '2026-11-09 14:15:00');

INSERT INTO `payments` (`id`, `order_id`, `transaction_id`, `payment_gateway`, `payment_method`, `amount`, `currency`, `status`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `payload`, `created_at`, `updated_at`) VALUES
(1, 1, 'TXN-EG48273', 'razorpay', 'razorpay', 598.00, 'INR', 'captured', 'order_demo_EG48273', 'pay_demo_EG48273', NULL, NULL, '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 2, NULL, 'cod', 'cod', 349.00, 'INR', 'created', NULL, NULL, NULL, NULL, '2026-11-09 10:24:00', '2026-11-09 10:24:00'),
(3, 3, NULL, 'cod', 'cod', 349.00, 'INR', 'created', NULL, NULL, NULL, NULL, '2026-11-09 14:15:00', '2026-11-09 14:15:00');

-- 3.11 Blog Posts
INSERT INTO `blog_posts` (`id`, `slug`, `title`, `category`, `author`, `excerpt`, `content`, `image_url`, `read_time`, `is_published`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'a-natural-skincare-routine-with-earthglanze-essentials', 'A Natural Skincare Routine with EarthGlaze Essentials', 'Skincare Wisdom', 'EarthGlaze Botanical Team', 'Discover how our handcrafted soaps and artisanal lip balm harmonize Ayurvedic wisdom with modern daily skincare routines.', 'Daily skincare should be a calming, therapeutic ritual that restores your natural glow rather than overwhelming it with harsh synthetic additives. Begin with warm water and our cold-processed Manjistha or Goat Milk bar, followed by pure Beet Root Lip Balm to seal in botanical hydration.', '/assets/blog_banner_reference.jpg', '4 min read', 1, '2026-11-05 16:10:28', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(2, 'aloe-vera-for-healthy-glowing-skin', 'Aloe Vera for Healthy, Glowing Skin', 'Ingredients', 'Dr. Ananya Rao', 'Discover how aloe vera soothes, hydrates and naturally nourishes your skin.', 'Aloe Vera, hailed as Kumari in Ayurvedic pharmacology, houses over 75 active constituents including vitamins A, C, and E, active enzymes, and polysaccharides that deeply nourish without clogging pores.', '/assets/blog_featured_aloe_clean.png', '6 min read', 1, '2026-11-04 10:00:00', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(3, 'beetroot-for-naturally-radiant-lips', 'Beetroot for Naturally Radiant Lips', 'Ingredients', 'Pooja Sharma', 'How beetroot helps nourish, brighten and keep your lips healthy.', 'Beetroot is rich in betalains and vitamin C, gently exfoliating dry lip skin while imparting a natural rosy blush when blended with unrefined beeswax and cold-pressed oils.', '/assets/blog_card_beetroot_hd.png', '4 min read', 1, '2026-11-03 10:00:00', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(4, 'why-natural-soaps-are-better-for-your-skin', 'Why Natural Soaps Are Better for Your Skin', 'Skincare Tips', 'Dr. Ananya Rao', 'The benefits of choosing chemical-free, plant-based soaps for everyday care.', 'At EarthGlaze, each soap cures undisturbed on wooden racks for 28 days, preserving natural glycerin generated during saponification to draw moisture into your skin.', '/assets/blog_card_soap_hd.png', '5 min read', 1, '2026-11-02 10:00:00', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(5, 'the-skin-benefits-of-goat-milk', 'The Skin Benefits of Goat Milk', 'Ingredients', 'Kavita Menon', 'A gentle, nourishing ingredient that keeps your skin soft and healthy.', 'Goat milk has a pH close to healthy human skin and contains natural lactic acid and caprylic triglycerides that soothe dry and sensitive skin barriers.', '/assets/blog_card_goatmilk_hd.png', '6 min read', 1, '2026-11-01 10:00:00', '2026-11-08 16:10:28', '2026-11-08 16:10:28'),
(6, 'manjistha-a-traditional-skin-healer', 'Manjistha: A Traditional Skin Healer', 'Ingredients', 'Dr. Ananya Rao', 'Learn how manjistha helps purify, brighten and support clear, healthy skin.', 'Manjistha (Rubia cordifolia) is revered in Ayurveda as a premier complexion-enhancing herb that helps calm blemishes and fade post-acne marks naturally.', '/assets/blog_card_manjistha_hd.png', '5 min read', 1, '2026-10-30 10:00:00', '2026-11-08 16:10:28', '2026-11-08 16:10:28');

-- 3.12 Sample Contact Message
INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `is_resolved`, `created_at`, `updated_at`) VALUES
(1, 'Priya K.', 'priya.k@example.com', '+91 98451 23456', 'Product enquiry regarding eczema skin', 'Hello team, is the Goat Milk Soap suitable for children with mild eczema? Thank you!', 0, '2026-11-08 16:10:28', '2026-11-08 16:10:28');

SET FOREIGN_KEY_CHECKS = 1;
