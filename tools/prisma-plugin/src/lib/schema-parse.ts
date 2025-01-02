import { logger } from '@nx/devkit';

export function updatePrismaOutputPath(
  fileContents: string,
  expectedOutputPath: string
): string {
  const outputLineRegex = /^\s*output\s*=\s*["'].*["']\s*$/m;
  const outputValueRegex = /^\s*output\s*=\s*["'](.*?)["']\s*$/m;
  const generatorOpeningRegex = /generator\s+client\s*{/;

  const hasOutput = outputLineRegex.test(fileContents);

  if (!hasOutput) {
    logger.info(`No output property found under client generator, adding one`);

    const indentMatch = fileContents.match(/generator\s+client\s*{\n(\s+)\w+/);
    const indent = indentMatch ? indentMatch[1] : '  ';

    return fileContents.replace(
      generatorOpeningRegex,
      `generator client {\n${indent}output = "${expectedOutputPath}"`
    );
  }

  const outputMatch = fileContents.match(outputValueRegex);
  const currentOutputPath = outputMatch ? outputMatch[1] : null;

  if (currentOutputPath === expectedOutputPath) {
    return fileContents;
  }

  logger.info(
    `Updating output path from ${currentOutputPath} to ${expectedOutputPath}`
  );

  return fileContents.replace(outputValueRegex, (match) => {
    const indentation = match.match(/^\s*/)?.[0] || '';
    return `${indentation}output = "${expectedOutputPath}"`;
  });
}