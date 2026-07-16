const { spawnSync } = require('node:child_process');
const path = require('node:path');

const binPath = path.join(__dirname, '..', 'node_modules', '.bin');
const isWindows = process.platform === 'win32';
const command = path.join(binPath, isWindows ? 'prisma.cmd' : 'prisma');
const result = spawnSync(command, process.argv.slice(2), {
  env: { ...process.env, PATH: `${binPath}${path.delimiter}${process.env.PATH ?? ''}` },
  shell: isWindows,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
