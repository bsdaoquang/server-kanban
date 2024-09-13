/** @format */

import { Router } from 'express';
import {
	addCategory,
	deleteCategories,
	getCategories,
	updateCategory,
} from '../controllers/products';

const router = Router();
router.post('/add-category', addCategory);
router.get('/get-categories', getCategories);
router.delete('/delete-category', deleteCategories);
router.put('/update-category', updateCategory);
export default router;
