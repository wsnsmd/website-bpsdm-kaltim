CREATE TABLE `platforms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`url` varchar(500),
	`icon` varchar(100),
	`logo` varchar(500),
	`color` varchar(50) DEFAULT '#0e3d20',
	`category` varchar(100),
	`is_highlight` boolean DEFAULT false,
	`is_active` boolean DEFAULT true,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platforms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `platforms_category_idx` ON `platforms` (`category`);--> statement-breakpoint
CREATE INDEX `platforms_highlight_idx` ON `platforms` (`is_highlight`);--> statement-breakpoint
CREATE INDEX `platforms_active_idx` ON `platforms` (`is_active`);