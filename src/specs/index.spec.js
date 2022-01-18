"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
const supported_types_1 = require("../utils/supported-types");
describe('Spec Schematic', () => {
    const thisSchematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../collection.json'));
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../../node_modules/@schematics/angular/collection.json'));
    const defaultOptions = {
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
    let appTree;
    beforeEach(() => {
        appTree = schematicRunner.runSchematic('workspace', workspaceOptions);
        appTree = schematicRunner.runSchematic('application', appOptions, appTree);
    });
    function createSchematic(schematic, options) {
        let tree = schematicRunner.runSchematic(schematic, options, appTree);
        expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.spec.ts`)).toBeFalsy();
        expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.ts`)).toBeTruthy();
        return tree;
    }
    function populateTree(...paths) {
        let tree = appTree;
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
        supported_types_1.SupportedTypes.forEach(schematic => {
            expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.spec.ts`)).toBeFalsy();
            expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.ts`)).toBeTruthy();
        });
        const options = Object.assign(Object.assign({}, defaultOptions), { name: '**/*.ts' });
        tree = thisSchematicRunner.runSchematic('specs', options, tree);
        function fileExists(filePath) {
            return tree.files.includes(`/projects/bar/src/app/${filePath}`);
        }
        function check(entityPath) {
            expect(fileExists(`${entityPath}.spec.ts`)).toBeTruthy();
            expect(fileExists(`${entityPath}.ts`)).toBeTruthy();
        }
        supported_types_1.SupportedTypes.forEach(schematic => check('foo/foo.' + schematic));
        supported_types_1.SupportedTypes.forEach(schematic => check('foo/bar/foo/foo.' + schematic));
    });
    it('should create specs for all possible types in the subtree', () => {
        let tree = populateTree('/projects/bar/src/app', '/projects/bar/src/app/foo/bar');
        supported_types_1.SupportedTypes.forEach(schematic => {
            expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.spec.ts`)).toBeFalsy();
            expect(tree.files.includes(`/projects/bar/src/app/foo/foo.${schematic}.ts`)).toBeTruthy();
        });
        const options = Object.assign(Object.assign({}, defaultOptions), { name: 'foo/bar/foo/*.ts' });
        tree = thisSchematicRunner.runSchematic('specs', options, tree);
        function fileExists(filePath) {
            return tree.files.includes(`/projects/bar/src/app/${filePath}`);
        }
        function check(entityPath, specShouldBeFound) {
            expect(fileExists(`${entityPath}.spec.ts`)).toBe(specShouldBeFound);
            expect(fileExists(`${entityPath}.ts`)).toBeTruthy();
        }
        supported_types_1.SupportedTypes.forEach(schematic => check('foo/foo.' + schematic, false));
        supported_types_1.SupportedTypes.forEach(schematic => check('foo/bar/foo/foo.' + schematic, true));
    });
});
//# sourceMappingURL=index.spec.js.map