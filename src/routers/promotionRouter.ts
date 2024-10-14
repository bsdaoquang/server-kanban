/** @format */

import { Router } from 'express';
import { addNew, getPromotions } from '../controllers/protions';

const router = Router();

router.post('/add-new', addNew);
router.get('/', getPromotions);

export default router;
