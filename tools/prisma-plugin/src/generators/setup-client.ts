import {
  formatFiles,
  installPackagesTask,
  logger,
  readJson,
  Tree,
} from '@nx/devkit';
import { SetupClientGeneratorSchema } from './schema';
import {
  getPaths,
  getProject,
  getRelativePath,
  updatePrismaOutputPath,
} from '../lib';
import { libraryGenerator } from '@nx/js';

export async function setupClientGenerator(
  tree: Tree,
  options: SetupClientGeneratorSchema
) {
  const targetProject = getProject(tree, options.project);
  const {
    prismaSchemaPath,
    clientPkgRoot,
    absoluteClientPkgRoot,
    packageJsonPath,
    absolutePrismaSchemaPath,
  } = getPaths(tree, targetProject);

  const fileContents = tree.read(prismaSchemaPath)?.toString();

  if (!fileContents) {
    throw new Error(`Prisma file not found or empty at ${prismaSchemaPath}`);
  }

  await libraryGenerator(tree, {
    directory: clientPkgRoot,
    name: `${targetProject.name}-prisma`,
    minimal: true,
    unitTestRunner: 'none',
    linter: 'none',
  });

  logger.info(`Added project configuration for ${targetProject.name}-prisma`);

  const contents = updatePrismaOutputPath(
    fileContents as string,
    getRelativePath(
      absolutePrismaSchemaPath.split('/').slice(0, -1).join('/'),
      absoluteClientPkgRoot
    )
  );

  tree.write(prismaSchemaPath, contents);

  logger.info(`Updated Prisma schema output path to ${clientPkgRoot}`);

  const prismaPkgScope = `@janus/${targetProject.name}-prisma`;
  const packageJson = readJson(tree, packageJsonPath);
  const newPackageJson = {
    ...packageJson,
    dependencies: {
      ...packageJson.dependencies,
      [prismaPkgScope]: `workspace:*`,
    },
  };

  tree.write(packageJsonPath, JSON.stringify(newPackageJson, null, 2));

  logger.log(
    `Added prisma:generate script and dependency to ${packageJsonPath}`
  );

  installPackagesTask(tree, true);

  await formatFiles(tree);

  logger.info('Done');
}

export default setupClientGenerator;