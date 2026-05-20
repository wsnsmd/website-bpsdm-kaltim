CREATE TABLE `ppid_informasi` (
	`id` int AUTO_INCREMENT NOT NULL,
	`judul` varchar(500) NOT NULL,
	`deskripsi` text,
	`tipe` enum('berkala','serta_merta','setiap_saat','dikecualikan') NOT NULL,
	`file_url` varchar(1000),
	`external_url` varchar(1000),
	`file_type` varchar(20),
	`file_size` int,
	`tahun` int,
	`status` enum('published','draft') NOT NULL DEFAULT 'published',
	`sort_order` int DEFAULT 0,
	`created_by` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ppid_informasi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ppid_pejabat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`jabatan` varchar(255) NOT NULL,
	`foto` varchar(500),
	`email` varchar(255),
	`no_hp` varchar(30),
	`tipe` enum('utama','pembantu','atasan') NOT NULL DEFAULT 'pembantu',
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	CONSTRAINT `ppid_pejabat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ppid_permohonan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama_pemohon` varchar(255) NOT NULL,
	`nik` varchar(20),
	`email` varchar(255) NOT NULL,
	`no_hp` varchar(30),
	`alamat` text,
	`pekerjaan` varchar(100),
	`subjek_info` varchar(500) NOT NULL,
	`deskripsi_info` text NOT NULL,
	`tujuan_info` text,
	`cara_mendapat` enum('email','ambil_langsung','pos') NOT NULL DEFAULT 'email',
	`cara_media` enum('softcopy','hardcopy','keduanya') NOT NULL DEFAULT 'softcopy',
	`nomor_permohonan` varchar(50),
	`status` enum('diterima','diproses','selesai','ditolak','banding') NOT NULL DEFAULT 'diterima',
	`catatan` text,
	`jawaban_url` varchar(1000),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`selesai_at` timestamp,
	CONSTRAINT `ppid_permohonan_id` PRIMARY KEY(`id`),
	CONSTRAINT `ppid_perm_nomor_idx` UNIQUE(`nomor_permohonan`)
);
--> statement-breakpoint
CREATE INDEX `ppid_tipe_idx` ON `ppid_informasi` (`tipe`);--> statement-breakpoint
CREATE INDEX `ppid_status_idx` ON `ppid_informasi` (`status`);--> statement-breakpoint
CREATE INDEX `ppid_perm_status_idx` ON `ppid_permohonan` (`status`);--> statement-breakpoint
CREATE INDEX `ppid_perm_email_idx` ON `ppid_permohonan` (`email`);