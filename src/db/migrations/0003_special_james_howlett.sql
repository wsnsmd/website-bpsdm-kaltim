CREATE TABLE `staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nip` varchar(30),
	`position` varchar(255) NOT NULL,
	`unit_id` int,
	`type` enum('kepala_badan','sekretaris','kepala_bidang','widyaiswara','pegawai') NOT NULL,
	`photo` varchar(500),
	`email` varchar(255),
	`phone` varchar(50),
	`education` varchar(255),
	`bio` text,
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`short_name` varchar(50),
	`description` text,
	`parent_id` int,
	`level` int DEFAULT 0,
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `units_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `menu_items` DROP FOREIGN KEY `menu_items_menu_group_id_menu_groups_id_fk`;
--> statement-breakpoint
ALTER TABLE `menu_items` DROP FOREIGN KEY `menu_items_page_id_pages_id_fk`;
--> statement-breakpoint
ALTER TABLE `menu_items` DROP FOREIGN KEY `menu_items_category_id_categories_id_fk`;
--> statement-breakpoint
ALTER TABLE `menu_groups` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `menu_groups` MODIFY COLUMN `slug` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `menu_groups` MODIFY COLUMN `location` varchar(100) DEFAULT 'header';--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `content` longtext;--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `template` varchar(100) DEFAULT 'default';--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `featured_image` varchar(500);--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `status` enum('published','draft','archived') NOT NULL DEFAULT 'published';--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `meta_description` varchar(500);--> statement-breakpoint
ALTER TABLE `menu_groups` ADD `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `menu_items` ADD `url` varchar(500);--> statement-breakpoint
ALTER TABLE `menu_items` ADD `target` varchar(20) DEFAULT '_self';--> statement-breakpoint
ALTER TABLE `menu_items` ADD `is_active` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `pages` ADD `show_in_nav` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `pages` ADD `created_by` varchar(36);--> statement-breakpoint
ALTER TABLE `menu_groups` ADD CONSTRAINT `menu_groups_slug_idx` UNIQUE(`slug`);--> statement-breakpoint
CREATE INDEX `staff_unit_idx` ON `staff` (`unit_id`);--> statement-breakpoint
CREATE INDEX `staff_type_idx` ON `staff` (`type`);--> statement-breakpoint
CREATE INDEX `staff_active_idx` ON `staff` (`is_active`);--> statement-breakpoint
CREATE INDEX `units_parent_idx` ON `units` (`parent_id`);--> statement-breakpoint
CREATE INDEX `pages_status_idx` ON `pages` (`status`);--> statement-breakpoint
ALTER TABLE `menu_groups` DROP COLUMN `is_active`;--> statement-breakpoint
ALTER TABLE `menu_groups` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `menu_items` DROP COLUMN `link_type`;--> statement-breakpoint
ALTER TABLE `menu_items` DROP COLUMN `category_id`;--> statement-breakpoint
ALTER TABLE `menu_items` DROP COLUMN `custom_url`;--> statement-breakpoint
ALTER TABLE `menu_items` DROP COLUMN `open_in_new_tab`;--> statement-breakpoint
ALTER TABLE `menu_items` DROP COLUMN `is_visible`;--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `wp_page_id`;--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `wp_slug`;