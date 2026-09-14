CREATE TABLE `sira_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`program_id` int NOT NULL,
	`kode` text NOT NULL,
	`nama` text NOT NULL,
	`level` tinyint NOT NULL DEFAULT 1,
	`pagu` bigint NOT NULL DEFAULT 0,
	`realisasi_keuangan` bigint NOT NULL DEFAULT 0,
	`persen_keuangan` decimal(5,2) NOT NULL DEFAULT '0.00',
	`sisa_pagu` bigint NOT NULL DEFAULT 0,
	`persen_fisik` decimal(5,2) NOT NULL DEFAULT '0.00',
	`paket_rup` smallint NOT NULL DEFAULT 0,
	`jumlah_sp2d` smallint NOT NULL DEFAULT 0,
	CONSTRAINT `sira_activities_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_activity` UNIQUE(`program_id`,`kode`)
);
--> statement-breakpoint
CREATE TABLE `sira_programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`summary_id` int NOT NULL,
	`kode_program` text NOT NULL,
	`nama_program` text NOT NULL,
	`pagu` bigint NOT NULL DEFAULT 0,
	`realisasi_keuangan` bigint NOT NULL DEFAULT 0,
	`persen_keuangan` decimal(5,2) NOT NULL DEFAULT '0.00',
	`sisa_pagu` bigint NOT NULL DEFAULT 0,
	`persen_fisik` decimal(5,2) NOT NULL DEFAULT '0.00',
	`pagu_penyedia` bigint NOT NULL DEFAULT 0,
	`pagu_non_penyedia` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `sira_programs_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_program` UNIQUE(`summary_id`,`kode_program`)
);
--> statement-breakpoint
CREATE TABLE `sira_summary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tahun` year NOT NULL DEFAULT 2026,
	`periode_bulan` tinyint NOT NULL DEFAULT 9,
	`pagu_total` bigint NOT NULL DEFAULT 0,
	`realisasi_keuangan` bigint NOT NULL DEFAULT 0,
	`persen_keuangan` decimal(5,2) NOT NULL DEFAULT '0.00',
	`sisa_pagu` bigint NOT NULL DEFAULT 0,
	`persen_fisik` decimal(5,2) NOT NULL DEFAULT '0.00',
	`pagu_penyedia` bigint NOT NULL DEFAULT 0,
	`pagu_non_penyedia` bigint NOT NULL DEFAULT 0,
	`peringkat_skpd` tinyint,
	`total_skpd` smallint,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sira_summary_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_periode` UNIQUE(`tahun`,`periode_bulan`)
);
