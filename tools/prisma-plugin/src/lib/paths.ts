import { ProjectConfiguration, Tree, workspaceRoot } from '@nx/devkit';
import path from 'path';

export const getPaths = (tree: Tree, project: ProjectConfiguration) => {
  const targetProjectRoot = project.root;
  const projectPath = (path: string) => `${targetProjectRoot}/${path}`;
  const absolutePath = (_path: string) =>
    path.resolve(`${workspaceRoot}/${_path}`);

  const prismaSchemaPath = projectPath('prisma/schema/schema.prisma');
  const clientPkgRoot = `packages/prisma/${project.name}-prisma`;

  const absoluteClientPkgRoot = absolutePath(clientPkgRoot);
  const absolutePrismaSchemaPath = absolutePath(prismaSchemaPath);

  return {
    prismaSchemaPath,
    clientPkgRoot,
    absoluteClientPkgRoot,
    absolutePrismaSchemaPath,
    packageJsonPath: projectPath('package.json'),
    absoluteProjectRoot: absolutePath(targetProjectRoot),
  };
};