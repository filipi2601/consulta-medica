import { Router } from "express";
import {
  listarTodosVinculos,
  listarEspecialidadesMedico,
  vincularEspecialidade,
  atualizarEspecialidade,
  removerEspecialidade
} from "../controllers/medicoEspecialidadeController.js";

const router = Router();

router.get("/", listarTodosVinculos);
router.get("/:id_medico", listarEspecialidadesMedico);
router.post("/", vincularEspecialidade);
router.put("/:id_medico/:id_especialidade", atualizarEspecialidade);
router.delete("/:id_medico/:id_especialidade", removerEspecialidade);

export default router;
