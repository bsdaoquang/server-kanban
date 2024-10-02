"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
router.post('/register', user_1.register);
router.post('/login', user_1.login);
router.post('/google-login', user_1.loginWithGoogle);
router.get('/refresh-token', user_1.refreshToken);
exports.default = router;
//# sourceMappingURL=user.js.map