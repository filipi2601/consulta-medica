import { Router } from "express";
import {
  getMedicos,
  createMedico,
  updateMedico,
  deleteMedico,
} from "../controllers/medicosController.js";

const router = Router();

router.get("/medicos", getMedicos);
router.post("/medicos", createMedico);
router.put("/medicos/:id", updateMedico);
router.delete("/medicos/:id", deleteMedico);

export default router;