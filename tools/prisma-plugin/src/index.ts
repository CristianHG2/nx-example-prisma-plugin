import {
  createNodesFromFiles,
  CreateNodesV2,
} from 'nx/src/project-graph/plugins';
import { readJsonFile } from '@nx/devkit';
import { dirname } from 'path';
import * as fs from 'node:fs';

export const createNodesV2: CreateNodesV2 = [
  '**/package.json',
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile) => {
        const projectConfig = readJsonFile(configFile);
        const root = dirname(configFile);

        return {
          projects: {
            [root]: processPrismaTargets(root, projectConfig),
          },
        };
      },
      configFiles,
      options,
      context
    );
  },
];

const processPrismaTargets = (configFileDir: string, projectConfig: object) => {
  const possiblePrismaPath = [
    `${configFileDir}/prisma/schema/schema.prisma`,
    `${configFileDir}/prisma/schema.prisma`,
  ];

  const hasFile = possiblePrismaPath.some((path) => fs.existsSync(path));

  const tasks = [
    ['prisma:generate', '@janus/prisma-plugin:generate'],
    ['prisma:reset', '@janus/prisma-plugin:reset'],
    ['prisma:migrate', '@janus/prisma-plugin:migrate'],
  ];

  const targets = Object.fromEntries(
    tasks.map(([name, executor]) => {
      return [
        name,
        {
          executor,
          options: {
            cwd: configFileDir,
          },
        },
      ];
    })
  );

  if (hasFile) {
    return {
      ...projectConfig,
      targets: {
        ...(projectConfig as { targets: object }).targets,
        ...targets,
      },
    };
  }

  return projectConfig ?? {};
};