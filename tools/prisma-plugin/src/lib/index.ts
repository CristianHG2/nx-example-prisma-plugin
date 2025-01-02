import { getProjects, Tree } from '@nx/devkit';

export * from './relative-path';
export * from './schema-parse';
export * from './paths';
export * from './run-pkg-cmd';
export * from './fix-pkg-json';

export function getProject(tree: Tree, projectName: string) {
  const project = getProjects(tree).get(projectName);

  if (!project) {
    throw new Error(`Project ${projectName} not found`);
  }

  return project;
}