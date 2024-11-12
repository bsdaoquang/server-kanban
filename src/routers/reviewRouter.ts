/** @format */

import { Router } from 'express';
import { addnew, getAll, update } from '../controllers/reviewController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();
router.get('/', getAll);

router.use(verifyToken);
router.post('/add-new', addnew);
router.put('/update', update);

export default router;
