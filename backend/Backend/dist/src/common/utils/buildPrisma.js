"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitUndefinedDeep = omitUndefinedDeep;
exports.buildPrismaUpdate = buildPrismaUpdate;
exports.buildPrismaCreate = buildPrismaCreate;
function omitUndefinedDeep(obj) {
    if (Array.isArray(obj)) {
        const arr = obj;
        return arr.map((item) => omitUndefinedDeep(item));
    }
    if (obj !== null && typeof obj === 'object') {
        const result = {};
        for (const key in obj) {
            const value = obj[key];
            if (value === undefined || value === null)
                continue;
            result[key] = omitUndefinedDeep(value);
        }
        return result;
    }
    return obj;
}
function buildPrismaUpdate(dto, relations) {
    const data = {};
    for (const key in dto) {
        const value = dto[key];
        if (value === undefined)
            continue;
        const relationConfig = relations?.[key];
        if (relationConfig &&
            relationConfig.type === 'array' &&
            Array.isArray(value)) {
            data[key] = {
                deleteMany: {},
                create: value.map((item) => omitUndefinedDeep(relationConfig.map(item))),
            };
            continue;
        }
        if (key === 'planned_date' && value) {
            data[key] = new Date(value);
            continue;
        }
        data[key] = value;
    }
    return data;
}
function buildPrismaCreate(dto) {
    const data = {};
    for (const key in dto) {
        const value = dto[key];
        if (value === undefined || value === null)
            continue;
        data[key] = value;
    }
    return data;
}
//# sourceMappingURL=buildPrisma.js.map