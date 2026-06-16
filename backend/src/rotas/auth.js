import { Router } from 'express';
import * as Auth from '../controllers/auth.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/registrar', asyncHandler(Auth.registrar));
router.post('/login', asyncHandler(Auth.login));
router.get('/me', autenticar, asyncHandler(Auth.eu));

export default router;
