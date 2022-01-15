import { basename, dirname, normalize, Path, strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { apply, applyTemplates, filter, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import * as nodePath from 'path';
import { SupportedTypes } from '../utils/supported-types';
import { Schema as Options } from './schema';

export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  return path;
}

export function getWorkspace(host: Tree): WorkspaceSchema {
  const path = getWorkspacePath(host);
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const config = configBuffer.toString();

  return JSON.parse(config);
}

interface Location {
  name: string;
  path: Path;
}

function parseName(path: string, name: string): Location {
  const nameWithoutPath = basename(name as Path);
  const namePath = dirname((path + '/' + name) as Path);

  return {
    name: nameWithoutPath,
    path: normalize('/' + namePath),
  };
}

export default function (options: Options): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const project = workspace.projects[options.project];

    if (options.path === undefined) {
      const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
      options.path = `/${project.root}/src/${projectDirName}`;
    }

    const parsedPath = parseName(options.path, options.name);

    const [, name, type] = parsedPath.name.replace(/\.ts$/, '').match(/(.*)\.([^.]+)$/) || [
      null,
      null,
      null,
    ];

    if (!name || !type) {
      throw new SchematicsException(
        'The provided name / file should look like name.type (e.g. component-name.component)'
        + ' or name.type.ts (e.g. component-name.component.ts).',
      );
    }

    if (!SupportedTypes.includes(type)) {
      const ex = `The type "${type}" is not supported. Please use one of [${
        SupportedTypes.join(', ')
        }].`;

      throw new SchematicsException(ex);
    }

    options.name = name;
    options.type = type;
    options.path = parsedPath.path;

    const schematicsPath = require.resolve(`@schematics/angular/${type}/index.js`).replace(/index\.js$/, 'files');

    const targetPath = `${parsedPath.path}/${name}.${type}.ts`;

    if (!host.exists(targetPath) && !options.ignoreTargetNotFound) {
      throw new SchematicsException(`Target file ${targetPath} is not existing`);
    }

    // important for windows to get the relative path, otherwise schematics becomes crazy when sees C:\bla\bla things
    const relativeSchematicsPath = nodePath.relative(__dirname, schematicsPath);

    const templateSource = apply(url(relativeSchematicsPath), [
      filter(path => path.endsWith('.spec.ts.template')),
      applyTemplates({
        ...strings,
        'if-flat': () => '',
        ...options,
      }),
      move(parsedPath.path),
    ]);

    return mergeWith(templateSource)(host, context);
  };
}
