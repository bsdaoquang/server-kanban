"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const router = (0, express_1.Router)();
router.post('/add-new', products_1.addProduct);
router.get('/', products_1.getProducts);
router.get('/detail', products_1.getProductDetail);
router.post('/add-sub-product', products_1.addSubProduct);
router.delete('/delete', products_1.removeProduct);
router.put('/update', products_1.updateProduct);
router.delete('/remove-sub-product', products_1.removeSubProduct);
router.put('/update-sub-product', products_1.updateSubProduct);
// categories
router.post('/add-category', products_1.addCategory);
router.get('/get-categories', products_1.getCategories);
router.get('/categories/detail', products_1.getCategoryDetail);
router.delete('/delete-category', products_1.deleteCategories);
router.put('/update-category', products_1.updateCategory);
router.get('/get-filter-values', products_1.getFilterValues);
router.post('/filter-products', products_1.filterProducts);
exports.default = router;
//# sourceMappingURL=productRouter.js.map