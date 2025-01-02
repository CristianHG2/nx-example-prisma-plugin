import { PromiseExecutor } from '@nx/devkit';
import { ResetExecutorSchema } from './schema';
import { runPkgCmd, verifyPrismaPkg } from '../../lib';

const runExecutor: PromiseExecutor<ResetExecutorSchema> = async (
  options,
  ctx
) => {
  if (
    !verifyPrismaPkg(ctx) ||
    !runPkgCmd('prisma migrate reset --force', options.cwd)
  ) {
    return { success: false };
  }

  return { success: true };
};

export default runExecutor;