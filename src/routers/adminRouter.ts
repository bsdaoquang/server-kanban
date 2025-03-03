/** @format */

import { Router } from 'express';
import {
	getOrderAndPurchase,
	getTopCategories,
	getTopSellingAndLowQuantity,
	getTotalProfit,
} from '../controllers/adminController';

const router = Router();

router.get('/order-purchase', getOrderAndPurchase);
router.get('/top-selling', getTopSellingAndLowQuantity);
router.get('/total-profit', getTotalProfit);
router.get('/top-categories', getTopCategories);

export default router;
