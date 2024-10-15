/** @format */

import { Router } from 'express';
import { addNew, getPromotions, remove, update } from '../controllers/protions';

const router = Router();

router.post('/add-new', addNew);
router.get('/', getPromotions);
router.put('/update', update);
router.delete('/remove', remove);

export default router;
