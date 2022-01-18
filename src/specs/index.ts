import { normalize, strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { apply, applyTemplates, chain, filter, mergeWith, move, Rule, SchematicContext, SchematicsException, Source, Tree, url } from '@angular-devkit/schematics';
import * as minimatch from 'minimatch';
import * as nodePath from 'path';
import { describeFile, getStandardSchematicPath } from '../utils/utils';
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

    let glob = normalize((options.path.startsWith('/') ? '' : '/') + options.path + '/' + options.name);

    const templateSources: Source[] = [];

    // limit folders to look up
    ['src', 'projects'].forEach(dir => {
      host.getDir(dir).visit(file => {
        const fdesc = describeFile(file);

        if (fdesc && minimatch(file, glob) && fdesc.supported) {
          const spec = normalize(`${fdesc.path}/${fdesc.name}.${fdesc.type}.spec.ts`);

          if (host.exists(spec)) {
            console.log(`Skipped ${file}: spec already exists`);
          } else {
            // important for windows to get the relative path, otherwise schematics becomes crazy when sees C:\bla\bla things
            const relativeSchematicsPath = nodePath.relative(__dirname, getStandardSchematicPath(fdesc.type));

            options.name = fdesc.name;
            options.type = fdesc.type;
            options.path = fdesc.path;

            templateSources.push(
              apply(
                url(relativeSchematicsPath),
                [
                  filter(path => path.endsWith('.spec.ts.template')),
                  applyTemplates({
                    ...strings,
                    'if-flat': () => '',
                    ...options,
                  }),
                  move(fdesc.path),
                ]
              )
            );
          }
        }
      });
    })

    return chain(templateSources.map(ts => mergeWith(ts)))(host, context);
  };
}
