/** @format */

import { Router } from 'express';
import { create, getVerifiCode, resendCode } from '../controllers/customers';

const router = Router();

router.post('/add-new', create);
router.put('/verify', getVerifiCode);
router.get('/resend-verify', resendCode);

export default router;
