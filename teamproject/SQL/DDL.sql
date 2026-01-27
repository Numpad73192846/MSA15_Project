CREATE DATABASE IF NOT EXISTS matching;

USE matching;

DROP TABLE IF EXISTS `featured_tuter`, 
                     `tuter_availability`, 
                     `tutor_subject`, 
                     `subject`, 
                     `subject_group`, 
                     `review`, 
                     `payment`, 
                     `booking`, 
                     `lesson`, 
                     `persistent_logins`, 
                     `tuter_profile`, 
                     `user_auth`, 
                     `user`;

CREATE TABLE `user` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`username` VARCHAR(64) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
	`name` VARCHAR(64) NOT NULL,
	`status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_id` (`id`),
	INDEX `idx_username` (`username`)
);

CREATE TABLE `user_auth` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`user_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`auth` VARCHAR(64) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_user_id` (`user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tuter_profile` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`user_id` VARCHAR(64) NOT NULL UNIQUE,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`profile_img` VARCHAR(255) NULL,
	`headline` VARCHAR(100) NULL,
	`bio` TEXT NULL,
	`rating_avg` DECIMAL(3, 2) NOT NULL DEFAULT 0.0,
	`review_count` INT NOT NULL DEFAULT 0,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `persistent_logins` (
	`series` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`username` VARCHAR(64) NOT NULL,
	`token` VARCHAR(255) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`series`),
	INDEX `idx_username` (`username`)
);

CREATE TABLE `lesson` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`user_id` VARCHAR(64) NOT NULL,
	`subject_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`title` VARCHAR(100) NOT NULL,
	`description` TEXT NULL,
	`status` VARCHAR(20) NOT NULL DEFAULT 'OPEN',
	`price` INT NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_user_id` (`user_id`),
	INDEX `idx_subject_id` (`subject_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `booking` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`user_id` VARCHAR(64) NOT NULL,
	`lesson_id` VARCHAR(64) NOT NULL,
	`availability_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`title` VARCHAR(100) NOT NULL,
	`requested_at` DATETIME NOT NULL,
	`confirmed_at` DATETIME NULL,
	`canceled_at` DATETIME NULL,
	`done_at` DATETIME NULL,
	`memo` VARCHAR(255) NULL,
	PRIMARY KEY (`no`),
	INDEX `idx_user_id` (`user_id`),
	INDEX `idx_lesson_id` (`lesson_id`),
	INDEX `idx_availability_id` (`availability_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON DELETE CASCADE
);

CREATE TABLE `payment` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`user_id` VARCHAR(64) NOT NULL,
	`booking_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`amount` INT NOT NULL,
	`provider` VARCHAR(20) NOT NULL,
	`status` VARCHAR(20) NULL,
	`paid_at` DATETIME NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_user_id` (`user_id`),
	INDEX `idx_booking_id` (`booking_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id`) ON DELETE CASCADE
);

CREATE TABLE `review` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`booking_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`rating` TINYINT NULL,
	`content` TEXT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_booking_id` (`booking_id`),
	FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id`) ON DELETE CASCADE
);

CREATE TABLE `subject_group` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`name` VARCHAR(64) NOT NULL,
	`seq` INT NOT NULL DEFAULT 0,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_name` (`name`)
);

CREATE TABLE `subject` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`group_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`name` VARCHAR(64) NOT NULL,
	`seq_in_group` INT NOT NULL DEFAULT 0,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_group_id` (`group_id`),
	INDEX `idx_name` (`name`),
	FOREIGN KEY (`group_id`) REFERENCES `subject_group`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tutor_subject` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`user_id` VARCHAR(64) NOT NULL,
	`subject_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`seq` INT NOT NULL DEFAULT 0,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	UNIQUE KEY `uk_user_subject` (`user_id`, `subject_id`),
	INDEX `idx_subject_id` (`subject_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tuter_availability` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`user_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`start_at` DATETIME NOT NULL,
	`end_at` DATETIME NOT NULL,
	`status` VARCHAR(20) NOT NULL DEFAULT 'OPEN',
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_user_id` (`user_id`),
	INDEX `idx_start_at` (`start_at`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);



CREATE TABLE `featured_tuter` (
	`no` INT AUTO_INCREMENT NOT NULL,
	`user_id` VARCHAR(64) NOT NULL,
	`id` VARCHAR(64) NOT NULL UNIQUE,
	`seq` INT NOT NULL DEFAULT 0,
	`visible` TINYINT(1) NOT NULL DEFAULT 1,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`no`),
	INDEX `idx_user_id` (`user_id`),
	INDEX `idx_visible_seq` (`visible`, `seq`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
