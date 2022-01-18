"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspace = exports.getWorkspacePath = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const nodePath = require("path");
const supported_types_1 = require("../utils/supported-types");
function getWorkspacePath(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    return path;
}
exports.getWorkspacePath = getWorkspacePath;
function getWorkspace(host) {
    const path = getWorkspacePath(host);
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find (${path})`);
    }
    const config = configBuffer.toString();
    return JSON.parse(config);
}
exports.getWorkspace = getWorkspace;
function parseName(path, name) {
    const nameWithoutPath = (0, core_1.basename)(name);
    const namePath = (0, core_1.dirname)((path + '/' + name));
    return {
        name: nameWithoutPath,
        path: (0, core_1.normalize)('/' + namePath),
    };
}
function default_1(options) {
    return (host, context) => {
        const workspace = getWorkspace(host);
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
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
            throw new schematics_1.SchematicsException('The provided name / file should look like name.type (e.g. component-name.component)'
                + ' or name.type.ts (e.g. component-name.component.ts).');
        }
        if (!supported_types_1.SupportedTypes.includes(type)) {
            const ex = `The type "${type}" is not supported. Please use one of [${supported_types_1.SupportedTypes.join(', ')}].`;
            throw new schematics_1.SchematicsException(ex);
        }
        options.name = name;
        options.type = type;
        options.path = parsedPath.path;
        const schematicsPath = require.resolve(`@schematics/angular/${type}/index.js`).replace(/index\.js$/, 'files');
        const targetPath = `${parsedPath.path}/${name}.${type}.ts`;
        if (!host.exists(targetPath) && !options.ignoreTargetNotFound) {
            throw new schematics_1.SchematicsException(`Target file ${targetPath} is not existing`);
        }
        // important for windows to get the relative path, otherwise schematics becomes crazy when sees C:\bla\bla things
        const relativeSchematicsPath = nodePath.relative(__dirname, schematicsPath);
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)(relativeSchematicsPath), [
            (0, schematics_1.filter)(path => path.endsWith('.spec.ts.template')),
            (0, schematics_1.applyTemplates)(Object.assign(Object.assign(Object.assign({}, core_1.strings), { 'if-flat': () => '' }), options)),
            (0, schematics_1.move)(parsedPath.path),
        ]);
        return (0, schematics_1.mergeWith)(templateSource)(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map