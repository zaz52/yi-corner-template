import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, stat, cp } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const world = resolve(root, 'world');
const manifest = JSON.parse(await readFile(resolve(world, 'asset-manifest.json'), 'utf8'));
const sha256 = data => createHash('sha256').update(data).digest('hex');

async function ensureAsset(asset) {
  const target = resolve(world, 'static', asset.path);
  if (!target.startsWith(resolve(world, 'static') + sep)) throw new Error('Invalid asset path');
  try {
    if (sha256(await readFile(target)) === asset.sha256) return;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const url = `https://raw.githubusercontent.com/brunosimon/folio-2025/${manifest.revision}/static/${asset.path.split('/').map(encodeURIComponent).join('/')}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(90000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${asset.path}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length !== asset.size || sha256(bytes) !== asset.sha256) throw new Error(`Checksum mismatch: ${asset.path}`);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, bytes);
      return;
    } catch (error) { if (attempt === 2) throw error; }
  }
}

let cursor = 0;
await Promise.all(Array.from({ length: 12 }, async () => {
  while (cursor < manifest.files.length) await ensureAsset(manifest.files[cursor++]);
}));
console.log(`Verified ${manifest.files.length} pinned scene assets`);

function run(args, cwd, env = {}) {
  const result = spawnSync(process.execPath, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
try { await stat(resolve(world, 'node_modules/vite/bin/vite.js')); }
catch {
  const npm = process.env.npm_execpath;
  if (!npm) throw new Error('Run this build through npm run build');
  run([npm, 'ci', '--legacy-peer-deps', '--ignore-scripts'], world);
}
run(['scripts/check-sites.mjs'], world);
// Asset copying is explicit so WAV production masters never enter the deployment.
run(['node_modules/vite/bin/vite.js', 'build', '--mode', 'production'], world, {
  YI_BUNDLE_CHECK: '1', VITE_COMPRESSED: '1', VITE_DAY_CYCLE_PROGRESS: '0.24',
  VITE_YEAR_CYCLE_PROGRESS: '0.25', VITE_MUSIC: '1', VITE_GAME_PUBLIC: '1', VITE_LOG: ''
});
const output = resolve(root, 'dist/world');
await cp(resolve(world, 'dist'), output, { recursive: true });
cursor = 0;
await Promise.all(Array.from({ length: 12 }, async () => {
  while (cursor < manifest.files.length) {
    const asset = manifest.files[cursor++];
    const target = resolve(output, asset.path);
    await mkdir(dirname(target), { recursive: true });
    await cp(resolve(world, 'static', asset.path), target);
  }
}));
await writeFile(resolve(output, 'license.txt'), await readFile(resolve(world, 'license.md')));
console.log('3D world ready in dist/world');
