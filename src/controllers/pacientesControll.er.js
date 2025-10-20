import {
  getPacientes,
  addPaciente,
  updatePaciente,
  deletePaciente,
} from "../models/pacientesModel.js";

export async function listarPacientes(req, res) {
  try {
    const pacientes = await getPacientes();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function criarPaciente(req, res) {
  try {
    const { nome, cpf, data_nascimento, telefone, email } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    const novo = await addPaciente({
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
    });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function editarPaciente(req, res) {
  try {
    const { id } = req.params;
    const atualizar = await updatePaciente(id, req.body);
    res.json(atualizar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletarPaciente(req, res) {
  try {
    const { id } = req.params;
    const resultado = await deletePaciente(id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}