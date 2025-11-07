import * as medicoEspecialidadeService from "../services/medicoEspecialidadeService.js";

export async function listarTodosVinculos(req, res) {
  try {
    const dados = await medicoEspecialidadeService.listarTodosVinculos();
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function listarEspecialidadesMedico(req, res) {
  try {
    const { id_medico } = req.params;
    const dados = await medicoEspecialidadeService.listarEspecialidadesMedico(id_medico);
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function vincularEspecialidade(req, res) {
  try {
    const { id_medico, id_especialidade } = req.body;
    const resultado = await medicoEspecialidadeService.vincularEspecialidade(id_medico, id_especialidade);
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message });
  }
}

export async function atualizarEspecialidade(req, res) {
  try {
    const { id_medico, id_especialidade } = req.params;
    const { novo_id_especialidade } = req.body;
    const resultado = await medicoEspecialidadeService.atualizarEspecialidade(id_medico, id_especialidade, novo_id_especialidade);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message });
  }
}

export async function removerEspecialidade(req, res) {
  try {
    const { id_medico, id_especialidade } = req.params;
    const vinculoExiste = await medicoEspecialidadeService.findVinculo(id_medico, id_especialidade);

    if (!vinculoExiste) {
      return res.status(404).json({ message: "Vínculo não encontrado" });
    }

    await medicoEspecialidadeService.removerEspecialidade(id_medico, id_especialidade);
    return res.status(200).json({ message: "Vínculo removido com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
