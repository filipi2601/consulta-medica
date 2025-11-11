import express from "express";
import * as medicosController from "../controllers/medicosController.js";

const router = express.Router();

router.get("/", medicosController.listar);
router.get("/:id", medicosController.buscarPorId);
router.post("/", medicosController.criar);
router.put("/:id", medicosController.atualizar);
router.delete("/:id", medicosController.remover);

export default router;
