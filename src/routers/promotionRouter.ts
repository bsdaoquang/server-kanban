/** @format */

import { Router } from 'express';
import {
	addNew,
	checkDisCountCode,
	getPromotions,
	remove,
	update,
} from '../controllers/protions';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.get('/', getPromotions);

router.use(verifyToken);

router.get('/check', checkDisCountCode);
router.post('/add-new', addNew);
router.put('/update', update);
router.delete('/remove', remove);

export default router;
