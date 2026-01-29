CREATE DATABASE IF NOT EXISTS matching;

USE matching;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `featured_tutor`,
                     `tutor_availability`,
                     `tutor_subject`,
                     `tutor_field`,
                     `subject`,
                     `subject_group`,
                     `language_field`,
                     `review`,
                     `payment`,
                     `refresh_token`,
                     `booking`,
                     `lesson`,
                     `persistent_logins`,
                     `tutor_profile`,
                     `user_auth`,
                     `users`,
                     `tutor_career`,
                     `tutor_education`,
                     `tutor_time_range`,
                     `tutor_document`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `username` VARCHAR(64) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `nickname` VARCHAR(64) NOT NULL UNIQUE,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`)
);

CREATE TABLE `user_auth` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `auth` VARCHAR(64) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tutor_profile` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL UNIQUE,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `profile_img` VARCHAR(255) NULL,
    `headline` VARCHAR(100) NULL,
    `bio` TEXT NULL,
    `video_url` VARCHAR(255) NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `rating_avg` DECIMAL(3, 2) NOT NULL DEFAULT 0.0,
    `review_count` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
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

CREATE TABLE `subject_group` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `name` VARCHAR(64) NOT NULL,
    `seq` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_name` (`name`)
);

CREATE TABLE `language_field` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `name` VARCHAR(64) NOT NULL,
    `category` ENUM('GENERAL', 'DOMAIN') NOT NULL,
    `seq` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_category` (`category`),
    INDEX `idx_name` (`name`)
);

CREATE TABLE `tutor_field` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `field_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `seq` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_field_id` (`field_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`field_id`) REFERENCES `language_field`(`id`) ON DELETE CASCADE
);

CREATE TABLE `subject` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
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

CREATE TABLE `lesson` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `subject_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('OPEN', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_subject_id` (`subject_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tutor_availability` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `start_at` DATETIME NOT NULL,
    `end_at` DATETIME NOT NULL,
    `status` ENUM('OPEN', 'BOOKED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_start_at` (`start_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `booking` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
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
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`availability_id`) REFERENCES `tutor_availability`(`id`) ON DELETE CASCADE
);

CREATE TABLE `payment` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `booking_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `amount` DECIMAL(10, 2) NOT NULL,
    `provider` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NULL,
    `paid_at` DATETIME NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_booking_id` (`booking_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id`) ON DELETE CASCADE
);

CREATE TABLE `review` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
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

CREATE TABLE `tutor_subject` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `subject_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `seq` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    UNIQUE KEY `uk_user_subject` (`user_id`, `subject_id`),
    INDEX `idx_subject_id` (`subject_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE CASCADE
);

CREATE TABLE `featured_tutor` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `seq` INT NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_visible_seq` (`visible`, `seq`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tutor_career` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `company_name` VARCHAR(64) NOT NULL,
    `job_category` VARCHAR(64) NOT NULL,
    `job_role` VARCHAR(64) NOT NULL,
    `start_year` DATE NOT NULL,
    `end_year` DATE NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tutor_education` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `school_name` VARCHAR(64) NOT NULL,
    `degree` VARCHAR(64) NOT NULL,
    `start_year` DATE NOT NULL,
    `graduated_year` DATE NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tutor_time_range` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `start_at` TIME NOT NULL,
    `end_at` TIME NOT NULL,
    `day_of_week` ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN') NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tutor_document` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `doc_type` VARCHAR(64) NOT NULL,
    `file_size` INT NOT NULL,
    `reviewed_by` VARCHAR(64) NULL,
    `reviewed_at` DATETIME NULL,
    `reject_reason` TEXT NULL,
    `original_name` VARCHAR(100) NULL,
    `store_name` VARCHAR(100) NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `content_type` VARCHAR(64) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `refresh_token` (
    `no` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `id` VARCHAR(64) NOT NULL UNIQUE,
    `token_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `revoked_at` DATETIME NULL,
    `user_agent` VARCHAR(255) NULL,
    `ip` VARCHAR(64) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`no`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_expires_at` (`expires_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);