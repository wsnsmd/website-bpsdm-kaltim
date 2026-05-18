CREATE TABLE `document_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(100),
	`color` varchar(50),
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `document_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `doc_cat_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `documents` DROP INDEX `documents_slug_idx`;--> statement-breakpoint
ALTER TABLE `documents` DROP FOREIGN KEY `documents_category_id_categories_id_fk`;
--> statement-breakpoint
ALTER TABLE `documents` DROP FOREIGN KEY `documents_uploaded_by_users_id_fk`;
--> statement-breakpoint
DROP INDEX `documents_type_idx` ON `documents`;--> statement-breakpoint
ALTER TABLE `documents` MODIFY COLUMN `file_url` varchar(1000);--> statement-breakpoint
ALTER TABLE `documents` MODIFY COLUMN `file_type` varchar(20);--> statement-breakpoint
ALTER TABLE `documents` MODIFY COLUMN `status` enum('published','draft','archived') NOT NULL DEFAULT 'published';--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `type` varchar(50) DEFAULT 'text';--> statement-breakpoint
ALTER TABLE `documents` ADD `external_url` varchar(1000);--> statement-breakpoint
ALTER TABLE `documents` ADD `year` int;--> statement-breakpoint
ALTER TABLE `documents` ADD `tags` varchar(500);--> statement-breakpoint
ALTER TABLE `documents` ADD `created_by` varchar(36);--> statement-breakpoint
CREATE INDEX `documents_category_idx` ON `documents` (`category_id`);--> statement-breakpoint
CREATE INDEX `documents_year_idx` ON `documents` (`year`);--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `file_name`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `type`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `is_public`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `published_at`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `uploaded_by`;