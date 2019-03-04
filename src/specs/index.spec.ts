import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { SupportedTypes } from '../utils/supported-types';
import { Schema as Options } from './schema';

describe('Spec Schematic', () => {
  const thisSchematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    path.join(__dirname, '../collection.json'),
  );

  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    path.join(__dirname, '../../node_modules/@schematics/angular/collection.json'),
  );

  const defaultOptions: Options = {
    name: '',
    project: 'bar',
  };

  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };

  const appOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false,
    skipPackageJson: false,
  };

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = schematicRunner.runSchematic('workspace', workspaceOptions);
    appTree = schematicRunner.runSchematic('application', appOptions, appTree);
  });

  function createSchematic(schematic: string, options: { [prop: string]: string | boolean }) {
    let tree = schematicRunner.runSchematic(schematic, options, appTree);

    expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.spec.ts`)).toBeFalsy();
    expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.ts`)).toBeTruthy();

    return tree;
  }

  function populateTree(...paths: string[]) {
    let tree: UnitTestTree = appTree;

    paths.forEach(path => {
      tree = createSchematic('pipe', {
        path,
        name: 'foo',
        spec: false,
        export: false,
        flat: false,
        project: 'bar',
      });

      tree = createSchematic('guard', {
        path,
        name: 'foo',
        spec: false,
        flat: false,
        project: 'bar',
      });

      tree = createSchematic('service', {
        path,
        name: 'foo',
        spec: false,
        flat: false,
        project: 'bar',
      });

      tree = createSchematic('component', {
        path,
        name: 'foo',
        inlineStyle: false,
        inlineTemplate: false,
        changeDetection: 'Default',
        styleext: 'css',
        spec: false,
        export: false,
        project: 'bar',
      });

      tree = createSchematic('directive', {
        path,
        name: 'foo',
        spec: false,
        export: false,
        prefix: 'app',
        flat: false,
        project: 'bar',
      });
    });

    return tree;
  }

  it('should create specs for all possible types in the tree', () => {
    let tree = populateTree('/projects/bar/src/app', '/projects/bar/src/app/foo/bar');

    SupportedTypes.forEach(schematic => {
      expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.spec.ts`)).toBeFalsy();
      expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.ts`)).toBeTruthy();
    });

    const options = { ...defaultOptions, name: '**/*.ts' };

    tree = thisSchematicRunner.runSchematic('specs', options, tree);

    function fileExists(filePath: string) {
      return tree.files.includes(`/projects/bar/src/app/${filePath}`)
    }

    function check(entityPath: string) {
      expect(fileExists(`${entityPath}.spec.ts`)).toBeTruthy();
      expect(fileExists(`${entityPath}.ts`)).toBeTruthy();
    }

    SupportedTypes.forEach(schematic => check('foo/foo.' + schematic));
    SupportedTypes.forEach(schematic => check('foo/bar/foo/foo.' + schematic));
  });

  it('should create specs for all possible types in the subtree', () => {
    let tree = populateTree('/projects/bar/src/app', '/projects/bar/src/app/foo/bar');

    SupportedTypes.forEach(schematic => {
      expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.spec.ts`)).toBeFalsy();
      expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.ts`)).toBeTruthy();
    });

    const options = { ...defaultOptions, name: 'foo/bar/foo/*.ts' };

    tree = thisSchematicRunner.runSchematic('specs', options, tree);

    function fileExists(filePath: string) {
      return tree.files.includes(`/projects/bar/src/app/${filePath}`)
    }

    function check(entityPath: string, specShouldBeFound: boolean) {
      expect(fileExists(`${entityPath}.spec.ts`)).toBe(specShouldBeFound);
      expect(fileExists(`${entityPath}.ts`)).toBeTruthy();
    }

    SupportedTypes.forEach(schematic => check('foo/foo.' + schematic, false));
    SupportedTypes.forEach(schematic => check('foo/bar/foo/foo.' + schematic, true));
  });

});
