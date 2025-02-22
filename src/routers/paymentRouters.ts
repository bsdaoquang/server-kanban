/** @format */

import { Router } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import {
	addBill,
	getStatistics,
	updateBill,
} from '../controllers/paymentControllers';

const htmlFile = path.join(__dirname, '../../mails/paymentdone.html');

const html = readFileSync(htmlFile, 'utf-8');

const router = Router();

router.post('/add-bill', addBill);
router.get('/statistics', getStatistics);
router.put('/put-payment', updateBill);

export default router;
