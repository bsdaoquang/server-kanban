"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const router = (0, express_1.Router)();
router.get('/products', products_1.getProducts);
exports.default = router;
//# sourceMappingURL=storage.js.map