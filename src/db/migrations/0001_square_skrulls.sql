ALTER TABLE `users` DROP INDEX `users_email_idx`;--> statement-breakpoint
DROP INDEX `users_sso_idx` ON `users`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email_verified` boolean;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email_verified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `sub` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `given_name` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `family_name` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `authentik_groups` text;--> statement-breakpoint
ALTER TABLE `users` ADD `role` enum('superadmin','admin','editor','viewer') DEFAULT 'viewer' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `last_login_at` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_sub_idx` UNIQUE(`sub`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_username_idx` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `nip`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `sso_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `sso_provider`;