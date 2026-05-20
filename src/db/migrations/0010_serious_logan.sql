CREATE INDEX `posts_status_published_idx` ON `posts` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `posts_category_status_idx` ON `posts` (`category_id`,`status`);