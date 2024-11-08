/** @format */

import { Router } from 'express';
import {
	addCategory,
	addProduct,
	addSubProduct,
	deleteCategories,
	filterProducts,
	getBestSellers,
	getCategories,
	getCategoryDetail,
	getFilterValues,
	getProductDetail,
	getProducts,
	getRelatedProducts,
	removeProduct,
	removeSubProduct,
	updateCategory,
	updateProduct,
	updateSubProduct,
} from '../controllers/products';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.get('/detail', getProductDetail);
router.get('/', getProducts);
router.get('/get-filter-values', getFilterValues);
router.get('/categories/detail', getCategoryDetail);
router.get('/get-categories', getCategories);
router.get('/get-best-seller', getBestSellers);
router.get('/get-related-products', getRelatedProducts);

router.use(verifyToken);

router.post('/add-new', addProduct);
router.post('/add-sub-product', addSubProduct);
router.delete('/delete', removeProduct);
router.put('/update', updateProduct);
router.delete('/remove-sub-product', removeSubProduct);
router.put('/update-sub-product', updateSubProduct);
router.post('/add-category', addCategory);
router.delete('/delete-category', deleteCategories);
router.put('/update-category', updateCategory);
router.post('/filter-products', filterProducts);

export default router;
