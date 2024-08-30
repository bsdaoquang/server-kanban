/** @format */

import { Router } from 'express';
import {
	addNew,
	getSuppliers,
	removeSupplier,
	update,
} from '../controllers/supplier';

const router = Router();

router.get('/', getSuppliers);
router.post('/add-new', addNew);
router.put('/update', update);
router.delete('/remove', removeSupplier);

export default router;
