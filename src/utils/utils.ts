import { SupportedTypes } from './supported-types';

export function describeFile(fullPath: string) {
  const [, name, type] = (fullPath.replace(/\.ts$/, '').match(/(.*)\.([^.]+)$/) || [null, null, null]) as string[];

  if (!name || !type) {
    return null;
  }

  const path = name.replace(/[^/\\]*$/, '');

  return {
    path: path.replace(/[^/\\]$/, ''),
    name: name.replace(path, ''),
    type,
    supported: SupportedTypes.includes(type)
  };
}

export function getStandardSchematicPath(type: string) {
  return require.resolve(`@schematics/angular/${type}/index.js`).replace(/index\.js$/, 'files');
}
