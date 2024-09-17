/** @format */

import { Router } from 'express';
import {
	addCategory,
	addProduct,
	addSubProduct,
	deleteCategories,
	getCategories,
	getCategoryDetail,
	getProducts,
	updateCategory,
} from '../controllers/products';

const router = Router();

router.post('/add-new', addProduct);
router.get('/', getProducts);
router.post('/add-sub-product', addSubProduct);

// categories
router.post('/add-category', addCategory);
router.get('/get-categories', getCategories);
router.get('/categories/detail', getCategoryDetail);
router.delete('/delete-category', deleteCategories);
router.put('/update-category', updateCategory);
export default router;
