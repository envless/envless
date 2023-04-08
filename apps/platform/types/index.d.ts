export interface EnvSecret {
  id?: string;
  encryptedKey: string;
  encryptedValue: string;
  maskedValue: string;
  decryptedKey: string;
  decryptedValue: string;
  hidden: boolean;
}
