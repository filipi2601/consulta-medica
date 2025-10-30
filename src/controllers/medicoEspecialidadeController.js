import {
  getAllVinculos,
  getEspecialidadesMedico,
  vincular,
  atualizar,
  remover
} from "../models/medicoEspecialidadeModel.js";

// Listar todos os vínculos
export async function listarTodosVinculos(req, res) {
  try {
    const dados = await getAllVinculos();
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Listar especialidades por médico
export async function listarEspecialidadesMedico(req, res) {
  try {
    const { id_medico } = req.params;
    const dados = await getEspecialidadesMedico(id_medico);
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Vincular especialidade ao médico
export async function vincularEspecialidade(req, res) {
  try {
    const { id_medico, id_especialidade } = req.body;
    await vincular(id_medico, id_especialidade);
    res.status(201).json({ message: "Vínculo criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Atualizar vínculo
export async function atualizarEspecialidade(req, res) {
  try {
    const { id_medico, id_especialidade } = req.params;
    const { novo_id_especialidade } = req.body;
    await atualizar(id_medico, id_especialidade, novo_id_especialidade);
    res.json({ message: "Vínculo atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Remover vínculo
export async function removerEspecialidade(req, res) {
  try {
    const { id_medico, id_especialidade } = req.params;
    await remover(id_medico, id_especialidade);
    res.json({ message: "Vínculo removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
