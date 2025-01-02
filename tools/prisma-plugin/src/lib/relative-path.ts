export function getRelativePath(fromPath: string, toPath: string): string {
  const normalizedFromPath = fromPath.replace(/\\/g, '/').replace(/\/$/, '');
  const normalizedToPath = toPath.replace(/\\/g, '/').replace(/\/$/, '');

  const fromParts = normalizedFromPath.split('/');
  const toParts = normalizedToPath.split('/');

  let commonPrefixLength = 0;
  const minLength = Math.min(fromParts.length, toParts.length);

  for (let i = 0; i < minLength; i++) {
    if (fromParts[i] !== toParts[i]) {
      break;
    }
    commonPrefixLength++;
  }

  const upCount = fromParts.length - commonPrefixLength;

  const relativeParts: string[] = [];

  for (let i = 0; i < upCount; i++) {
    relativeParts.push('..');
  }

  relativeParts.push(...toParts.slice(commonPrefixLength));

  const relativePath = relativeParts.join('/');

  if (relativePath === '') {
    return '.';
  }

  return relativePath;
}