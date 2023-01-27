-- CreateTable
CREATE TABLE `SessionHistory` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NULL,
    `os` JSON NULL,
    `device` JSON NULL,
    `client` JSON NULL,
    `bot` JSON NULL,
    `city` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SessionHistory_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
