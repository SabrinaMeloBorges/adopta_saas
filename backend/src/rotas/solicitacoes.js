import { Router } from 'express';
import * as Sol from '../controllers/solicitacoes.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { exigirAdmin } from '../middlewares/admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/', autenticar, asyncHandler(Sol.criar));
router.get('/', autenticar, asyncHandler(Sol.listar));
router.patch('/:id/status', autenticar, exigirAdmin, asyncHandler(Sol.atualizarStatus));
router.get('/admin/indicadores', autenticar, exigirAdmin, asyncHandler(Sol.indicadoresAdmin));

export default router;
