export interface EncryptedSecretType {
  id: string;
  encryptedKey: string;
  encryptedValue: string;
}

export interface DecryptedSecretType {
  id: string;
  key: string;
  value: string;
}
