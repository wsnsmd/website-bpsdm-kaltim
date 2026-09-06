CREATE TABLE `ppid_keberatan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`permohonan_id` int,
	`kode_permohonan` varchar(50) NOT NULL,
	`nama_pemohon` varchar(255) NOT NULL,
	`nik` varchar(20) NOT NULL,
	`email` varchar(255) NOT NULL,
	`no_hp` varchar(30),
	`alamat` text,
	`alasan_keberatan` json NOT NULL,
	`dikuasakan` boolean DEFAULT false,
	`nama_kuasa` varchar(255),
	`uraian_keberatan` text NOT NULL,
	`surat_keberatan_url` varchar(1000) NOT NULL,
	`nomor_keberatan` varchar(50),
	`status` enum('diterima','diproses','selesai','ditolak','diteruskan_ki') NOT NULL DEFAULT 'diterima',
	`catatan` text,
	`jawaban_url` varchar(1000),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`selesai_at` timestamp,
	CONSTRAINT `ppid_keberatan_id` PRIMARY KEY(`id`),
	CONSTRAINT `ppid_kbr_nomor_idx` UNIQUE(`nomor_keberatan`)
);
--> statement-breakpoint
ALTER TABLE `ppid_permohonan` MODIFY COLUMN `cara_mendapat` enum('email','ambil_langsung','pos','faksimili') NOT NULL DEFAULT 'email';--> statement-breakpoint
ALTER TABLE `ppid_permohonan` ADD `kategori_pemohon` enum('perorangan','badan_hukum') DEFAULT 'perorangan' NOT NULL;--> statement-breakpoint
ALTER TABLE `ppid_permohonan` ADD `nama_instansi` varchar(255);--> statement-breakpoint
ALTER TABLE `ppid_permohonan` ADD `ktp_url` varchar(1000);--> statement-breakpoint
ALTER TABLE `ppid_permohonan` ADD `cara_memperoleh_info` enum('melihat','membaca','mendengarkan','mencatat');--> statement-breakpoint
CREATE INDEX `ppid_kbr_status_idx` ON `ppid_keberatan` (`status`);--> statement-breakpoint
CREATE INDEX `ppid_kbr_email_idx` ON `ppid_keberatan` (`email`);