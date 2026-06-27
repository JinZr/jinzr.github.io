import { cp, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const dist = join(root, 'dist');
const deployEntries = [
  '.nojekyll',
  'assets',
  'favicon.webp',
  'icons',
  'index.html',
  'manifest.json',
  'site-assets',
];

for (const entry of deployEntries) {
  await rm(join(root, entry), { force: true, recursive: true });
}

for (const entry of await readdir(dist)) {
  await cp(join(dist, entry), join(root, entry), { recursive: true });
}

await writeFile(join(root, '.nojekyll'), '');
