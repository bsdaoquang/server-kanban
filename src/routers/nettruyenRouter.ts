/** @format */

import { Router } from 'express';
import { getChapDetail, getChappters } from '../controllers/nettruyen';

const router = Router();

router.get('/chapter', getChappters);
router.get('/chapter-detail', getChapDetail);

export default router;
