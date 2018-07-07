import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
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

  it('should create a spec for module', () => {
    testCreatedSpec('module', {
      name: 'foo',
      spec: false,
      flat: false,
      project: 'bar',
    });
  });

  function testCreatedSpec(schematic: string, targetOptions: { [prop: string]: string | boolean }) {
    const options = { ...defaultOptions, name: 'foo/foo.' + schematic };
    let tree = schematicRunner.runSchematic(schematic, targetOptions, appTree);

    expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${ schematic }.spec.ts`)).toBeFalsy();
    expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${ schematic }.ts`)).toBeTruthy();

    tree = thisSchematicRunner.runSchematic('spec', options, tree);

    const files = tree.files;

    expect(files.includes(`/projects/bar/src/app/foo/foo.${ schematic }.spec.ts`)).toBeTruthy();
    expect(files.includes(`/projects/bar/src/app/foo/foo.${ schematic }.ts`)).toBeTruthy();
  }

  it('should create a spec for component', () => {
    testCreatedSpec('component', {
      name: 'foo',
      inlineStyle: false,
      inlineTemplate: false,
      changeDetection: 'Default',
      styleext: 'css',
      spec: false,
      export: false,
      project: 'bar',
    });
  });

  it('should create a spec for directive', () => {
    testCreatedSpec('directive', {
      name: 'foo',
      spec: false,
      export: false,
      prefix: 'app',
      flat: false,
      project: 'bar',
    });
  });

  it('should create a spec for service', () => {
    testCreatedSpec('service', {
      name: 'foo',
      spec: false,
      flat: false,
      project: 'bar',
    });
  });

  it('should create a spec for guard', () => {
    testCreatedSpec('guard', {
      name: 'foo/foo', // foo folder here because guard flat parameter is ignored...
      spec: false,
      flat: false,
      project: 'bar',
    });
  });

  it('should create a spec for pipe', () => {
    testCreatedSpec('pipe', {
      name: 'foo',
      spec: false,
      export: false,
      flat: false,
      project: 'bar',
    });
  });

  it('should throw for not allowed types', () => {
    expect(() => {
      thisSchematicRunner.runSchematic('spec', { ...defaultOptions, name: 'foo/foo' }, appTree);
    }).toThrow();

    expect(() => {
      thisSchematicRunner.runSchematic('spec', { ...defaultOptions, name: 'foo/service' }, appTree);
    }).toThrow();

    expect(() => {
      thisSchematicRunner.runSchematic('spec', { ...defaultOptions, name: 'foo/foo.abc' }, appTree);
    }).toThrow();
  });

  it('should throw when target file is not found', () => {
    expect(() => {
      thisSchematicRunner.runSchematic('spec', { ...defaultOptions, name: 'foo/foo.service' }, appTree);
    }).toThrow();

    expect(() => {
      thisSchematicRunner.runSchematic('spec', { ...defaultOptions, name: 'foo/foo.service.ts' }, appTree);
    }).toThrow();
  });

  it('should throw when target file is not found and ignoreTargetNotFound is true', () => {
    expect(() => {
      thisSchematicRunner.runSchematic('spec', { ...defaultOptions, name: 'foo/foo.service', ignoreTargetNotFound: true }, appTree);
    }).not.toThrow();

    expect(() => {
      thisSchematicRunner.runSchematic('spec', { ...defaultOptions, name: 'foo/foo.service.ts', ignoreTargetNotFound: true }, appTree);
    }).not.toThrow();
  });

});
