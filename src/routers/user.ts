/** @format */

import { Router } from 'express';
import { login, register } from '../controllers/user';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
