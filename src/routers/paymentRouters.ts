/** @format */

import { Router } from 'express';
import { addBill } from '../controllers/paymentControllers';

const router = Router();

router.post('/add-bill', addBill);

export default router;
