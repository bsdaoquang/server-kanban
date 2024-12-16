/** @format */

import { Router } from 'express';
import { addBill } from '../controllers/paymentControllers';
import { handleSendMail } from '../utils/handleSendMail';
import path from 'path';
import { readFileSync } from 'fs';

const htmlFile = path.join(__dirname, '../../mails/paymentdone.html');

const html = readFileSync(htmlFile, 'utf-8');

const router = Router();

router.post('/add-bill', addBill);

export default router;
