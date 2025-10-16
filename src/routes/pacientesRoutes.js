import express from 'express';
import { getPacientes, addPaciente, initPacientesTable } from '../models/pacientesModel.js';

const router = express.Router();

initPacientesTable();

// GET /api/pacientes
router.get('/', async (req, res) => {
  try {
    const pacientes = await getPacientes();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pacientes
router.post('/', async (req, res) => {
  try {
    const novo = await addPaciente(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
