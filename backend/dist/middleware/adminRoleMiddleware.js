"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoleMiddleware = void 0;
const adminRoleMiddleware = (req, res, next) => {
    var _a;
    if (!req.user || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "ADMIN") {
        return res.status(403).json({ message: "access denied" });
    }
    next();
};
exports.adminRoleMiddleware = adminRoleMiddleware;
