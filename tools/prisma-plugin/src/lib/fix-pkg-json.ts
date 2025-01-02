import {
  ExecutorContext,
  logger,
  readJsonFile,
  workspaceRoot,
} from '@nx/devkit';
import fs from 'node:fs';

export const verifyPrismaPkg = (ctx: ExecutorContext): boolean => {
  const prismaPackage = `${workspaceRoot}/packages/prisma/${ctx.projectName}-prisma/package.json`;

  if (!fs.existsSync(prismaPackage)) {
    logger.error(
      `Prisma package not found at ${prismaPackage}, please run \`nx g @janus/prisma-plugin:configuration\` first`
    );
    return false;
  }

  return true;
};

export const fixPkgJson = (ctx: ExecutorContext): void => {
  const prismaPackage = `${workspaceRoot}/packages/prisma/${ctx.projectName}-prisma/package.json`;

  const packageJson = readJsonFile(prismaPackage);
  packageJson.name = `@janus/${ctx.projectName}-prisma`;

  fs.writeFileSync(prismaPackage, JSON.stringify(packageJson, null, 2));
  logger.info(`Updated package.json name to @janus/${ctx.projectName}-prisma`);
};