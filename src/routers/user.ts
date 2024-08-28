/** @format */

import { Router } from 'express';
import { login, loginWithGoogle, register } from '../controllers/user';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', loginWithGoogle);

export default router;
