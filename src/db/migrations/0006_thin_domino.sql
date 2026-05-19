CREATE TABLE `visitor_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(64) NOT NULL,
	`path` varchar(500),
	`ip` varchar(64),
	`user_agent` varchar(500),
	`referer` varchar(500),
	`country` varchar(10),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `visitor_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitor_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`unique_visitors` int DEFAULT 0,
	`page_views` int DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visitor_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `vs_date_idx` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE INDEX `vl_session_idx` ON `visitor_logs` (`session_id`);--> statement-breakpoint
CREATE INDEX `vl_created_idx` ON `visitor_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `vl_path_idx` ON `visitor_logs` (`path`);