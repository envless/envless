export interface EncryptedSecretType {
  id: string;
  encryptedKey: string;
  encryptedValue: string;
  uuid?: string;
}

export interface DecryptedSecretType {
  id: string;
  key: string;
  value: string;
  uuid?: string;
}
