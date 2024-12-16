/** @format */

import { Router } from 'express';

import {
	getAllNotifications,
	update,
} from '../controllers/notificationsController';

const router = Router();

router.get('/', getAllNotifications);
router.put('/update', update);

export default router;
