"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const minimatch = require("minimatch");
const nodePath = require("path");
const utils_1 = require("../utils/utils");
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
        let glob = core_1.normalize((options.path.startsWith('/') ? '' : '/') + options.path + '/' + options.name);
        const templateSources = [];
        // limit folders to look up
        ['src', 'projects'].forEach(dir => {
            host.getDir(dir).visit(file => {
                const fdesc = utils_1.describeFile(file);
                if (fdesc && minimatch(file, glob) && fdesc.supported) {
                    const spec = core_1.normalize(`${fdesc.path}/${fdesc.name}.${fdesc.type}.spec.ts`);
                    if (host.exists(spec)) {
                        console.log(`Skipped ${file}: spec already exists`);
                    }
                    else {
                        // important for windows to get the relative path, otherwise schematics becomes crazy when sees C:\bla\bla things
                        const relativeSchematicsPath = nodePath.relative(__dirname, utils_1.getStandardSchematicPath(fdesc.type));
                        options.name = fdesc.name;
                        options.path = fdesc.path;
                        templateSources.push(schematics_1.apply(schematics_1.url(relativeSchematicsPath), [
                            schematics_1.filter(path => path.endsWith('.spec.ts.template')),
                            schematics_1.applyTemplates(Object.assign({}, core_1.strings, { 'if-flat': () => '' }, options)),
                            schematics_1.move(fdesc.path),
                        ]));
                    }
                }
            });
        });
        return schematics_1.chain(templateSources.map(ts => schematics_1.mergeWith(ts)))(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map