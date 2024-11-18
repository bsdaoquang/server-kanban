/** @format */

import { Router } from 'express';
import {
	addnew,
	getAll,
	getData,
	update,
} from '../controllers/reviewController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();
router.get('/', getAll);

router.use(verifyToken);
router.post('/add-new', addnew);
router.put('/update', update);
router.get('/get-start-count', getData);

export default router;
