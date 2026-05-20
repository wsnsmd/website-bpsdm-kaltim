CREATE TABLE `gallery_albums` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`cover_image` varchar(1000),
	`type` enum('photo','video') NOT NULL DEFAULT 'photo',
	`is_published` boolean DEFAULT true,
	`sort_order` int DEFAULT 0,
	`created_by` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_albums_id` PRIMARY KEY(`id`),
	CONSTRAINT `gallery_albums_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `gallery_albums_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `gallery_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`album_id` int NOT NULL,
	`image_url` varchar(1000) NOT NULL,
	`thumb_url` varchar(1000),
	`caption` varchar(500),
	`width` int,
	`height` int,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery_videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`album_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`source_type` enum('youtube','instagram') NOT NULL,
	`source_url` varchar(1000) NOT NULL,
	`video_id` varchar(100),
	`thumb_url` varchar(1000),
	`duration` varchar(20),
	`sort_order` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `gallery_photos` ADD CONSTRAINT `gallery_photos_album_id_gallery_albums_id_fk` FOREIGN KEY (`album_id`) REFERENCES `gallery_albums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery_videos` ADD CONSTRAINT `gallery_videos_album_id_gallery_albums_id_fk` FOREIGN KEY (`album_id`) REFERENCES `gallery_albums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `gallery_albums_type_idx` ON `gallery_albums` (`type`);