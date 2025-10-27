import * as pacienteService from "../services/pacienteService.js";

function mapErrorToStatus(error) {
  if (error.message.includes("nao encontrado")) {
    return 404;
  }

  if (
    error.message.includes("Ja existe") ||
    error.message.includes("invalido") ||
    error.message.includes("obrigatorios") ||
    error.message.includes("nao pode")
  ) {
    return 400;
  }

  return 500;
}

export async function listarPacientes(req, res) {
  try {
    const pacientes = await pacienteService.listar();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function criarPaciente(req, res) {
  try {
    const paciente = await pacienteService.criar(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    const status = mapErrorToStatus(error);
    res.status(status).json({ message: error.message });
  }
}

export async function editarPaciente(req, res) {
  try {
    const { id } = req.params;
    const paciente = await pacienteService.atualizar(id, req.body);
    res.json(paciente);
  } catch (error) {
    const status = mapErrorToStatus(error);
    res.status(status).json({ message: error.message });
  }
}

export async function deletarPaciente(req, res) {
  try {
    const { id } = req.params;
    await pacienteService.remover(id);
    res.status(204).send();
  } catch (error) {
    const status = mapErrorToStatus(error);
    res.status(status).json({ message: error.message });
  }
}
