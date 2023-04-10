export interface EnvSecret {
  id?: string;
  encryptedKey: string;
  encryptedValue: string;
  hiddenValue: string;
  decryptedKey: string;
  decryptedValue: string;
  hidden: boolean;
}
