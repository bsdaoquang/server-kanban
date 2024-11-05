/** @format */

import { Router } from 'express';
import {
	addNewAddress,
	addProduct,
	deleteAddress,
	getAddressByUser,
	getCartItems,
	removeCartItem,
	updateAddress,
	updateProductInCart,
} from '../controllers/cartController';

const router = Router();

router.post('/add-new', addProduct);
router.put('/update', updateProductInCart);
router.get('/', getCartItems);
router.delete('/remove', removeCartItem);
router.post('/add-new-address', addNewAddress);
router.get('/get-address', getAddressByUser);
router.delete('/remove-address', deleteAddress);
router.put('/update-address', updateAddress);

export default router;
