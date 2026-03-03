"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_LIMIT = exports.DEFAULT_LIMIT = void 0;
exports.parseLimit = parseLimit;
exports.DEFAULT_LIMIT = 20;
exports.MAX_LIMIT = 100;
function parseLimit(limit) {
    if (limit == null)
        return exports.DEFAULT_LIMIT;
    const n = Math.min(Math.max(1, limit), exports.MAX_LIMIT);
    return n;
}
//# sourceMappingURL=pagination.js.map