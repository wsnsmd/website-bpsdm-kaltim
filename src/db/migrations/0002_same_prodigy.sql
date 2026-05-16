DROP INDEX `programs_type_idx` ON `programs`;--> statement-breakpoint
ALTER TABLE `programs` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `programs` MODIFY COLUMN `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `programs` MODIFY COLUMN `status` enum('active','inactive') NOT NULL DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `programs` MODIFY COLUMN `is_highlight` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `programs` ADD `jenis_key` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `programs` ADD `icon` varchar(100);--> statement-breakpoint
ALTER TABLE `programs` ADD `color` varchar(50);--> statement-breakpoint
ALTER TABLE `programs` ADD `target` text;--> statement-breakpoint
CREATE INDEX `programs_jenis_idx` ON `programs` (`jenis_key`);--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `prerequisites`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `type`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `level`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `duration_days`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `duration_hours`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `max_participants`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `featured_image`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `brochure_url`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `meta_title`;--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `meta_description`;