/** @format */

import { Router } from 'express';
import { addCategory, getCategories } from '../controllers/products';

const router = Router();
router.post('/add-category', addCategory);
router.get('/get-categories', getCategories);
export default router;
