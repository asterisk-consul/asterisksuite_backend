import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export function loadSSHKey() {
    if (process.env.SSH_PRIVATE_KEY) {
        return;
    }

    if (process.env.SSH_PRIVATE_KEY_PATH) {
        const keyPath = path.resolve(process.env.SSH_PRIVATE_KEY_PATH);

        if (!fs.existsSync(keyPath)) {
            throw new Error(`SSH key not found at: ${keyPath}`);
        }

        const key = fs.readFileSync(keyPath, 'utf8');
        process.env.SSH_PRIVATE_KEY = key;
        return;
    }

    throw new Error('Missing SSH_PRIVATE_KEY or SSH_PRIVATE_KEY_PATH');
}
