import * as medicosService from "../services/medicosService.js";

// ✅ Listar todos os médicos
export async function listar(req, res) {
  try {
    const medicos = await medicosService.listarTodos(); // nome certo da função no service
    res.status(200).json(medicos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✅ Buscar médico por ID
export async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const medico = await medicosService.buscarPorId(id);

    if (!medico) {
      return res.status(404).json({ message: "Médico não encontrado" });
    }

    res.status(200).json(medico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✅ Criar novo médico
export async function criar(req, res) {
  try {
    const { nome, crm, email } = req.body;

    if (!nome || !crm) {
      return res.status(400).json({ message: "Nome e CRM são obrigatórios" });
    }

    const novoMedico = await medicosService.criar({ nome, crm, email });
    res.status(201).json({ message: "Médico criado com sucesso", medico: novoMedico });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✅ Atualizar médico
export async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, crm, email } = req.body;

    // Só atualiza os campos que foram enviados
    const campos = {};
    if (nome !== undefined) campos.nome = nome;
    if (crm !== undefined) campos.crm = crm;
    if (email !== undefined) campos.email = email;

    const atualizado = await medicosService.atualizar(id, campos);

    if (!atualizado) {
      return res.status(404).json({ message: "Médico não encontrado" });
    }

    res.status(200).json({ message: "Médico atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// ✅ Remover médico
export async function remover(req, res) {
  try {
    const { id } = req.params;
    const removido = await medicosService.remover(id);

    if (!removido) {
      return res.status(404).json({ message: "Médico não encontrado" });
    }

    res.status(200).json({ message: "Médico removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}