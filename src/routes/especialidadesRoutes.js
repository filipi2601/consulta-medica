import express from "express";
import {
  listarEspecialidades,
  criarEspecialidade,
  editarEspecialidade,
  deletarEspecialidade,
} from "../controllers/especialidadesController.js";

const router = express.Router();

router.get("/", listarEspecialidades);
router.post("/", criarEspecialidade);
router.put("/:id", editarEspecialidade);
router.delete("/:id", deletarEspecialidade);

export default router;