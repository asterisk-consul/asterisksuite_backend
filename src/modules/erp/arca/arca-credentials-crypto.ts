import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { InternalServerErrorException } from '@nestjs/common';

export type EncryptedValue = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

function encryptionKey() {
  const value = process.env.ARCA_CREDENTIALS_ENCRYPTION_KEY?.trim();
  if (!value || !/^[a-f\d]{64}$/i.test(value)) {
    throw new InternalServerErrorException(
      'Falta configurar ARCA_CREDENTIALS_ENCRYPTION_KEY como una clave hexadecimal de 64 caracteres.',
    );
  }
  return Buffer.from(value, 'hex');
}

export function encryptArcaSecret(plainText: string): EncryptedValue {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex'),
  };
}

export function decryptArcaSecret(value: EncryptedValue): string {
  try {
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(value.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(value.authTag, 'hex'));
    return Buffer.concat([
      decipher.update(Buffer.from(value.ciphertext, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    throw new InternalServerErrorException(
      'No se pudieron descifrar las credenciales de ARCA. Revisá la clave de cifrado configurada en el backend.',
    );
  }
}
