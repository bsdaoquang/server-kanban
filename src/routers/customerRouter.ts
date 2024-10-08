/** @format */

import { Router } from 'express';
import { create, getVerifiCode } from '../controllers/customers';

const router = Router();

router.post('/add-new', create);
router.put('/verify', getVerifiCode);

export default router;
