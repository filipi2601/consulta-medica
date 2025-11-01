import * as medicoEspecialidadeModel from "../models/medicoEspecialidadeModel.js";
import * as medicoModel from "../models/medicoModel.js";
import * as especialidadeModel from "../models/especialidadeModel.js";

// 🔹 Listar todos os vínculos médico ↔ especialidade
export async function listarTodosVinculos() {
  return medicoEspecialidadeModel.getAllVinculos();
}

// 🔹 Listar especialidades de um médico específico
export async function listarEspecialidadesMedico(id_medico) {
  if (!id_medico) {
    throw new Error("ID do médico é obrigatório.");
  }

  const medico = await medicoModel.findById(id_medico);
  if (!medico) {
    throw new Error("Médico não encontrado.");
  }

  return medicoEspecialidadeModel.getEspecialidadesMedico(id_medico);
}

// 🔹 Vincular médico e especialidade
export async function vincularEspecialidade(id_medico, id_especialidade) {
  if (!id_medico || !id_especialidade) {
    throw new Error("ID do médico e ID da especialidade são obrigatórios.");
  }

  const medico = await medicoModel.findById(id_medico);
  if (!medico) {
    throw new Error("Médico não encontrado.");
  }

  const especialidade = await especialidadeModel.findById(id_especialidade);
  if (!especialidade) {
    throw new Error("Especialidade não encontrada.");
  }

  const vinculoExistente = await medicoEspecialidadeModel.findVinculo(id_medico, id_especialidade);
  if (vinculoExistente) {
    throw new Error("Este médico já está vinculado a esta especialidade.");
  }

  const novoId = await medicoEspecialidadeModel.vincular(id_medico, id_especialidade);
  return medicoEspecialidadeModel.findVinculo(id_medico, id_especialidade);
}

// 🔹 Atualizar vínculo (alterar a especialidade de um médico)
export async function atualizarEspecialidade(id_medico, id_especialidade, novo_id_especialidade) {
  if (!id_medico || !id_especialidade || !novo_id_especialidade) {
    throw new Error("IDs do médico, especialidade atual e nova especialidade são obrigatórios.");
  }

  const medico = await medicoModel.findById(id_medico);
  if (!medico) {
    throw new Error("Médico não encontrado.");
  }

  const especialidadeAtual = await especialidadeModel.findById(id_especialidade);
  if (!especialidadeAtual) {
    throw new Error("Especialidade atual não encontrada.");
  }

  const novaEspecialidade = await especialidadeModel.findById(novo_id_especialidade);
  if (!novaEspecialidade) {
    throw new Error("Nova especialidade não encontrada.");
  }

  const vinculoExistente = await medicoEspecialidadeModel.findVinculo(id_medico, novo_id_especialidade);
  if (vinculoExistente) {
    throw new Error("Este médico já está vinculado à nova especialidade informada.");
  }

  const sucesso = await medicoEspecialidadeModel.atualizar(id_medico, id_especialidade, novo_id_especialidade);
  if (!sucesso) {
    throw new Error("Não foi possível atualizar o vínculo médico ↔ especialidade.");
  }

  return medicoEspecialidadeModel.findVinculo(id_medico, novo_id_especialidade);
}

// 🔹 Remover vínculo
export async function removerEspecialidade(id_medico, id_especialidade) {
  if (!id_medico || !id_especialidade) {
    throw new Error("ID do médico e ID da especialidade são obrigatórios para remoção.");
  }

  const medico = await medicoModel.findById(id_medico);
  if (!medico) {
    throw new Error("Médico não encontrado.");
  }

  const especialidade = await especialidadeModel.findById(id_especialidade);
  if (!especialidade) {
    throw new Error("Especialidade não encontrada.");
  }

  const vinculoExistente = await medicoEspecialidadeModel.findVinculo(id_medico, id_especialidade);
  if (!vinculoExistente) {
    throw new Error("O vínculo informado não existe.");
  }

  const sucesso = await medicoEspecialidadeModel.remover(id_medico, id_especialidade);
  if (!sucesso) {
    throw new Error("Não foi possível remover o vínculo médico ↔ especialidade.");
  }
}
