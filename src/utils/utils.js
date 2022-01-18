"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStandardSchematicPath = exports.describeFile = void 0;
const supported_types_1 = require("./supported-types");
function describeFile(fullPath) {
    const [, name, type] = (fullPath.replace(/\.ts$/, '').match(/(.*)\.([^.]+)$/) || [null, null, null]);
    if (!name || !type) {
        return null;
    }
    const path = name.replace(/[^/\\]*$/, '');
    return {
        path: path.replace(/[^/\\]$/, ''),
        name: name.replace(path, ''),
        type,
        supported: supported_types_1.SupportedTypes.includes(type)
    };
}
exports.describeFile = describeFile;
function getStandardSchematicPath(type) {
    return require.resolve(`@schematics/angular/${type}/index.js`).replace(/index\.js$/, 'files');
}
exports.getStandardSchematicPath = getStandardSchematicPath;
//# sourceMappingURL=utils.js.map