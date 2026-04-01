"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitUndefined = omitUndefined;
function omitUndefined(obj) {
    const result = {};
    for (const key in obj) {
        const value = obj[key];
        if (value !== undefined) {
            result[key] = value;
        }
    }
    return result;
}
//# sourceMappingURL=object.utils.js.map