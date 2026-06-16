import { Router } from 'express';
import * as Pets from '../controllers/pets.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { exigirAdmin } from '../middlewares/admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Públicas
router.get('/', asyncHandler(Pets.listar));
router.get('/:id', asyncHandler(Pets.detalhar));

// Admin
router.post('/', autenticar, exigirAdmin, asyncHandler(Pets.criar));
router.put('/:id', autenticar, exigirAdmin, asyncHandler(Pets.atualizar));
router.delete('/:id', autenticar, exigirAdmin, asyncHandler(Pets.deletar));

router.post('/:id/fotos', autenticar, exigirAdmin, asyncHandler(Pets.adicionarFoto));
router.delete('/:id/fotos/:fotoId', autenticar, exigirAdmin, asyncHandler(Pets.deletarFoto));

router.post('/:id/vacinas', autenticar, exigirAdmin, asyncHandler(Pets.adicionarVacina));
router.delete('/:id/vacinas/:vacinaId', autenticar, exigirAdmin, asyncHandler(Pets.deletarVacina));

export default router;
