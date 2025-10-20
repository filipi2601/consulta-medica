import {
  agendarConsulta,
  listarConsultas,
  buscarConsultaPorId,
  atualizarConsulta,
  cancelarConsulta,
} from "../controllers/consultaController.js";
import { Router } from "express";

const router = Router();
router.post("/", agendarConsulta);
router.get("/", listarConsultas);
router.get("/:id", buscarConsultaPorId);
router.put("/:id", atualizarConsulta);
router.delete("/:id", cancelarConsulta);

export default router;
