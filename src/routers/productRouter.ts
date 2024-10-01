/** @format */

import { Router } from 'express';
import {
	addCategory,
	addProduct,
	addSubProduct,
	deleteCategories,
	filterProducts,
	getCategories,
	getCategoryDetail,
	getFilterValues,
	getProductDetail,
	getProducts,
	removeProduct,
	removeSubProduct,
	updateCategory,
	updateProduct,
	updateSubProduct,
} from '../controllers/products';

const router = Router();

router.post('/add-new', addProduct);
router.get('/', getProducts);
router.get('/detail', getProductDetail);
router.post('/add-sub-product', addSubProduct);
router.delete('/delete', removeProduct);
router.put('/update', updateProduct);
router.delete('/remove-sub-product', removeSubProduct);
router.put('/update-sub-product', updateSubProduct);

// categories
router.post('/add-category', addCategory);
router.get('/get-categories', getCategories);
router.get('/categories/detail', getCategoryDetail);
router.delete('/delete-category', deleteCategories);
router.put('/update-category', updateCategory);
router.get('/get-filter-values', getFilterValues);
router.post('/filter-products', filterProducts);
export default router;
