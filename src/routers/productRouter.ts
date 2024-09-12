/** @format */

import { Router } from 'express';
import {
	addCategory,
	deleteCategories,
	getCategories,
} from '../controllers/products';

const router = Router();
router.post('/add-category', addCategory);
router.get('/get-categories', getCategories);
router.delete('/delete-category', deleteCategories);
export default router;
