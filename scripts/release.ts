import process from 'node:process';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import fg from 'fast-glob';

async function updateTemplateVersion() {
  const cwd = process.cwd();

  const globs = fg.sync(path.join(cwd, 'packages/create-ohh/template-*/package.json'));

  const pkgJson = await readFile(path.join(cwd, 'package.json'), 'utf-8');

  const { version: newVersion } = JSON.parse(pkgJson);

  const pkgVersionReg = /"version": "\d+\.\d+\.\d+(-(beta|alpha)\.\d+)?"/;

  const ohhJsCliVersionReg = /"@ohhjs\/cli": "\d+\.\d+\.\d+(-(beta|alpha)\.\d+)?"/;

  for await (const glob of globs) {
    const json = await readFile(glob, 'utf-8');

    const newPkgJson = json
      .replace(pkgVersionReg, `"version": "0.0.0"`)
      .replace(ohhJsCliVersionReg, `"@ohh/cli": "${newVersion}"`);

    await writeFile(glob, newPkgJson);
  }
}

updateTemplateVersion();
