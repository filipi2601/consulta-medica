import * as medicoService from "../services/medicoService.js";

function mapErrorToStatus(error) {
  if (error.message.includes("nao encontrado")) {
    return 404;
  }

  if (
    error.message.includes("Ja existe") ||
    error.message.includes("invalido") ||
    error.message.includes("devem ser informados") ||
    error.message.includes("nao pode")
  ) {
    return 400;
  }

  return 500;
}

export async function getMedicos(req, res) {
  try {
    const medicos = await medicoService.listar();
    return res.json(medicos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createMedico(req, res) {
  try {
    const medico = await medicoService.criar(req.body);
    return res.status(201).json(medico);
  } catch (error) {
    const status = mapErrorToStatus(error);
    return res.status(status).json({ message: error.message });
  }
}

export async function updateMedico(req, res) {
  try {
    const { id } = req.params;
    const medico = await medicoService.atualizar(id, req.body);
    return res.json(medico);
  } catch (error) {
    const status = mapErrorToStatus(error);
    return res.status(status).json({ message: error.message });
  }
}

export async function deleteMedico(req, res) {
  try {
    const { id } = req.params;
    await medicoService.remover(id);
    return res.status(204).send();
  } catch (error) {
    const status = mapErrorToStatus(error);
    return res.status(status).json({ message: error.message });
  }
}
