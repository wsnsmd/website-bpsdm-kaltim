CREATE TABLE `accounts` (
	`user_id` varchar(36) NOT NULL,
	`type` varchar(100) NOT NULL,
	`provider` varchar(100) NOT NULL,
	`provider_account_id` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(100),
	`scope` varchar(500),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `accounts_provider_provider_account_id_pk` PRIMARY KEY(`provider`,`provider_account_id`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text,
	`url` varchar(1000),
	`type` enum('info','warning','urgent','event') DEFAULT 'info',
	`show_in_ticker` boolean DEFAULT true,
	`show_in_banner` boolean DEFAULT false,
	`priority` int DEFAULT 0,
	`start_date` datetime NOT NULL,
	`end_date` datetime,
	`is_active` boolean DEFAULT true,
	`created_by` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`slug` varchar(150) NOT NULL,
	`description` text,
	`parent_id` int,
	`type` enum('post','program','document') NOT NULL DEFAULT 'post',
	`color` varchar(20),
	`icon` varchar(100),
	`sort_order` int DEFAULT 0,
	`is_visible` boolean DEFAULT true,
	`meta_title` varchar(255),
	`meta_description` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_type_idx` UNIQUE(`slug`,`type`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`description` text,
	`file_url` varchar(1000) NOT NULL,
	`file_name` varchar(300),
	`file_size` int,
	`file_type` varchar(50),
	`category_id` int,
	`type` enum('laporan','sop','panduan','peraturan','materi','formulir','surat-edaran','lainnya') DEFAULT 'lainnya',
	`is_public` boolean DEFAULT true,
	`download_count` int DEFAULT 0,
	`published_at` datetime,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'published',
	`uploaded_by` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `documents_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `menu_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`slug` varchar(150) NOT NULL,
	`location` enum('header','footer-col1','footer-col2','footer-col3','topbar','sidebar','mobile') NOT NULL,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`menu_group_id` int NOT NULL,
	`parent_id` int,
	`label` varchar(255) NOT NULL,
	`link_type` enum('page','post','category','external','anchor','custom') NOT NULL,
	`page_id` int,
	`category_id` int,
	`custom_url` varchar(1000),
	`open_in_new_tab` boolean DEFAULT false,
	`icon` varchar(100),
	`sort_order` int DEFAULT 0,
	`is_visible` boolean DEFAULT true,
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`template` enum('default','full-width','sidebar','landing','ppid','contact','profile') DEFAULT 'default',
	`parent_id` int,
	`featured_image` varchar(1000),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`sort_order` int DEFAULT 0,
	`meta_title` varchar(255),
	`meta_description` text,
	`wp_page_id` int,
	`wp_slug` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`slug` varchar(150) NOT NULL,
	`group` varchar(100),
	`description` text,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_tags` (
	`post_id` int NOT NULL,
	`tag_id` int NOT NULL,
	CONSTRAINT `post_tags_post_id_tag_id_pk` PRIMARY KEY(`post_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featured_image` varchar(1000),
	`featured_image_alt` varchar(255),
	`featured_image_caption` text,
	`author_id` varchar(36),
	`author_name` varchar(255),
	`status` enum('draft','review','published','archived') NOT NULL DEFAULT 'draft',
	`published_at` datetime,
	`category_id` int,
	`wp_post_id` int,
	`wp_slug` varchar(500),
	`view_count` int DEFAULT 0,
	`reading_time` int DEFAULT 0,
	`is_featured` boolean DEFAULT false,
	`is_pinned` boolean DEFAULT false,
	`meta_title` varchar(255),
	`meta_description` text,
	`meta_keywords` varchar(500),
	`canonical_url` varchar(1000),
	`og_image` varchar(1000),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`description` text,
	`objectives` text,
	`prerequisites` text,
	`type` enum('teknis','fungsional','manajerial','pola-apbd','pola-kontribusi','pola-kemitraan','orientasi') NOT NULL,
	`level` enum('dasar','lanjutan','madya','utama','pimpinan'),
	`duration_days` int,
	`duration_hours` int,
	`max_participants` int,
	`featured_image` varchar(1000),
	`brochure_url` varchar(1000),
	`status` enum('active','inactive','draft') NOT NULL DEFAULT 'draft',
	`is_highlight` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`meta_title` varchar(255),
	`meta_description` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `programs_id` PRIMARY KEY(`id`),
	CONSTRAINT `programs_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schedule_id` int NOT NULL,
	`user_id` varchar(36),
	`participant_name` varchar(255) NOT NULL,
	`participant_nip` varchar(20),
	`participant_email` varchar(255) NOT NULL,
	`participant_phone` varchar(20),
	`participant_unit` varchar(300),
	`participant_position` varchar(300),
	`status` enum('pending','approved','rejected','cancelled','completed') NOT NULL DEFAULT 'pending',
	`notes` text,
	`registered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`approved_at` datetime,
	`cancelled_at` datetime,
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` int NOT NULL,
	`permission_id` int NOT NULL,
	CONSTRAINT `role_permissions_role_id_permission_id_pk` PRIMARY KEY(`role_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`program_id` int NOT NULL,
	`batch_name` varchar(255),
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`registration_start` datetime,
	`registration_end` datetime,
	`mode` enum('online','offline','blended') NOT NULL,
	`location` varchar(500),
	`virtual_platform` varchar(200),
	`quota` int NOT NULL,
	`registered_count` int DEFAULT 0,
	`status` enum('draft','open','closed','full','ongoing','completed','cancelled') NOT NULL DEFAULT 'draft',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_token` varchar(255) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_session_token` PRIMARY KEY(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` varchar(200) NOT NULL,
	`value` text,
	`type` enum('string','number','boolean','json','html') DEFAULT 'string',
	`group` varchar(100) DEFAULT 'general',
	`label` varchar(255),
	`is_public` boolean DEFAULT false,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`usage_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` varchar(36) NOT NULL,
	`role_id` int NOT NULL,
	CONSTRAINT `user_roles_user_id_role_id_pk` PRIMARY KEY(`user_id`,`role_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` timestamp,
	`image` varchar(500),
	`nip` varchar(20),
	`phone` varchar(20),
	`sso_id` varchar(255),
	`sso_provider` varchar(100),
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `announcements` ADD CONSTRAINT `announcements_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_menu_group_id_menu_groups_id_fk` FOREIGN KEY (`menu_group_id`) REFERENCES `menu_groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_tags` ADD CONSTRAINT `post_tags_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_tags` ADD CONSTRAINT `post_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `registrations` ADD CONSTRAINT `registrations_schedule_id_schedules_id_fk` FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `registrations` ADD CONSTRAINT `registrations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_program_id_programs_id_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `accounts_user_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `ann_active_idx` ON `announcements` (`is_active`);--> statement-breakpoint
CREATE INDEX `ann_date_idx` ON `announcements` (`start_date`);--> statement-breakpoint
CREATE INDEX `ann_ticker_idx` ON `announcements` (`show_in_ticker`);--> statement-breakpoint
CREATE INDEX `categories_parent_idx` ON `categories` (`parent_id`);--> statement-breakpoint
CREATE INDEX `documents_type_idx` ON `documents` (`type`);--> statement-breakpoint
CREATE INDEX `documents_status_idx` ON `documents` (`status`);--> statement-breakpoint
CREATE INDEX `menu_items_group_idx` ON `menu_items` (`menu_group_id`);--> statement-breakpoint
CREATE INDEX `menu_items_parent_idx` ON `menu_items` (`parent_id`);--> statement-breakpoint
CREATE INDEX `pages_parent_idx` ON `pages` (`parent_id`);--> statement-breakpoint
CREATE INDEX `post_tags_tag_idx` ON `post_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `posts_wp_slug_idx` ON `posts` (`wp_slug`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_published_idx` ON `posts` (`published_at`);--> statement-breakpoint
CREATE INDEX `posts_category_idx` ON `posts` (`category_id`);--> statement-breakpoint
CREATE INDEX `posts_featured_idx` ON `posts` (`is_featured`);--> statement-breakpoint
CREATE INDEX `programs_type_idx` ON `programs` (`type`);--> statement-breakpoint
CREATE INDEX `programs_status_idx` ON `programs` (`status`);--> statement-breakpoint
CREATE INDEX `registrations_schedule_idx` ON `registrations` (`schedule_id`);--> statement-breakpoint
CREATE INDEX `registrations_user_idx` ON `registrations` (`user_id`);--> statement-breakpoint
CREATE INDEX `registrations_status_idx` ON `registrations` (`status`);--> statement-breakpoint
CREATE INDEX `schedules_program_idx` ON `schedules` (`program_id`);--> statement-breakpoint
CREATE INDEX `schedules_start_date_idx` ON `schedules` (`start_date`);--> statement-breakpoint
CREATE INDEX `schedules_status_idx` ON `schedules` (`status`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `users_sso_idx` ON `users` (`sso_id`);