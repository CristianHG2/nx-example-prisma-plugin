import { ExecutorContext } from '@nx/devkit';
import { GenerateExecutorSchema } from './schema';
import { fixPkgJson, runPkgCmd, verifyPrismaPkg } from '../../lib';

const runGenerateExecutor = async (
  _options: GenerateExecutorSchema,
  context: ExecutorContext
) => {
  if (
    !verifyPrismaPkg(context) ||
    !runPkgCmd('prisma generate', _options.cwd)
  ) {
    return { success: false };
  }

  fixPkgJson(context);

  return { success: true };
};

export default runGenerateExecutor;