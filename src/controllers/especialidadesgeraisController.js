import EspecialidadeModel from "../models/especialidadesgeraisModel.js";

export async function listar(req, res) {
  try {
    const especialidades = await EspecialidadeModel.getAll();
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar especialidades", error });
  }
}

export async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const especialidade = await EspecialidadeModel.getById(id);

    if (!especialidade) {
      return res.status(404).json({ message: "Especialidade não encontrada" });
    }

    res.json(especialidade);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar especialidade", error });
  }
}

export async function criar(req, res) {
  try {
    const { nomeEspecialidade } = req.body;

    if (!nomeEspecialidade) {
      return res
        .status(400)
        .json({ message: "nomeEspecialidade é obrigatório" });
    }

    const nova = await EspecialidadeModel.create(nomeEspecialidade);
    res.status(201).json(nova);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar especialidade", error });
  }
}

export async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nomeEspecialidade } = req.body;

    if (!nomeEspecialidade) {
      return res
        .status(400)
        .json({ message: "nomeEspecialidade é obrigatório" });
    }

    const existente = await EspecialidadeModel.getById(id);
    if (!existente) {
      return res.status(404).json({ message: "Especialidade não encontrada" });
    }

    const atualizada = await EspecialidadeModel.update(id, nomeEspecialidade);
    res.json(atualizada);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar especialidade", error });
  }
}

export async function deletar(req, res) {
  try {
    const { id } = req.params;

    const existente = await EspecialidadeModel.getById(id);
    if (!existente) {
      return res.status(404).json({ message: "Especialidade não encontrada" });
    }

    await EspecialidadeModel.delete(id);
    res.json({ message: "Especialidade removida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar especialidade", error });
  }
}
