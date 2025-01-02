import { execSync } from 'node:child_process';
import { getPackageManagerCommand, logger } from '@nx/devkit';
import * as process from 'node:process';

export const runPkgCmd = (cmd: string, cwd: string): boolean => {
  const ogCwd = process.cwd();
  process.chdir(cwd);

  try {
    execSync(`${getPackageManagerCommand().exec} ${cmd}`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  } finally {
    process.chdir(ogCwd);
  }
};