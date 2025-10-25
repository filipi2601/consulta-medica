import express from "express";
import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar,
} from "../controllers/especialidadesgeraisController.js";

const router = express.Router();

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", deletar);

export default router;
