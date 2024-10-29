/** @format */

import { Router } from 'express';
import {
	addProduct,
	getCartItems,
	removeCartItem,
	updateProductInCart,
} from '../controllers/cartController';

const router = Router();

router.post('/add-new', addProduct);
router.put('/update', updateProductInCart);
router.get('/', getCartItems);
router.delete('/remove', removeCartItem);

export default router;
