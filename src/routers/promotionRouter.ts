/** @format */

import { Router } from 'express';
import { addNew } from '../controllers/protions';

const router = Router();

router.post('/add-new', addNew);

export default router;
