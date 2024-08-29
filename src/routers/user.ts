/** @format */

import { Router } from 'express';
import {
	login,
	loginWithGoogle,
	refreshToken,
	register,
} from '../controllers/user';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', loginWithGoogle);
router.get('/refresh-token', refreshToken);

export default router;
