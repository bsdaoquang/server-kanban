/** @format */

import { Router } from 'express';
import {
	addProduct,
	getCartItems,
	removeCartItem,
} from '../controllers/cartController';

const router = Router();

router.post('/add-new', addProduct);
router.get('/', getCartItems);
router.delete('/remove', removeCartItem);

export default router;
