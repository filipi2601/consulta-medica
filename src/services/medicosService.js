import * as Medico from "../models/medicosModel.js";

// 🔹 Listar todos os médicos
export async function listarTodos() {
  try {
    const medicos = await Medico.listarTodos();
    return medicos;
  } catch (error) {
    throw new Error("Erro ao listar médicos: " + error.message);
  }
}

// 🔹 Buscar médico por ID
export async function buscarPorId(id) {
  if (!id) throw new Error("ID do médico é obrigatório.");

  try {
    const medico = await Medico.buscarPorId(id);
    if (!medico) throw new Error("Médico não encontrado.");
    return medico;
  } catch (error) {
    throw new Error("Erro ao buscar médico: " + error.message);
  }
}

// 🔹 Criar novo médico (campos opcionais)
export async function criar(dados) {
  if (!dados || Object.keys(dados).length === 0) {
    throw new Error("Dados do médico não informados.");
  }

  try {
    const medico = await Medico.criar(dados);
    return medico;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("CRM ou e-mail já cadastrados.");
    }
    throw new Error("Erro ao criar médico: " + error.message);
  }
}

// 🔹 Atualizar médico (campos individuais ou múltiplos)
export async function atualizar(id, campos) {
  if (!id) throw new Error("ID do médico é obrigatório.");

  if (!campos || Object.keys(campos).length === 0) {
    throw new Error("Nenhum campo informado para atualização.");
  }

  try {
    const atualizado = await Medico.atualizar(id, campos);
    if (!atualizado) throw new Error("Médico não encontrado para atualizar.");
    return { message: "Médico atualizado com sucesso." };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("CRM ou e-mail já cadastrados.");
    }
    throw new Error("Erro ao atualizar médico: " + error.message);
  }
}

// 🔹 Remover médico
export async function remover(id) {
  if (!id) throw new Error("ID do médico é obrigatório.");

  try {
    const removido = await Medico.remover(id);
    if (!removido) throw new Error("Médico não encontrado para remoção.");
    return { message: "Médico removido com sucesso." };
  } catch (error) {
    throw new Error("Erro ao remover médico: " + error.message);
  }
}
