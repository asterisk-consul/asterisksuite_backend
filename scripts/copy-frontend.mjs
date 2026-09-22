import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'frontend', '.output', 'public');
const dest = join(root, 'public');

if (!existsSync(src)) {
  console.error(
    `No existe el build del frontend en "${src}".\n` +
      'Corré primero: pnpm run frontend:build',
  );
  process.exit(1);
}

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

console.log(`Frontend copiado a "${dest}".`);
