-- CreateTable
CREATE TABLE `ProjectInvite` (
    `email` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectInvite_projectId_idx`(`projectId`),
    UNIQUE INDEX `ProjectInvite_email_projectId_key`(`email`, `projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
