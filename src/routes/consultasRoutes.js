import * as consultaController from '../controllers/consultaController.js';
import { Router } from 'express';

const router = Router();
router.post('/', consultaController.agendarConsulta);
router.get('/', consultaController.listarConsultas);
router.get('/:id', consultaController.buscarConsultaPorId);
router.put('/:id', consultaController.atualizarConsulta);
router.delete('/:id', consultaController.cancelarConsulta);

export default router;