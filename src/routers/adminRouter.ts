/** @format */

import { Router } from 'express';
import { getOrderAndPurchase } from '../controllers/adminController';

const router = Router();

router.get('/order-purchase', getOrderAndPurchase);

export default router;
