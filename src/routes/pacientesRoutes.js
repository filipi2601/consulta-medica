import express from "express";
import {
  listarPacientes,
  criarPaciente,
  editarPaciente,
  deletarPaciente,
} from "../controllers/pacientesController.js";

const router = express.Router();

router.get("/", listarPacientes);
router.post("/", criarPaciente);
router.put("/:id", editarPaciente);
router.delete("/:id", deletarPaciente);

export default router;