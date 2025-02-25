/** @format */

import { Router } from 'express';
import {
	getOrderAndPurchase,
	getTopSellingAndLowQuantity,
} from '../controllers/adminController';

const router = Router();

router.get('/order-purchase', getOrderAndPurchase);
router.get('/top-selling', getTopSellingAndLowQuantity);

export default router;
