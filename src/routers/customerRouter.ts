/** @format */

import { Router } from 'express';
import { create } from '../controllers/customers';

const router = Router();

router.post('/add-new', create);

export default router;
