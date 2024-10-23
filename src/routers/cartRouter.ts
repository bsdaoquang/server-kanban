/** @format */

import { Router } from 'express';
import { addProduct, getCartItems } from '../controllers/cartController';

const router = Router();

router.post('/add-new', addProduct);
router.get('/', getCartItems);

export default router;
