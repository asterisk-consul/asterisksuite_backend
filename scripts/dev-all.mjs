import { spawn } from 'node:child_process';

const children = [];
let shuttingDown = false;

function run(args) {
  const child = spawn('pnpm', args, { stdio: 'inherit', shell: true });
  children.push(child);

  child.on('exit', (code) => {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const c of children) {
      if (c !== child) c.kill();
    }
    process.exit(code ?? 0);
  });

  return child;
}

function shutdown() {
  shuttingDown = true;
  for (const c of children) {
    c.kill();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Iniciando backend (:3000) y frontend (:3008)...');
run(['start:dev']);
run(['-C', 'frontend', 'dev']);
