import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.AUTH_SECRET || 'default-key-for-dev-only-min-32-chars';

export function encryptToken(data: object): string {
  const jsonStr = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonStr, ENCRYPTION_KEY).toString();
}

export function decryptToken<T = unknown>(encrypted: string): T {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  const jsonStr = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonStr) as T;
}
