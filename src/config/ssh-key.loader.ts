import * as fs from 'fs';

/**
 * Resuelve la clave privada SSH desde:
 *  - SSH_PRIVATE_KEY (contenido inline, con \n escapados)
 *  - SSH_PRIVATE_KEY_PATH (ruta a un archivo montado)
 */
export function resolveSshPrivateKey(): string | undefined {
  const inline = process.env.SSH_PRIVATE_KEY;
  if (inline && inline.trim().length > 0) {
    return inline.replace(/\\n/g, '\n');
  }

  const keyPath = process.env.SSH_PRIVATE_KEY_PATH;
  if (keyPath && fs.existsSync(keyPath)) {
    return fs.readFileSync(keyPath, 'utf8');
  }

  return undefined;
}
