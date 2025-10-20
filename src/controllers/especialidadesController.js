import {
  getEspecialidades,
  addEspecialidade,
  updateEspecialidade,
  deleteEspecialidade,
} from "../models/especialidadesModel.js";

export async function listarEspecialidades(req, res) {
  try {
    const especialidades = await getEspecialidades();
    res.json(especialidades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function criarEspecialidade(req, res) {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    const novo = await addEspecialidade({
      nome
    });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function editarEspecialidade(req, res) {
  try {
    const { id } = req.params;
    const atualizar = await updateEspecialidade(id, req.body);
    res.json(atualizar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletarEspecialidade(req, res) {
  try {
    const { id } = req.params;
    const resultado = await deleteEspecialidade(id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}