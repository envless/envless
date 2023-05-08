export interface EnvSecret {
  id?: string;
  uuid: string;
  encryptedKey: string;
  encryptedValue: string;
  hiddenValue: string;
  decryptedKey: string;
  decryptedValue: string;
  hidden: boolean;
}

export interface PrHistory {
  id?: string;
  prId?: string;
  encryptedKey: string;
  encryptedValue: string;
  decryptedKey: string;
  decryptedValue: string;
}
