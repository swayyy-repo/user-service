// encryption and decryption

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { ENCRYPTION_KEY, ENCRYPTION_SALT } from '../constants';
import { promisify } from 'util';

const getKey = async () => {
  const key = (await promisify(scrypt)(
    ENCRYPTION_KEY,
    ENCRYPTION_SALT,
    32,
  )) as Buffer;
  return key;
};

export const string_encryption = async (textToEncrypt: string) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-ctr', await getKey(), iv);
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);
  const encryptedDataWithIV = Buffer.concat([iv, encryptedText]);
  return encryptedDataWithIV.toString('base64');
};

export const string_decryption = async (encryptedText: String) => {
  const buffer = Buffer.from(encryptedText, 'base64')
  const iv = buffer.slice(0, 16); 
  const encryptedData = buffer.slice(16);
  const decipher = createDecipheriv('aes-256-ctr', await getKey(), iv);
  const decryptedText = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  return decryptedText.toString('utf8');
};
