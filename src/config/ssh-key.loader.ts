import * as dotenv from 'dotenv';

dotenv.config();

export function loadSSHKey() {
  if (!process.env.SSH_PRIVATE_KEY) {
    throw new Error('Missing SSH_PRIVATE_KEY env variable');
  }
}
