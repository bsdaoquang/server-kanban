/** @format */

import { Router } from 'express';
import { addNew } from '../controllers/supplier';

const router = Router();

router.get('/');
router.post('/add-new', addNew);

export default router;
