"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const core_2 = require("@angular-devkit/core");
const nodePath = require("path");
const supportedTypes = ['component', 'directive', 'guard', 'service', 'pipe', 'module'];
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
    const nameWithoutPath = core_2.basename(name);
    const namePath = core_2.dirname((path + '/' + name));
    return {
        name: nameWithoutPath,
        path: core_2.normalize('/' + namePath),
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
        if (!supportedTypes.includes(type)) {
            const ex = `The type "${type}" is not supported. Please use one of [${supportedTypes.join(', ')}].`;
            throw new schematics_1.SchematicsException(ex);
        }
        options.name = name;
        options.path = parsedPath.path;
        const schematicsPath = require.resolve(`@schematics/angular/${type}/index.js`).replace(/index\.js$/, 'files');
        console.log(nodePath.relative(__dirname, schematicsPath));
        const templateSource = schematics_1.apply(schematics_1.url(nodePath.relative(__dirname, schematicsPath)), [
            schematics_1.filter(path => path.endsWith('.spec.ts')),
            schematics_1.template(Object.assign({}, core_1.strings, { 'if-flat': () => '' }, options)),
            schematics_1.move(parsedPath.path),
        ]);
        return schematics_1.mergeWith(templateSource)(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map