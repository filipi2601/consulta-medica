import * as consultaService from '../services/consultaService.js';

export async function agendarConsulta(req, res) {
  try {
    const { idPaciente, idMedico, data_agendamentoConsulta } = req.body;
    
    const novaConsulta = await consultaService.agendar(idPaciente, idMedico, data_agendamentoConsulta);
    res.status(201).json(novaConsulta);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function listarConsultas(req, res) {
  try {
    const consultas = await consultaService.listarTodas();
    res.status(200).json(consultas);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function buscarConsultaPorId(req, res) {
  try {
    const { id } = req.params;
    const consulta = await consultaService.buscarPorId(id);
    res.status(200).json(consulta);

  } catch (error) {
    if (error.message === 'Consulta não encontrada.') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function atualizarConsulta(req, res) {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    const consultaAtualizada = await consultaService.atualizar(id, dadosAtualizados);
    res.status(200).json(consultaAtualizada);
    
  } catch (error) {
    if (error.message.includes('Consulta não encontrada')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
}

export async function cancelarConsulta(req, res) {
  try {
    const { id } = req.params;
    await consultaService.cancelar(id);
    res.status(204).send(); 
    
  } catch (error) {
    if (error.message.includes('Consulta não encontrada')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
}