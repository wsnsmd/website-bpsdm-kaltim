CREATE TABLE `survey_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rating_tampilan` tinyint NOT NULL,
	`rating_kemudahan` tinyint NOT NULL,
	`rating_konten` tinyint NOT NULL,
	`rating_kecepatan` tinyint NOT NULL,
	`rating_layanan` tinyint NOT NULL,
	`rating_rata` decimal(3,2),
	`komentar` text,
	`saran` text,
	`ip_address` varchar(45),
	`user_agent` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `survey_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `survey_created_at_idx` ON `survey_responses` (`created_at`);