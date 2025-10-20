import express from "express";
import {
  listarPacientes,
  criarPaciente,
  editarPaciente,
  deletarPaciente,
} from "../controllers/pacientesController.js";

const router = express.Router();

router.get("/pacientes", listarPacientes);
router.post("/pacientes", criarPaciente);
router.put("/pacientes/:id", editarPaciente);
router.delete("/pacientes/:id", deletarPaciente);

export default router;