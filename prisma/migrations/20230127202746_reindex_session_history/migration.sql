-- DropIndex
DROP INDEX `SessionHistory_fingerprint_idx` ON `SessionHistory`;

-- DropIndex
DROP INDEX `SessionHistory_userId_idx` ON `SessionHistory`;

-- CreateIndex
CREATE INDEX `SessionHistory_id_userId_fingerprint_idx` ON `SessionHistory`(`id`, `userId`, `fingerprint`);
