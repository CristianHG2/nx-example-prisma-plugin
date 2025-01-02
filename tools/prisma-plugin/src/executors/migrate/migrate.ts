import { PromiseExecutor } from '@nx/devkit';
import { MigrateExecutorSchema } from './schema';
import { fixPkgJson, runPkgCmd, verifyPrismaPkg } from '../../lib';

const runExecutor: PromiseExecutor<MigrateExecutorSchema> = async (
  options,
  ctx
) => {
  if (!verifyPrismaPkg(ctx) || !runPkgCmd('prisma migrate dev', options.cwd)) {
    return { success: false };
  }

  fixPkgJson(ctx);

  return {
    success: true,
  };
};

export default runExecutor;